from mod_python import apache,util
import subprocess
import tempfile, shutil, os.path
import os.path
import hashlib
from buildconfig import BuildConfig

basedir = os.path.split(__file__)[0]
cachedir = basedir + "/cache"
defaultconfig = basedir + "/xboot/config.mk.default"

def buildHexFile(req):
    hash = makeConfigHash(req.form)

    ret = 0
    stderr = ""
    output = ""

    if not hasCache(hash):
        conf = None
        try:
            conf = BuildConfig(defaultconfig)
            conf.importForm(req.form)

            import builder
            ret, output, stderr = builder.build(basedir, os.path.join(cachedir, hash), conf);
        except Exception as e:
            ret = -1
            stderr = "Failed to parse config!\n" + str(e)

    res = str(ret) + "\n"
    if ret == 0:
        res += hash
    else:
        res += output + stderr
    return res

def generateConfig(req):
    try:
        conf = BuildConfig(defaultconfig)
        conf.importForm(req.form)
        return "0\n" + conf.getValuesString()
    except Exception as e:
        return "-1\nFailed to parse config!\n" + str(e);

def makeConfigHash(fields):
    desc = str(fields.items())
    return hashlib.sha1(desc).hexdigest()

def clearCache(req):
    for the_file in os.listdir(cachedir):
        file_path = os.path.join(cachedir, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception, e:
            print e
    return "Cache was cleared."

def hasCache(hash):
    return os.path.isfile(os.path.join(cachedir, hash))

def readCache(hash):
    try:
        int(hash, 16) # check if it is only hex string
        filename = os.path.join(cachedir, hash)
        with open(filename, 'r') as f:
            return f.read()
    except (IOError, ValueError):
        return None

def downloadCache(req, hash, filename):
    content = readCache(hash)

    if content != None:
        req.content_type = "application/octet-stream"
        req.headers_out["Content-Disposition"] = 'attachment; filename="%s.hex"' % filename
        return content
    else:
        return "Failed to open cache file %s!" % hash

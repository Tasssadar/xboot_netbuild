#!/usr/bin/env python

#from subprocess import check_call as call
import subprocess
import tempfile, shutil, os.path

# Every function is accessible via file.py/function address, and call() is very dangerous.
#def call(args):
#    p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#    stdout, stderr = p.communicate()
#    return p.returncode, stdout, stderr

def build(basedir, cachefile, conf):
    tmpdir = tempfile.mkdtemp()
    srcdir = os.path.join(basedir, "xboot")
    try:
        for fn in [ "Makefile", "config.h.mk" ]:
            with open(os.path.join(srcdir, fn), 'r') as f_in:
                with open(os.path.join(tmpdir, fn), 'w') as f_out:
                    f_out.write(f_in.read())

        conf.setSrcDir(srcdir);
        conf.writeToFile(os.path.join(tmpdir, "config.mk"))

        cmd = ["make", "--directory=" + tmpdir ]

        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = p.communicate()
        ret = p.returncode

        if ret != 0:
            return ret, stdout.replace(basedir, "<srcdir>"), stderr.replace(basedir, "<srcdir>")

        shutil.move(os.path.join(tmpdir, 'xboot.hex'), cachefile);
        return 0, '', ''
    finally:
        shutil.rmtree(tmpdir)

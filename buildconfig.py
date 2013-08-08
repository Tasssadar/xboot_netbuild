#!/usr/bin/env python
from mod_python import apache,util
import string
import re

class BuildConfig:
    data = {}
    allowed = set(string.ascii_letters + string.digits + '_' + '-')
    pinport_re = re.compile("^P[A-Z][0-9]$");

    def __init__(self, default_cfg_fname):
        self.load(default_cfg_fname)

    def load(self, fname):
        with open(fname, 'r') as f:
            for line in f:
                line = line.strip()
                if len(line) == 0 or line.startswith('#'):
                    continue

                tok = line.split("=");
                if len(tok) != 2:
                    raise Exception("Invalid config format (line %s)" % line)

                self.addVal(tok[0].strip(), tok[1].strip())

    def check(self, text):
        return len(text) != 0 and set(text) <= self.allowed

    def addVal(self, key, val):
        if not self.check(key) or not self.check(val):
            raise Exception("Invalid config value %s:%s" % (key, val))

        self.data[key] = val;

    def getValuesString(self):
        res=""
        for key, val in self.data.iteritems():
            res += "%s = %s\n" % (key,val)
        return res

    def importForm(self, fields):
        for key in fields.keys():
            val = fields.getfirst(key);
            self.processFormPair(key, val);

    def processFormPair(self, key, val):
        if key.startswith("pinport-"):
            tok = key.split("-");
            if len(tok) != 4 or self.pinport_re.match(val) == None:
                raise Exception("Invalid pinport format (%s:%s)" % (key, val));

            self.addVal(tok[1] + "_" + tok[2], val[1]);
            self.addVal(tok[1] + "_" + tok[3], val[2]);
        elif key == "WATCHDOG_TIMEOUT" and val == "WDT_NONE":
            self.addVal("USE_WATCHDOG", "no");
        else:
            if key not in self.data:
                raise Exception("Unknown key (%s:%s)" % (key, val));

            self.addVal(key, val);

    def writeToFile(self, fname):
        with open(fname, 'w') as f:
            for key, val in self.data.iteritems():
                f.write("%s = %s\n" % (key, val));

    def setSrcDir(self, srcdir):
        self.data["SRCDIR"] = srcdir;

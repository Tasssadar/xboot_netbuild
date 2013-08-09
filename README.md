# XBoot netbuild
A simple web builder for [XBoot bootloader](https://github.com/alexforencich/xboot)
for XMega and ATMega chips. It does not contain all the opions nor chips yet, but works.

### Requirements
* Apache
* Python
* [mod_python](http://modpython.org/) (most likely in your distro's repos)
* make
* gcc-avr
* avr-libc
* binutils-avr

### Instalation
    git clone https://github.com/Tasssadar/xboot_netbuild.git
    cd xboot_netbuild
    git submodule update --init
    chmod 777 cache

You should also clear cache when you update XBoot sources - `rm cache/*` or
go to `<xboot_netbuild>/handler.py/clearCache` address in browser.

### License
This builder is released under MIT license, see COPYING.
**This does not include XBoot!**

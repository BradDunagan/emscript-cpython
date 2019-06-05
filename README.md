# emscript-cpython
How to use Emscripten to build CPython to run in the browser.

This will hopefully help you get started with embedding CPython in your web app (assuming you want to do that).

### Here are the steps -

- Install Emscripten.

- Clone CPython source.

- Configure and Build CPython with Emscripten.

- Verify with a small test.

### A few notes

I have been using Ubuntu for the Python side of my web app development. To verify what I am describing here I used a new virtual machine running Ubuntu 19.04 (Disco Dingo) which I think is a fairly recent release. What is presented here I am pretty sure will work on at least the previous release (which I contine to use otherwise in other VMs). Actually this will work on any Linux, right? You just might have to mess with things.

I performed each of these steps in a dedicated directory. In that directory I installed Emscripten and the source of CPython. I suppose you might pull this repository into some directory in which case that could be your dedicated directory to do things in.

I cloned and compiled CPython 3.7. Others might work.

### Install Emscripten

Follow instructions at [Download Emscripten](https://emscripten.org/docs/getting_started/downloads.html).

It does not really matter where you put it. I put it in my dedicated directory.

### Clone CPython source

In your dedicated directory -

```
    $ git clone -b 3.7 https://github.com/python/cpython.git
```

CPython's source will now be in subdirectory cpython.

### Configure and Build CPython with Emscripten

```
    $ cat patches/*.patch | (cd cpython ; patch -p1)
```

```
    $ cp config.site cpython
```

The next command uses emscripten tools. They must be "activated", in your $PATH.  See above.

```
    $ bash
    $ (cd cpython; CONFIG_SITE=./config.site READELF=true emconfigure ./configure --without-pymalloc --disable-shared --disable-ipv6 --without-gcc --host=asmjs-unknown-emscripten --build=asmjs --prefix=/home/brad/dev/nofork/install-py3.7-emscripten  > config-stdout.txt 2> config-stderr.txt)
    $ exit
```

Notice that configure output is redirected to files. See those if you want. I ignored the warnings, errors. (Is that bad?)




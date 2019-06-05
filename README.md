# emscript-cpython

This might help you get started with embedding CPython in your web app (assuming you want to do that).

### Credit

See [DGYM](https://github.com/dgym/cpython-emscripten). The instructions here are simply some of what he does with make.

### Here are the steps -

- Clone this repository.

- Install Emscripten.

- Clone CPython source. Get pgen.

- Configure, Build and Install CPython with Emscripten.

- Verify with a small test.

### A few notes

I have been using Ubuntu for the Python side of my web app development. To verify what I am describing here I used a new virtual machine running Ubuntu 19.04 (Disco Dingo) which I think is a fairly recent release. What is presented here I am pretty sure will work on at least the previous release (which I contine to use otherwise in other VMs). Actually this will work on any Linux, right? You just might have to mess with things.

I cloned and compiled CPython 3.7. Others might work.

I don't what to pretend I know as much as I should about everything that happens here. I just want to embed CPython in my web app. Linux is not my first/preferred operating/development environment. String me up. But since starting on this stuff about 8 months ago I have learned some. I have a feeling for what the patches do, for example, and I know a little more about bash. I certainly appreciate Linux and open source. Especially CPython. Emscripten and CPython (and everything, it seems) are large and complicated. By far I spend the majority of my time (when in Linux) developing my stuff that is the interface between CPython and my web app - so I have learned much more about CPython then, say, Emscripten. 

### Clone this repository

Somewhere under your home directory do
```
    $ git clone https://github.com/BradDunagan/emscript-cpython.git
```
Which will create a subdirectory named emscripten-cpython and put this repository there.

To specify a different directory specify the directory name at the end. For example
```
    $ git clone https://github.com/BradDunagan/emscript-cpython.git my-browserified-cpython
```
Whatever directory you clone this into let that directory be known as the **_working-directory_**.

### Install Emscripten

While in your working-directory carefully follow the instructions at [Download Emscripten](https://emscripten.org/docs/getting_started/downloads.html).

It does not really matter where you put it. I put it in my working-directory.

### Clone CPython source

In the working-directory -

```
    $ git clone -b 3.7 https://github.com/python/cpython.git
```

CPython's source will now be in subdirectory cpython.

You will need pgen, Python's parser generator. So here we configure as we are going to build a native CPython. But we only build pgen, copy it the working-directory and remove all files so to have a fresh cpython source again.

```
    $ cd cpython
    $ ./configure
    $ make Parser/pgen
    $ cp Parser/pgen ..
    $ make clobber
    $ cd ..
```

### Configure and Build CPython with Emscripten

In the working-directory -

```
    $ cat patches/*.patch | (cd cpython ; patch -p1)
```

```
    $ cp config.site cpython
```

The next command uses emscripten tools. They must be "activated", in your $PATH.  See above.

Notice <install-path>. It should be an absolute path. I specified a new directory in my working directory. A directory name with "install" in it is probably a good idea.
    
```
    $ bash
    $ (cd cpython; CONFIG_SITE=./config.site READELF=true emconfigure ./configure --without-pymalloc --disable-shared --disable-ipv6 --without-gcc --host=asmjs-unknown-emscripten --build=asmjs --prefix=<install-path>  > config-stdout.txt 2> config-stderr.txt)
    $ exit
```

Notice that configure output is redirected to files. See those if you want. So far I have ignored the warnings, errors. (Is that bad?)

Continuing -

```
    $ cp Setup.local cpython/Modules
```

I am not sure that supplying the zlib source files is necessary here. But here you go -

```
    $ mkdir cpython/Modules/zlib
    cp zlib/* cpython/Modules/zlib
```

Ready to compile CPython. Note that what is created is a library file. Later it is linked with your application code in another Emscripten step that produces the JavaScript and WebAssembly that is executed by the browser (or a modern NodeJS).

Notice here HOSTPYTHON. [DGYM](https://github.com/dgym/cpython-emscripten) builds a separate (native) CPython for this. I simply specify what is installed in my system. It seems to work.

Also notice HOSTPGEN=<pgen>. You must substitute an absolute path and executable for <pgen>. This is the pgen you built above.

```
    $ cd cpython
    $ emmake make HOSTPYTHON=/usr/bin/python3.7 HOSTPGEN=<pgen> CROSS_COMPILE=yes libpython3.7.a > make-stdout.txt 2> make-stderr.txt

```
The output messages are redirected to files.

Should have produced libpython3.7.a in the cpython directory.

Now to install. We should still be in the cpython directory.

First, prevent a build_all -

```
    $ sed -i -e 's/libinstall:.*/libinstall:/' Makefile
```

Now, install -

```
    $ emmake make HOSTPYTHON=/usr/bin/python3.7 PYTHON_FOR_BUILD=/usr/bin/python3.7 CROSS_COMPILE=yes inclinstall libinstall libpython3.7.a > make-install-stdout.txt 2> make-install-stderr.txt
```
That will copy things to the install directory you specified in the --prefix option in the configure command above.  As with other large operations the output is redirected.

Copy the libpython3.7.a file too.

```
    $ cp libpython3.7.a <install-path>/lib
```

If your app will use the sysconfig.py module then this ugly -

```
    $ (_PYTHON_PROJECT_BASE=<working-directory>/cpython _PYTHON_HOST_PLATFORM=emscripten PYTHONHOME=<install-path> PYTHONPATH=<working-directory>/Lib _PYTHON_SYSCONFIGDATA_NAME=_sysconfigdata__emscripten_ python3.7 -S -m sysconfig --generate-posix-vars)
```

Then copy to the installation -

```
    $ cp build/lib.emscripten-3.7/_sysconfigdata__emscripten_.py <install-path>/lib/python3.7/
```






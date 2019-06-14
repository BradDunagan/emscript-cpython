PYVERSION=3.7.0
PYMINOR=$(basename $(PYVERSION))

CC=emcc
OPTFLAGS=-O2
CFLAGS=-std=gnu99 $(OPTFLAGS) -g -I $(CPYTHON)/include/python$(PYMINOR)/ -Wno-warn-absolute-paths
LDFLAGS=$(OPTFLAGS) $(CPYTHON)/lib/libpython$(PYMINOR).a \
  -s TOTAL_MEMORY=268435456 \
  -s ASSERTIONS=2 \
  -s EMULATE_FUNCTION_POINTER_CASTS=1 \
  -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -s EXPORTED_FUNCTIONS='["_Demo1_Init", \
                          "_Demo1_RunString"]' \
  -s RESERVED_FUNCTION_POINTERS=80 \
  --memory-init-file 0


all: demo1-python.asm.js

demo1-python.asm.js: demo1-pre-2.js python.asm.js demo1-pst-2.js
	cp  demo1-pre-2.js    demo1-python.asm.js
	cat python.asm.js  >> demo1-python.asm.js
	cat demo1-pst-2.js >> demo1-python.asm.js


python.asm.js: main.bc root
	$(CC) -o $@ $(filter %.bc,$^) $(LDFLAGS) \
		$(foreach d,$(wildcard root/*),--preload-file $d@/$(notdir $d))


serve: python.asm.js
	@echo "Serving on port 8062"
	python -m SimpleHTTPServer 8062


clean:
	-rm -fr root
	-rm python.asm.js python.asm.data python.asm.wasm 
	-rm demo1-python.asm.js
	-rm *.bc


%.bc: %.c 
	$(CC) -o $@ $< $(CFLAGS)


root: $(CPYTHON)/lib/python$(PYMINOR)
	mkdir -p root/lib
	cp -a $(CPYTHON)/lib/python$(PYMINOR)/ root/lib
	# Clean up unused modules
	( \
		cd root/lib/python$(PYMINOR); \
		rm -fr test distutils ensurepip idlelib __pycache__ tkinter; \
	)


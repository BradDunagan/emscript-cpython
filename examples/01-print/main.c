#include <stdlib.h>

#include <emscripten.h>
#include <Python.h>


int main(int argc, char** argv) {
    setenv("PYTHONHOME", "/", 0);

    Py_InitializeEx(0);

    const char * src =
	"import sysconfig;\n"
	"v = sysconfig.get_config_vars();\n"
	"for a in v:\n"
	"	print ( f'{a:30} {sysconfig.get_config_var(a)}' );\n";
    PyRun_SimpleString ( src );
    Py_Finalize();

    emscripten_exit_with_live_runtime();
    return 0;
}

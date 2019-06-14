#include <stdlib.h>

#include <emscripten.h>
#include <Python.h>


int		Demo1_RunString ( const char * src )
{
	const char * sW = "main.c Demo1_RunString()";

	int rslt = PyRun_SimpleString ( src );

	if ( rslt != 0 ) {
		printf ( "%s: run error\n", sW ); }
	else {
		printf ( "%s: run ok\n", sW ); }

	return rslt; 
}


int		Demo1_Init()
{
	const char * sW = "main.c Demo1_Init()";

	printf ( "%s: ...\n", sW );

	setenv ( "PYTHONHOME", "/", 0 );

	Py_InitializeEx ( 0 );

	return 0;
}



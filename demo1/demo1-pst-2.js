//	This is added to the end of python.asm.js.

var Demo1_Init = cwrap ( "Demo1_Init", "number", [] );

var Demo1_RunString = cwrap ( "Demo1_RunString", "number", ["string"] );

onmessage = function ( e ) {
	let sj = JSON.stringify ( e.data );
	console.log ( 'Worker: Message received from main script' );
	console.log ( 'Worker: ' + sj );

	if ( e.data.do === 'initialize' ) {
		Demo1_Init(); }

	if ( e.data.do === 'execute' ) {
		Demo1_RunString ( e.data.src ); }

//	postMessage(workerResult);
}


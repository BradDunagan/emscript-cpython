const source = document.querySelector ( '#source' );
const initialize = document.querySelector('#initialize');
const lazy = document.querySelector ( '#lazy' );
const execute = document.querySelector('#execute');

source.onkeydown = function ( e ) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var target = e.target;
        var value = target.value;

        // set textarea value to: text before caret + tab + text after caret
        target.value = value.substring(0, start)
                    + "\t"
                    + value.substring(end);

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
    }
};

lazy.onclick = function() {
	let src = "print ( \"Hello?\" );\n"
			+ "\n"
			+ "for i in range ( 1, 11 ):\n"
			+ "\tprint ( f\"i: {i}\" );\n"
			+ "\n"
			+ "print ( \"Ok?\" );\n";
	source.value = src;
}

if (window.Worker) {
	const wkr = myWorker = new Worker ( "demo1-python.asm.js" );

	initialize.onclick = function() {
		wkr.postMessage ( { do: 'initialize' } );
		console.log ( 'posted to worker' );
	}

	execute.onclick = function() {
		wkr.postMessage ( { do:		'execute', 
							src:	source.value } );
		console.log ( 'posted to worker' );
	}

	wkr.onmessage = function ( e ) {
	//	result.textContent = e.data;
		console.log('Message received from worker');
	}
} else {
	console.log('Your browser doesn\'t support web workers.')
}

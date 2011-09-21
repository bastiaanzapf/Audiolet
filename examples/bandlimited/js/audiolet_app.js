window.onload = function() {

    this.audiolet = new Audiolet();

    var play=function(f,canvas) {
	var X=new Object();
        X.square = new BlitSquare(this.audiolet,f);

	X.amplitude = new Multiply(this.audiolet, 1);
	X.square.connect(X.amplitude);

	X.envelope = new InteractiveEnvelope(this.audiolet,0.1,1e-10,function () { X.amplitude.remove(); delete X; });
	X.envelope.connect(X.amplitude,0,1);

	if (canvas) {
	    X.osci = new Oscilloscope(this.audiolet,undefined,canvas);
	    X.amplitude.connect(X.osci);
	    X.osci.connect(this.audiolet.output);
	    X.osci.raf=function () { window.mozRequestAnimationFrame(function () {X.osci.paint();},canvas); };
            X.osci.paint();
	    
	} else {
	    X.amplitude.connect(this.audiolet.output);
	}
	X.envelope.newTarget(0.02,1e-5);

	return X;
    }

    x=play(440,document.getElementById('scope'));
    window.setTimeout(function () { x.envelope.newTarget(0,2e-2); },200);

    function keyboard() {
	var keyboard_scale=[89,83,88,68,67,86,71,66,72,78,74,77,
			    81,50,87,51,69,82,53,84,54,90,55,85];
	
	var f=220;
	var keyboard=Array();
	for (k in keyboard_scale) {
	    keyboard[keyboard_scale[k]]=f;
	    f*=Math.pow(2,1/12);
	}
	return keyboard;
    }

    this.keyboard=keyboard();

    this.playing_notes=Array();

    window.onkeydown=function(e) {       
	if ((f=this.keyboard[e.keyCode])!=null) {	    
	    if (playing_notes[e.keyCode]==null) {
		f*=Math.pow(2,document.getElementById('octave').value);
		var p=new Object();
		p.play=play(f);
		playing_notes[e.keyCode]=p;
		var kc=e.keyCode;
		p.marker=kc;
		p.switchOff=function() { p.play.envelope.newTarget(0,2e-2); playing_notes[kc]=null;}
	    }
	}
    }
    window.onkeyup=function(e) {	
	var kc=e.keyCode;
	if ((f=this.playing_notes[kc])!=null) {
	    this.playing_notes[kc].switchOff();
	}
    }

};

window.onload = function() {

    this.audiolet = new Audiolet();

    var play=function(f) {
	var X=new Object();
        X.sine = new Sine(this.audiolet, 0);

        X.modulator = new Sine(this.audiolet, f*2.33);
        X.modulatorMulAdd = new MulAdd(this.audiolet, 50, f);
        X.modulator.connect(X.modulatorMulAdd);
        X.modulatorMulAdd.connect(X.sine);

	X.modulator2 = new Multiply(this.audiolet, 1);
	X.sine.connect(X.modulator2,0,0);

	X.envelope = new InteractiveEnvelope(this.audiolet,0.1,1e-10,function () { X.modulator2.remove();});

	X.envelope.connect(X.modulator2,0,1);
	X.modulator2.connect(this.audiolet.output);

	X.envelope.newTarget(0.02,1e-5);
	return X;
    }

    x=play(440);
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
		var p=new Object();
		p.play=play(this.keyboard[e.keyCode]);
		playing_notes[e.keyCode]=p;
		var kc=e.keyCode;
		p.marker=kc;
		p.switchOff=function() { p.play.envelope.newTarget(0,2e-1); playing_notes[kc]=null;}
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

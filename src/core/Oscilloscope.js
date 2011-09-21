
/**
 * An oscilloscope
 *
 * **Inputs**
 *
 * - Signal
 *
 * **Outputs**
 *
 * - Unmodified Signal (necessary, since Audiolet uses a "pull" architecture)
 *
 * **Parameters**
 *
 * @constructor
 * @param {Audiolet} audiolet The audiolet object.
 * @param {signal} signal Signal input
 * @param {canvas} canvas A canvas object to display the oscilloscope
 * @extends AudioletNode
 */

var Oscilloscope = function(audiolet,signal,canvas) {
    AudioletNode.call(this, audiolet, 1,1);
    this.linkNumberOfOutputChannels(0, 0);
    //    this.value = new AudioletParameter(this, 0, signal);
    this.canvas=canvas;
    this.gc = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.displayeddata = Array();
    this.displayedpointer = 0;
    this.count=0;
};

extend(Oscilloscope, AudioletNode);

Oscilloscope.prototype.generate = function(inputBuffers,outputBuffers) {
    var c=inputBuffers[0].getChannelData(0);
    var o=outputBuffers[0].getChannelData(0);
    for (var i=0;i<c.length;i++) {
	if (this.displayedpointer<=this.width) {
	    this.displayeddata[this.displayedpointer++]=c[i];
	}
	o[i]=c[i];
    }    
};

Oscilloscope.prototype.paint = function () {
    var width=this.width,height=this.height,gc=this.gc;
    var factor=1;
    var h2=height/2;
    if (this.displayedpointer>this.width) {
	this.canvas.width=this.width;
	gc.fillStyle='#ffffff';
	gc.strokeStyle='#000000';
	gc.beginPath();
	gc.moveTo(0,this.displayeddata[0]*h2*factor+h2);
	for (var i=0;i<this.displayedpointer;i++) {
	    gc.lineTo(i,this.displayeddata[i]*h2*factor+h2);
	}
	gc.stroke();	
	this.displayedpointer=0;
	this.count++;
    }
    if (this.count<5)
	  this.raf();
}
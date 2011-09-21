
/**
 * An oscilloscope
 *
 * **Inputs**
 *
 * - Signal
 *
 * **Outputs**
 *
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
    this.hold = false;
    this.wait = 0;
};

extend(Oscilloscope, AudioletNode);

Oscilloscope.prototype.generate = function(inputBuffers,outputBuffers) {
    var c=inputBuffers[0].getChannelData(0);
    var o=outputBuffers[0].getChannelData(0);
    var width=this.width,height=this.height,gc=this.gc;
    var h2=height/2;
    if (!this.hold) {
	this.canvas.width=width;
	gc.fillStyle='#ffffff';
	gc.strokeStyle='#000000';
	gc.beginPath();
	gc.moveTo(0,c[0]*h2+h2);
    }
    for (var i=0;i<c.length;i++) {
	if (!this.hold) 
	    if (i<width)
		gc.lineTo(i,c[i]*h2/10+h2);	
	o[i]=c[i];
    }
    if (!this.hold) {
	gc.stroke();
	if ((this.wait++)>1)
	    this.hold=true;
    }
}

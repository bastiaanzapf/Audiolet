
/**
 * Bandlimited impulse train closed formula, cf.
 * http://www.music.mcgill.ca/~gary/307/week5/bandlimited.html
 *
 * It is possible to synthesize a sign-alternating impulse train
 * by supplying an even number of Partials. However, then the 
 * Interpretation of P is different.
 *     
 * @param {P} If odd is true, period in (fractional) samples. If odd
 *            is false, half period.
 * @param {M} number of synthesized Partials
 * @param {odd} assert that M is odd/even.
 * @returns a function that will calculate a Bandlimited impulse train
 *          depending on a time parameter
 */
function Blit(P,M,odd) {
    if ((odd && (M%2!=1)) ||
	(!odd && (M%2!=0))) {
	throw "Erroneous Number of Partials in Blit.";
    }
    if (M>P) {
	throw "Too many Partials in Blit.";
    }
    return function(n) {
	var x=Math.PI*M*n/P;
	var t=x/M;
	if (Math.abs(Math.sin(t)) > 1e-5)
	    return Math.sin(x)/(P*Math.sin(t));
	else
	    return M/P*Math.cos(x)/(Math.cos(t));
    }
};
    
/**
 * Bandlimited Square Wave Generator
 *
 * **Inputs**
 *
 * none (frequency modulation is hard to get right with the closed formula above)
 *
 * **Outputs**
 *
 * - Bandlimited Square Wave
 *
 * **Parameters**
 *
 * @constructor
 * @param {Audiolet} audiolet The audiolet object.
 * @param {Number} [frequency=440] Frequency.
 */

BlitSquare = function(audiolet,frequency) {
    AudioletNode.call(this, audiolet, 0, 1);
    this.frequency = frequency || 440;    
    this.phase = 0;
    P=(44100.0/frequency);

    M=Math.floor(P/2)*2; // even number, lower than the original P

    // bipolar BLIT

    this.Blit=Blit(P,M,0);

    // a leaky integrator -> process bipolar BLIT to square wave

    this.filter=new FixedBiquadFilter(audiolet,[1,0,0],[1,-0.9999,0]);
    this.connect(this.filter);
    return this.filter;
};

extend(BlitSquare, AudioletNode);

BlitSquare.prototype.generate = function(inputBuffers,
                                         outputBuffers) {
    var buffer = outputBuffers[0];
    var channel = buffer.getChannelData(0);

    var bufferLength = buffer.length;    
    for (var i = 0; i < bufferLength; i++) {
        channel[i] = this.Blit(this.phase++);	
    }
};


/**
 * toString
 *
 * @return {String} String representation.
 */
BlitSquare.prototype.toString = function() {
    return 'BlitSquare';
};




/*!
 * @depends TableLookupOscillator.js
 */

/**
 * Bandlimited Impulse Train Generator
 *
 * **Inputs**
 *
 * - Frequency
 *
 * **Outputs**
 *
 * - Bandlimited Impulse Wave
 *
 * **Parameters**
 *
 * - frequency The frequency of the oscillator.  Linked to input 0.
 *
 * @constructor
 * @param {Audiolet} audiolet The audiolet object.
 * @param {Number} [frequency=440] Initial frequency.
 */

var Blit = function(audiolet, frequency) {
    /**
     * BLIT closed formula, cf.
     * http://www.music.mcgill.ca/~gary/307/week5/bandlimited.html
     *
     * It is possible to synthesize a sign-alternating impulse train
     * by supplying an even number of Partials. However, then the 
     * Interpretation of P is different.
     *     
     * @param {P} If odd is true, period in samples. If odd is 
     *            false, half period.
     * @param {M} number of synthesized Partials
     * @param {odd} assert that M is odd/even.
     * 
     */
    function blit(P,M,odd) {
        var n=0;
	if ((odd && (M%2!=1)) ||
	    (even && (M%2!=0))) {
	    throw "Erroneous Number of Partials in Blit.";
	}
    	return function() {
	    var t=Math.PI*n/P;
	    var x=t*M;
	    n++;
	    if (Math.abs(Math.sin(t) > 1e-5))
		return Math.sin(x)/(P*Math.sin(t));
	    else
		return M*Math.cos(x)/(P*Math.cos(t));
	}
    }
}


    TableLookupOscillator.call(this, audiolet, Square.TABLE, frequency);
};
extend(Square, TableLookupOscillator);

/**
 * toString
 *
 * @return {String} String representation.
 */
Square.prototype.toString = function() {
    return 'Square';
};

/**
 * Square wave table
 */
Square.TABLE = [];
for (var i = 0; i < 8192; i++) {
    Square.TABLE.push(((i - 4096) / 8192) < 0 ? 1 : -1);
}



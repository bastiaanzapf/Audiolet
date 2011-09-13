/*!
 * @depends Envelope.js
 */

/**
 * Exponential Level Changes
 *
 * **Inputs**
 *
 * - Asynchronous: Target Level, Decay Time
 *
 * **Outputs**
 *
 * - Envelope
 *
 *
 * @constructor
 * @extends Envelope
 * @param {Audiolet} audiolet The audiolet object.
 * @param {Number} initial initial level
 * @param {Number} [trigger] trigger level
 * @param {Function} [onComplete] A function called when the level sinks 
 *                   below the trigger level
 */
var InteractiveEnvelope = function(audiolet, initial, trigger,
                                   onComplete) {
    this.level = initial;
    this.targetLevel = initial;
    this.decay = 1;
    this.onComplete=onComplete;
    this.trigger=trigger;
    AudioletNode.call(this, audiolet, 0, 1);
//    Envelope.call(this, audiolet, gate, levels, times, null, onComplete);
};

extend(InteractiveEnvelope, AudioletNode);

/**
 * toString
 *
 * @return {String} String representation.
 */
InteractiveEnvelope.prototype.toString = function() {
    return 'Interactive Envelope';
};

InteractiveEnvelope.prototype.newTarget = function (target,decay) {
    this.targetLevel=target;
    this.decay=decay;
}

/**
 * Process a block of samples
 *
 * @param {AudioletBuffer[]} inputBuffers Samples received from the inputs.
 * @param {AudioletBuffer[]} outputBuffers Samples to be sent to the outputs.
 */
InteractiveEnvelope.prototype.generate = function(inputBuffers, outputBuffers) {

    var level = this.level;
    var targetLevel = this.targetLevel;
    var decay = this.decay;
    var buffer = outputBuffers[0].getChannelData(0);
    var bufferLength = buffer.length;


    for (var i = 0; i < bufferLength; i++) {
       level -= (level-targetLevel)*decay;
       buffer[i]=level;       
    }
    //    console.log(level+ " " + this.trigger);    
    if (level<this.trigger && this.onComplete) {
	this.onComplete();
    }
    this.level=level;
};


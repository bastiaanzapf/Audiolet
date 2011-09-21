/*!
 * @depends ../core/AudioletNode.js
 */

/**
 * Generic biquad filter.  The coefficients (a0, a1, a2, b0, b1 and b2) are 
 * set at initalization. This simplifies bandlimited synthesis
 *
 * **Inputs**
 *
 * - Audio
 *
 * **Outputs**
 *
 * - Filtered audio
 *
 * **Parameters**
 *
 * @constructor
 * @extends AudioletNode
 * @param {Audiolet} audiolet The audiolet object.
 * @param {b} Nominator of the transfer function
 * @param {a} Denominator of the transfer function
 */
var FixedBiquadFilter = function(audiolet, b, a) {
    AudioletNode.call(this, audiolet, 2, 1);

    // Same number of output channels as input channels
    this.linkNumberOfOutputChannels(0, 0);

    // Delayed values
    this.xValues = [];
    this.yValues = [];

    // Coefficients
    this.b0 = b[0];
    this.b1 = b[1];
    this.b2 = b[2];
    this.a0 = a[0];
    this.a1 = a[1];
    this.a2 = a[2];
};
extend(FixedBiquadFilter, AudioletNode);

/**
 * Process a block of samples
 *
 * @param {AudioletBuffer[]} inputBuffers Samples received from the inputs.
 * @param {AudioletBuffer[]} outputBuffers Samples to be sent to the outputs.
 */

FixedBiquadFilter.prototype.generate = function(inputBuffers, outputBuffers) {
    var inputBuffer = inputBuffers[0];
    var outputBuffer = outputBuffers[0];

    if (inputBuffer.isEmpty) {
        outputBuffer.isEmpty = true;
        return;
    }

    var xValueArray = this.xValues;
    var yValueArray = this.yValues;

    var inputChannels = [];
    var outputChannels = [];
    var numberOfChannels = inputBuffer.numberOfChannels;
    for (var i = 0; i < numberOfChannels; i++) {
        inputChannels.push(inputBuffer.getChannelData(i));
        outputChannels.push(outputBuffer.getChannelData(i));
        if (i >= xValueArray.length) {
            xValueArray.push([0, 0]);
            yValueArray.push([0, 0]);
        }
    }

    var a0 = this.a0;
    var a1 = this.a1;
    var a2 = this.a2;
    var b0 = this.b0;
    var b1 = this.b1;
    var b2 = this.b2;

    var bufferLength = outputBuffer.length;
    for (var i = 0; i < bufferLength; i++) {
        for (var j = 0; j < numberOfChannels; j++) {
            var inputChannel = inputChannels[j];
            var outputChannel = outputChannels[j];

            var xValues = xValueArray[j];
            var x1 = xValues[0];
            var x2 = xValues[1];
            var yValues = yValueArray[j];
            var y1 = yValues[0];
            var y2 = yValues[1];

            var x0 = inputChannel[i];
            var y0 = (b0 / a0) * x0 +
                     (b1 / a0) * x1 +
                     (b2 / a0) * x2 -
                     (a1 / a0) * y1 -
                     (a2 / a0) * y2;

            outputChannel[i] = y0;

            xValues[0] = x0;
            xValues[1] = x1;
            yValues[0] = y0;
            yValues[1] = y1;
        }
    }
};

/**
 * toString
 *
 * @return {String} String representation.
 */
FixedBiquadFilter.prototype.toString = function() {
    return 'Fixed Biquad Filter';
};

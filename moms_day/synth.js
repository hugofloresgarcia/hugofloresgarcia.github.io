function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

class Synth {
  constructor(){

    // create Oscillator node
    this.oscillator = audioCtx.createOscillator();

    this.oscillator.type = 'triangle';
    this.filter = audioCtx.createBiquadFilter();

    // this.osc = new p5.TriOsc();

    this.envelope = audioCtx.createGain();

    this.oscillator.connect(this.filter);
    this.filter.connect(this.envelope);
    this.envelope.connect(audioCtx.destination);


    this.attackTime = 0.2;
    this.releaseTime = 1.5;

  }

  play(midinote){
    let freq = midiToFreq(midinote);

    this.oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime); // value in hertz

    // this.osc.freq(freq);
    this.filter.frequency.setValueAtTime(midiToFreq(53)*2.5, audioCtx.currentTime);

    this.envelope.gain.cancelScheduledValues(audioCtx.currentTime);
    this.envelope.gain.setValueAtTime(0, audioCtx.currentTime);
    // set our attack
    this.envelope.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + this.attackTime);
    // set our release
    this.envelope.gain.linearRampToValueAtTime(0, audioCtx.currentTime  + this.releaseTime);

    this.oscillator.onended = function() {
    console.log('Your tone has now stopped playing!');
    };


    this.oscillator.start();
    this.oscillator.stop(audioCtx.currentTime + this.releaseTime);
  }

}

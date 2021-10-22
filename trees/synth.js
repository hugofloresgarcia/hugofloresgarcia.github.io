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

class MIDIKey {
  constructor(midinote, synth, x, y, width, tree_fxn){
    this.synth = synth;
    var image;
    var fxn = function play(){
      let synth = new Synth();
      tree_fxn();
      synth.play(midinote);
    }

    this.is_black = false;


    if (midinote % 12 == 0 || midinote % 12 == 5){
      image = "resources/key_c_f.png";
      x = x + 5;
    }
    else if (midinote % 12 == 4 || midinote % 12 == 11){
      image = "resources/key_e_b.png"
    }
    else if (midinote % 12 == 2 || midinote % 12 == 7 || midinote % 12 == 9){
      image = "resources/key_d_g_a.png";
    }
    else {
      image = "resources/key_black.png";

      this.is_black = true;
    }


    this.button = createImg(image);
    this.button.mousePressed(fxn);
    this.button.position(x, y);
    if (this.is_black){
      let aux_image = createImg("resources/key_black_aux.png");
      aux_image.position(x+22.5, y+128);
    }
    // this.button.size(100, 100);

  }

  play(){
    this.synth.play(midinote);
  }
}

class MIDIKeyboard {
  constructor(start_key, end_key, start_x, start_y, width, synth, tree_fxn){
    this.synth = synth;

    this.keyboard = [];
    this.num_keys = end_key - start_key;

    for (let i = 0 ; i < this.num_keys ; i++){
      let pos_x = start_x + width * i;
      let pos_y = start_y;

      let temp_midikey = new MIDIKey(start_key + i, synth, pos_x, pos_y, width, tree_fxn);
      this.keyboard.push(temp_midikey);
    }
  }
}

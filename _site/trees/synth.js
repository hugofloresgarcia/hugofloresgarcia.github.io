class Synth {
  constructor(){

    this.osc = new p5.TriOsc();

    this.envelope = new p5.Envelope();
    this.envelope.setADSR(0.001, 0.5, 1, 1);
    this.envelope.setRange(1, 0);

    this.filter = new p5.LowPass();
  }

  play(midinote){
    let freq = midiToFreq(midinote);

    this.osc.freq(freq);
    this.filter.freq(freq*3);

    // this.osc.start(1, 0.001);
    this.osc.start();

    this.osc.disconnect();
    this.osc.connect(this.filter);

    this.envelope.play(this.osc, 0, 0.1);
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
    }
    else if (midinote % 12 == 2 || midinote % 12 == 4 || midinote % 12 == 7 || midinote % 12 == 9 || midinote % 12 == 11){
      image = "resources/key_d_g_a_b.png";
    }
    else {
      image = "resources/key_black.png";
      this.is_black = true;
    }


    this.button = createImg(image);
    this.button.mousePressed(fxn);
    this.button.position(x, y);
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

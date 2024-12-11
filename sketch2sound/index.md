---
layout: page
title: Sketch2Sound
permalink: /sketch2sound/
---
<head>
<meta name="robots" content="noindex, nofollow" />
</head>

<p align="center"> <b><font size="6">Controllable Audio Generation via Time-Varying Signals and Sonic Imitations</font></b> </p>
<p align="center"><font size="4">Hugo Flores García<sup>io</sup>, Oriol Nieto<sup>i</sup>, Justin Salamon<sup>i</sup>, Bryan Pardo<sup>o</sup> and Prem Seetharaman<sup>i</sup></font></p>
<p align="center"><font size="4"><sup>i</sup>Adobe Research, <sup>o</sup>Northwestern University</font></p>

<div class="wiggle-divider" ></div>

We present Sketch2Sound, a generative audio model capable of creating high-quality sounds from a set of interpretable time-varying control signals: loudness, brightness, and pitch, as well as text prompts. **Sketch2Sound can synthesize arbitrary sounds from sonic imitations** (i.e., a vocal imitation or a reference sound-shape). 

Sketch2Sound can be implemented on top of any text-to-audio latent diffusion transformer (DiT), and requires only 40k steps of fine-tuning and a single linear layer per control, making it more lightweight than existing methods like ControlNet. 
To synthesize from sketchlike sonic imitations, we propose applying random median filters to the control signals during training, allowing Sketch2Sound to be prompted using controls with flexible levels of temporal specificity. 

We show that Sketch2Sound can synthesize sounds that follow the gist of input controls from a vocal imitation while retaining the adherence to an input text prompt and audio quality compared to a text-only baseline. Sketch2Sound allows sound artists to create sounds with the semantic flexibility of text prompts and the expressivity and precision of a sonic gesture or vocal imitation.


<div class="wiggle-divider" ></div>

<style>
    img {
    width: 100%; /* Set to 100% of the container width */
    max-width: 500px; /* Set the maximum width of the image */
    height: auto; /* Maintain the aspect ratio */
    margin-bottom: 1px; /* Add space between the image and audio widget */
    }
    video {
    width: 100%; /* Set to 100% of the container width */
    max-width: 800px8; /* Set the maximum width of the video */
    height: auto; /* Maintain the aspect ratio */
    margin-bottom: 1px; /* Add space between the video and audio widget */
    display: block; /* Center the video */
    margin: auto;
    }
</style>

watch our demo video: 
<video controls>
  <source src="/sketch2sound/figs/hero.mp4" type="video/mp4">
  <source src="/sketch2sound/figs/hero.webm" type="video/webm">
  <source src="/sketch2sound/figs/hero.ogv" type="video/ogg">
  Your browser does not support the video tag.
</video>

<div class="wiggle-divider" ></div>

### Fig. 1 - Listening Example
<figure>
  <img src="/sketch2sound/figs/hero-figure.png" alt="" style="margin-bottom:2px; max-width: 1200px">
  <figcaption>Overview of Sketch2Sound. We extract three control signals from any input sonic imitation: loudness, spectral centroid (i.e., brightness) and pitch probabilities. We encode the signals and add them to the latents used as input to a DiT text-to-sound generation system.</figcaption>
</figure>

| text prompt | input (sonic imitation)         | output (sketch2sound)         |
| ------------| ------------- | ------------- | 
| "car racing" | ![Image1](/sketch2sound/audio/car-racing/in.png) <br> <audio controls><source src="/sketch2sound/audio/car-racing/in.wav" type="audio/wav"></audio> | ![Image2](/sketch2sound/audio/car-racing/out.png) <br> <audio controls><source src="/sketch2sound/audio/car-racing/out.wav" type="audio/wav"></audio> |


### Fig. 3 - Control Curve Semantics

| text prompt | input (sonic imitation)         | output (sketch2sound)         |
| ------------| ------------- | ------------- | 
| "forest ambience" | ![Image1](/sketch2sound/audio/forest-ambience/in.png) <br> <audio controls><source src="/sketch2sound/audio/forest-ambience/in.wav" type="audio/wav"></audio> | ![Image2](/sketch2sound/audio/forest-ambience/out.png) <br> <audio controls><source src="/sketch2sound/audio/forest-ambience/out.wav" type="audio/wav"></audio> |

When prompted with "forest ambience", bursts of loudness in the controls become of birds without prompting the model to do so.

<div class="wiggle-divider" ></div>



| text prompt | input (sonic imitation)         | output (sketch2sound)         |
| ------------| ------------- | ------------- | 
| "bass drum, snare drum" | ![Image1](/sketch2sound/audio/drums/in.png) <br> <audio controls><source src="/sketch2sound/audio/drums/in.wav" type="audio/wav"></audio> | ![Image2](/sketch2sound/audio/drums/out.png) <br> <audio controls><source src="/sketch2sound/audio/drums/out.wav" type="audio/wav"></audio> |

With "bass drum, snare drum", the model places snares in unpitched areas and bass drums in pitched areas.

<div class="wiggle-divider" ></div>

demo video - guitar sonic imitations: 
<video controls>
  <source src="/sketch2sound/figs/demo-guitar.mov" type="video/mov">
  <source src="/sketch2sound/figs/demo-guitar.webm" type="video/webm">
  <source src="/sketch2sound/figs/demo-guitar.ogv" type="video/ogg">
  Your browser does not support the video tag.
</video>
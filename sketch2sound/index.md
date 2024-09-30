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

<video controls>
  <source src="/sketch2sound/figs/hero.mp4" type="video/mp4">
  <source src="/sketch2sound/figs/hero.webm" type="video/webm">
  <source src="/sketch2sound/figs/hero.ogv" type="video/ogg">
  Your browser does not support the video tag.
</video>


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

more examples coming soon! :) 
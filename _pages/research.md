---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
---

## [ISMIR 2022 Tutorial: Few-Shot and Zero-Shot Learning for Music Information Retrieval](https://music-fsl-zsl.github.io/tutorial)

[Yu Wang](https://y-wang.weebly.com/), [Jeong Choi](https://jeongchoi.home.blog/) and I gave a tutorial during ISMIR 2022 on few-shot and zero-shot learning centered around music information retrieval tasks. 
In this tutorial, we cover the foundations of few-shot//zero-shot learning, build standalone coding examples, and discuss the state-of-the-art in the field, as well as future directions. 

The tutorial is available as a jupyter book [online](https://music-fsl-zsl.github.io/tutorial/landing.html).

<!-- ## [Haptic Audio Production Tools]

Digital Audio Workstations (DAWs) are highly visual interfaces, and I'm currently working on leveraging widely available haptic interfaces (e.g. smartphones) to make audio production tools for people with visual impairments.  -->

## [Deep Learning Tools for Audacity](https://interactiveaudiolab.github.io/project/audacity.html)

We provide a software framework that lets deep learning practitioners easily integrate their own PyTorch models into the open-source Audacity DAW. This lets ML audio researchers put tools in the hands of sound artists without doing DAW-specific development work.


## [Leveraging Hierarchical Structures for Few-Shot Musical Instrument Recognition](https://arxiv.org/abs/2107.07029)
In this work, we exploit hierarchical relationships between instruments in a few-shot learning setup to enable classification of a wider set of musical instruments, given a few examples at inference. See the [supplementary code](https://github.com/hugofloresgarcia/music-trees) on github. 

**update**: this work won the Best Paper Award at ISMIR 2021! :)

#### ISMIR 2021 Poster Video
<iframe width="560" height="315" src="https://www.youtube.com/embed/BcK_FflSddA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Software

## [Audacity with Deep Learning](https://interactiveaudiolab.github.io/project/audacity.html)
I am contributing a deep learning framework and a deep model manager that connects to HuggingFace to Audacity. This project was funded by a [Google Summer of Code](https://summerofcode.withgoogle.com/archive/2021/projects/5097817919455232/) grant. Read the [Work Product Summary](https://www.audacityteam.org/gsoc-2021-work-product-source-separation-and-deep-learning-tools/).

## [`audacitorch`](https://github.com/hugofloresgarcia/audacitorch)
PyTorch wrappers for using your deep model in Audacity, and sharing it with the community!

## [`torchopenl3`](https://github.com/hugofloresgarcia/torchopenl3)
A PyTorch port of the openl3 audio embedding (ported from the [marl](https://github.com/marl/openl3) implementation). 

## [Philharmonia Dataset](https://github.com/hugofloresgarcia/philharmonia-dataset)
PyTorch dataset bindings for 14,000 sound samples of the Philharmonia Orchestra, retrieved from their website.
 [[github]()]
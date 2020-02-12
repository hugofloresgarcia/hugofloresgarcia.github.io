audio = audioread('Inside the asshole of an octopussy.m4a');

[c,l] = wavedec(audio,4,'db2');
approx = appcoef(c,l,'db2');
[cd1,cd2,cd3, cd4] = detcoef(c,l,[1, 2, 3, 4]);


p = audioplayer(audio, Fs/4);

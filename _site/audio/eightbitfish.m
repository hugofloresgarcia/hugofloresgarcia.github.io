audio = audioread('LittleFish.wav');
smplrt = 44.1e3
resolution = 8;
audiodoublebig = audio*resolution;

audio8bitint = round(audiodoublebig);
audio8bit = audio8bitint/resolution;
p = audioplayer(audio8bit,smplrt);
play(p)
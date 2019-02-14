"use strict";

window.onload = init;

// SCRIPT SCOPED VARIABLES

// 1- here we are faking an enumeration - we'll look at another way to do this soon 
const SOUND_PATH = Object.freeze({
	sound1: "media/Stessie - Close To You.wav",
	sound2: "media/Hyper Potions  Nokae - Expedition.mp3",
	sound3: "media/Shibuya by OHEY.mp3"
});

let audioElement,canvasElement;
let playButton, stopButton;
let drawCtx
let audioCtx;
let sourceNode, analyserNode, gainNode;
const NUM_SAMPLES = 256;
let audioData = new Uint8Array(NUM_SAMPLES/2); 
let maxRadius = 200;
var posX = 20, posY = 100;
let circles = [];
let maxCircles = 300;
let rightcolor = '#00B3E6', leftcolor = '#00E680';
let r1,r2,r3;

function init(){
	setupWebaudio();
	setupCanvas();
	setupUI();
	update();
}

function setupWebaudio(){
	// 1 - The || is because WebAudio has not been standardized across browsers yet
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AudioContext();

	// 2 - get a reference to the <audio> element on the page
	audioElement = document.querySelector("audio");
	audioElement.src = SOUND_PATH.sound1;

	// 3 - create an a source node that points at the <audio> element
	sourceNode = audioCtx.createMediaElementSource(audioElement);

	// 4 - create an analyser node
	analyserNode = audioCtx.createAnalyser();

	// fft stands for Fast Fourier Transform
	analyserNode.fftSize = NUM_SAMPLES;

	// 5 - create a gain (volume) node
	gainNode = audioCtx.createGain();
	gainNode.gain.value = 1;

	// 6 - connect the nodes - we now have an audio graph
	sourceNode.connect(analyserNode);
	analyserNode.connect(gainNode);
	gainNode.connect(audioCtx.destination);
}

function setupCanvas(){
	canvasElement = document.querySelector('canvas');
	drawCtx = canvasElement.getContext("2d");
}

function setupUI(){
	playButton = document.querySelector("#playButton");
	playButton.onclick = e => {
		// check if context is in suspended state (autoplay policy)
		if (audioCtx.state == "suspended") {
			audioCtx.resume();
		}

		if (e.target.dataset.playing == "no") {
			audioElement.play();
			e.target.dataset.playing = "yes";
		// if track is playing pause it
		} else if (e.target.dataset.playing == "yes") {
			audioElement.pause();
			e.target.dataset.playing = "no";
		}
	};

	//stop button
	stopButton = document.querySelector("#stopButton");
	stopButton.onclick = e => {
		audioElement.pause();
		audioElement.currentTime = 0;
		playButton.dataset.playing = "no";
	};

	//volume slider
	let volumeSlider = document.querySelector("#volumeSlider");
	volumeSlider.oninput = e => {
		gainNode.gain.value = e.target.value;
		volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
	};
	volumeSlider.dispatchEvent(new InputEvent("input"));

	//radius slider
	let radiusSlider = document.querySelector("#radiusSlider");
	radiusSlider.oninput = e => {
		maxRadius = e.target.value * 150;
		radiusLabel.innerHTML = Math.round((e.target.value/2 * 100));
	};
	radiusSlider.dispatchEvent(new InputEvent("input"));

	let circleNumSlider = document.querySelector("#circleNumSlider");
	circleNumSlider.oninput = e => {
		if(maxCircles > e.target.value){
			circles.pop();
			console.log("popping");
		}
		maxCircles = e.target.value;
		circleNumLabel.innerHTML = e.target.value;
	};
	circleNumSlider.dispatchEvent(new InputEvent("input"));

	document.querySelector("#trackSelect").onchange = e =>{
		audioElement.src = e.target.value;
		// pause the current track if it is playing
		//playButton.dispatchEvent(new MouseEvent("click"));
		playButton.dataset.playing = "no";
	};
	
	
	//checks for colors
	r1 = document.getElementById('r1');
	r1.onclick = e => {
		rightcolor = '#00B3E6';
		leftcolor = '#00E680';
		for(let c of circles){
			c.color = getRandomColorC();
		}
	};
	r2 = document.getElementById('r2');
	r2.onclick = e => {
		rightcolor = '#DC143C';
		leftcolor = '#FFD700';
		for(let c of circles){
			c.color = getRandomColorW();
		}
	};
	r3 = document.getElementById('r3');
	r3.onclick = e => {
		rightcolor = '#00FF00';
		leftcolor = '#FF00FF';
		for(let c of circles){
			c.color = getRandomColorN();
		}
	};


	// if track ends
	audioElement.onended =  _ => {
		playButton.dataset.playing = "no";
	};

	document.querySelector("#fsButton").onclick = _ =>{
		requestFullscreen(canvasElement);
	};

}

function update() { 
	// this schedules a call to the update() method in 1/60 seconds
	requestAnimationFrame(update);

	// populate the audioData with the frequency data
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	//OR analyserNode.getByteTimeDomainData(audioData); // waveform data

	// DRAW!
	drawCtx.clearRect(0,0,800,600);  
	let barWidth = 1.5;
	let barSpacing = 1;
	let barHeight = 30;
	let topSpacing = 10;

	
	//background circles
	//create a new circle
	if(circles.length < maxCircles){
		createCircles(2);
	}

	//move the circles
	for(let c of circles){
		c.moveCircle();
	}
	
	// loop through the audio data and draw!
	for(let i=0; i<audioData.length; i++) { 
		// bars
		drawCtx.fillStyle = rightcolor;
		drawCtx.fillRect(i * (barWidth + barSpacing),215,barWidth,-1*(barHeight+audioData[i]*.6));

		drawCtx.fillStyle = leftcolor;
		drawCtx.fillRect(638-i * (barWidth + barSpacing),185,barWidth,barHeight+audioData[i]*.6);
		
		//bumping circle stuff

		//red-ish medium circles
		let percent = audioData[i]/255;
		maxRadius = maxRadius;
		let circleradius = percent * maxRadius;
		drawCtx.beginPath();
		drawCtx.fillStyle = makeColor(60,179,113,.34-percent/3.0);
		drawCtx.arc(canvasElement.width/2, canvasElement.height/2, circleradius, 0,2*Math.PI, false);
		drawCtx.fill();
		drawCtx.closePath();

		//blue circles, bigger more transparent
		drawCtx.beginPath();
		drawCtx.fillStyle = makeColor(0,128,128,.10-percent/10.0);
		drawCtx.arc(canvasElement.width/2, canvasElement.height/2, circleradius*1.5, 0,2*Math.PI, false);
		drawCtx.fill();
		drawCtx.closePath();

		//yellow circles, smaller
		drawCtx.beginPath();
		drawCtx.fillStyle = makeColor(72,208,204,.5-percent/5.0);
		drawCtx.arc(canvasElement.width/2, canvasElement.height/2, circleradius*.50, 0,2*Math.PI, false);
		drawCtx.fill();
		drawCtx.closePath();
	}
	
}

// HELPER FUNCTIONS
function makeColor(red, green, blue, alpha){
	var color='rgba('+red+','+green+','+blue+', '+alpha+')';
	return color;
}

function requestFullscreen(element) {
	if (element.requestFullscreen) {
	  element.requestFullscreen();
	} else if (element.mozRequestFullscreen) {
	  element.mozRequestFullscreen();
	} else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
	  element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) {
	  element.webkitRequestFullscreen();
	}
	// .. and do nothing if the method is not supported
}

//craetes circles based on number passed in
function createCircles(numCircles){
    for(let i=0; i<numCircles; i++){
        let c = new Circle(getRandomColorC());
        circles.push(c);
    }
}

function clearCircles(){
	for(let i=0; i<circles.length; i++){
        circles.pop();
    }
}

function getRandomColorC(){
	var colorArray = ['#00B3E6', '#3366E6', '#99FF99', '#33FFCC', '#4DB3FF', '#1AB399',
  '#00E680', '#66E64D', '#4D80CC', '#4DB380', '#99E6E6', '#6666FF'];
	return colorArray[Math.floor(Math.random()*colorArray.length)];
}

function getRandomColorW(){
	var colorArray = ['#FF7F50', '#FF8C00', '#B22222', '#F08080', '#800000', '#800000', '#FF4500',
  '#FFA500', '#D2691E', '#B22222', '#FFA07A', '#F0E68C', '#DAA520','#FFD700'];
	return colorArray[Math.floor(Math.random()*colorArray.length)];
}

function getRandomColorN(){
	var colorArray = ['#00FF00', '#FFFF00', '#FF00FF', '#FF1493', '#FFD700', '#7FFF00', '#00FFFF',
  '#00FFFF'];
	return colorArray[Math.floor(Math.random()*colorArray.length)];
}
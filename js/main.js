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
let maxRadius = 10;
var posX = 20, posY = 100;
let circles = [];
let maxCircles = 300;
let rightcolor = '#00B3E6', leftcolor = '#00E680';
let circolor1, circolor2;
let r1,r2,r3;
let bass = false;
let bassFilter;
let inverseCirc = false;
let bright = false;


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

	
	bassFilter  = audioCtx.createBiquadFilter();
	bassFilter.type = "lowshelf";

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
	sourceNode.connect(bassFilter);
	bassFilter.connect(analyserNode);
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
		}
		else if (e.target.dataset.playing == "yes") {
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
		gainNode.gain.value = (e.target.value/6);
		volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
	};
	volumeSlider.dispatchEvent(new InputEvent("input"));

	//spin slider
	let spinSlider = document.querySelector("#spinSlider");
	spinSlider.oninput = e => {														
		spinSpeed = e.target.value * 0.0001;
		spinLabel.innerHTML = e.target.value;
	};																											
	spinSlider.dispatchEvent(new InputEvent("input"));			

	//background circles slider
	let circleNumSlider = document.querySelector("#circleNumSlider");
	circleNumSlider.oninput = e => {
		if(maxCircles > e.target.value){
			for(let i = 0; i <= (maxCircles - e.target.value); i++){
				circles.pop();
			}
			//console.log("popping");
		}
		maxCircles = e.target.value;
		circleNumLabel.innerHTML = e.target.value;
	};
	circleNumSlider.dispatchEvent(new InputEvent("input"));

	document.querySelector("#trackSelect").onchange = e =>{
		audioElement.src = e.target.value;
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

	document.querySelector("#bassCB").checked = bass;
	document.querySelector("#bassCB").onchange = e => {
		bass = e.target.checked;
		bassToggle();
	};
	bassToggle();
	
	document.querySelector("#inverseCirc").checked = inverseCirc;
	document.querySelector("#inverseCirc").onchange = e => {
		inverseCirc = e.target.checked;
	};

	//use gradient
	document.querySelector("#bright").checked = bright;
	document.querySelector("#bright").onchange = e => {
		bright = e.target.checked;
		brightToggle();
	};
	brightToggle();
}


let loopCount = 1.5708;
let spinSpeed = 0.0001;
function update() { 
	// this schedules a call to the update() method in 1/60 seconds
	requestAnimationFrame(update);
	// console.log("max circles "  + maxCircles);
	// console.log(circles.length)
	// populate the audioData with the frequency data
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	//OR analyserNode.getByteTimeDomainData(audioData); // waveform data

	// DRAW!
	drawCtx.clearRect(0,0,800,600);  
	let barWidth = 30;
	let barSpacing = 1;
	let barHeight = 2.2;
	let topSpacing = 10;

	
	//background circles
	//create a new circle
	if(circles.length < maxCircles){
		createCircles(2);
	}
	
	//if track isnt playing, move circles (gives fatal error)
//	if(document.querySelector("#playButton").target.dataset.playing == "no"){
//		//move the circles
//		for(let c of circles){
//			c.moveCircle();
//		}
//	}

	
	// loop through the audio data and draw!
	for(let i=0; i<audioData.length; i++) { 
		drawCtx.save();
		drawCtx.translate(canvasElement.width/2,canvasElement.height/2);
		drawCtx.rotate(loopCount);//making this rotate i gives it a cool result
		
		drawCtx.fillStyle = rightcolor;
		drawCtx.strokeStyle = rightcolor;
		//drawCtx.fillRect(canvasElement.width/2,i * (barHeight + barSpacing),-1*(barWidth+audioData[i]*.6),barHeight);
		drawCtx.beginPath();
		if(inverseCirc){
			drawCtx.arc(0,0,(i*1.5)+10,0,audioData[i]*.009,true);
		}
		else{
			drawCtx.arc(0,0,(i*1.5)+10,0,audioData[i]*.009,false);//swap the circles true and false value and switch the starter angle from positive to negative for cool pulsing effect drawCtx.arc(0,0,(i*1.5)+50,0.00174533,audioData[i]*.0009,true);
		}
		//drawCtx.arc(canvasElement.width/2,canvasElement.height/2,75,1,audioData[i]/100,true);
		//drawCtx.closePath();
		drawCtx.stroke();
		drawCtx.restore();
		drawCtx.save();
		drawCtx.translate(canvasElement.width/2,canvasElement.height/2);
		drawCtx.rotate(loopCount);
		drawCtx.scale(-1,1);
		drawCtx.fillStyle = leftcolor;
		//drawCtx.fillRect(canvasElement.width/2,canvasElement.height-i * (barHeight + barSpacing),1*(barWidth+audioData[audioData.length/2+i]*.6),barHeight);
		drawCtx.strokeStyle =leftcolor;
		//drawCtx.fillRect(canvasElement.width/2,i * (barHeight + barSpacing),-1*(barWidth+audioData[i]*.6),barHeight);
		drawCtx.beginPath();
		
		if(inverseCirc){
			drawCtx.arc(0,0,(i*1.5)+10,0,-audioData[i]*.009,false);
		}
		else{
			drawCtx.arc(0,0,(i*1.5)+10,0,-audioData[i]*.009,true);
		}
		
		//drawCtx.arc(canvasElement.width/2,canvasElement.height/2,75,1,audioData[i]/100,true);
		//drawCtx.closePath();
		drawCtx.stroke();
		drawCtx.restore();


		//bumping circle stuff
		let percent = audioData[i]/255;
		//circles[i].alpha += percent;
		//makeColor(77,128,204,.34-percent/3.0);
		
		
		//checks which colors are selected
//		if(document.getElementById('r1').checked){
//			circolor1 = makeColor(77,128,204,.34-percent/3.0);
//			circolor2 = makeColor(77,179,128,.10-percent/10.0);
//		}
//		else if(document.getElementById('r2').checked){
//			circolor1 = makeColor(178,34,34,.34-percent/3.0);
//			circolor2 = makeColor(255,145,0,.10-percent/10.0);
//		}
//		else if(document.getElementById('r3').checked){
//			circolor1 = makeColor(0,255,255,.34-percent/3.0);
//			circolor2 = makeColor(255,215,0,.10-percent/10.0);
//		}
		
		
		//medium circles
		maxRadius = maxRadius;
		let circleradius = percent * maxRadius;
/*		drawCtx.beginPath();
		drawCtx.fillStyle = circolor1;
		drawCtx.arc(canvasElement.width/2, canvasElement.height/2, circleradius, 0,2*Math.PI, false);
		drawCtx.fill();
		drawCtx.closePath();*/
		
		
		circles[i].moveCircle(circleradius);
		
		loopCount += spinSpeed;
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
        let c = new Circle(getRandomColorC(),.5);
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
	var colorArray = ['#FF7F50', '#FF8C00', '#B22222', '#F08080', '#800000', '#FF4500',
  '#FFA500', '#D2691E', '#FFA07A', '#F0E68C', '#DAA520','#FFD700'];
	return colorArray[Math.floor(Math.random()*colorArray.length)];
}

function getRandomColorN(){
	var colorArray = ['#00FF00', '#7FFF00', '#FF00FF', '#FF1493', '#FFD700', '#FFFF00','#00FFFF','#00FFFF'];
	return colorArray[Math.floor(Math.random()*colorArray.length)];
}

function bassToggle(){
	if(bass){
		bassFilter.frequency.setValueAtTime(1000,audioCtx.currentTime);
		bassFilter.gain.setValueAtTime(15,audioCtx.currentTime);
	}
	else{
		bassFilter.gain.setValueAtTime(0, audioCtx.currentTime);
	}
}

function brightToggle(){
	if(bright){
		if(document.querySelector("#r1").checked){
			var grad = drawCtx.createRadialGradient(320, 200, 25, 320, 200, 150);
			grad.addColorStop(0, '#00B3E6');                    
			grad.addColorStop(1, '#00E680');
			rightcolor = grad;
			leftcolor = grad;
		}
		if(document.querySelector("#r2").checked){
			var grad = drawCtx.createRadialGradient(320, 200, 25, 320, 200, 150);
			grad.addColorStop(0, '#DC143C');                    
			grad.addColorStop(1, '#FFD700');
			rightcolor = grad;
			leftcolor = grad;
		}
		if(document.querySelector("#r3").checked){
			var grad = drawCtx.createRadialGradient(320, 200, 25, 320, 200, 150);
			grad.addColorStop(0, '#00FF00');                    
			grad.addColorStop(1, '#FF00FF');
			rightcolor = grad;
			leftcolor = grad;
		}
	}
	if(!bright){
		if(document.querySelector("#r1").checked){
			rightcolor = '#00B3E6';
			leftcolor = '#00E680';
		}
		if(document.querySelector("#r2").checked){
			rightcolor = '#DC143C';                    
			leftcolor = '#FFD700';
		}
		if(document.querySelector("#r3").checked){
			rightcolor = '#00FF00';                    
			leftcolor = '#FF00FF';
		}
	}
}
var app = app || {};

app.utilities = (function(){
	
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
	function createCircles(numCircles, circles){
		if(document.querySelector("#r1").checked){
			for(let i=0; i<numCircles; i++){
				let c = new Circle(getRandomColorC(),.5);
				circles.push(c);
			}
		}
		if(document.querySelector("#r2").checked){
			for(let i=0; i<numCircles; i++){
				let c = new Circle(getRandomColorW(),.5);
				circles.push(c);
			}
		}
		if(document.querySelector("#r3").checked){
			for(let i=0; i<numCircles; i++){
				let c = new Circle(getRandomColorN(),.5);
				circles.push(c);
			}
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

	function bassToggle(bass,bassFilter, audioCtx){
		if(bass){
			bassFilter.frequency.setValueAtTime(1000,audioCtx.currentTime);
			bassFilter.gain.setValueAtTime(15,audioCtx.currentTime);
		}
		else{
			bassFilter.gain.setValueAtTime(0, audioCtx.currentTime);
		}
	}

	function brightToggle(drawCtx,canvasElement){
		if(bright){
			if(document.querySelector("#r1").checked){
				grad = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 20, 320, 200, 150);
				grad.addColorStop(0, '#00B3E6');                    
				grad.addColorStop(1, '#00E680');
				rightcolor = grad;
				leftcolor = grad;
			}
			if(document.querySelector("#r2").checked){
				grad = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 25, 320, 200, 150);
				grad.addColorStop(0, '#DC143C');                    
				grad.addColorStop(1, '#FFD700');
				rightcolor = grad;
				leftcolor = grad;
			}
			if(document.querySelector("#r3").checked){
				grad = drawCtx.createRadialGradient(canvasElement.width/2, canvasElement.height/2, 25, 320, 200, 150);
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
	
	function elapsedTime(seconds){//based off a guid at https://medium.com/@thomasmarren/create-a-custom-audio-progress-bar-using-javascript-51b358811abd
		let currentSeconds = Math.floor(seconds%60);
		if(currentSeconds < 10){
			currentSeconds = "0" + currentSeconds;
		}
		let minutes = Math.floor(seconds/60);
		return minutes + ":" + currentSeconds
	}
	
	return{
		elapsedTime,
		brightToggle,
		bassToggle,
		getRandomColorN,
		getRandomColorW,
		getRandomColorC,
		createCircles,
		requestFullscreen,
		makeColor
	}

})();
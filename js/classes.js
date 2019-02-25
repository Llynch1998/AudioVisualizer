var app = app || {};

app.classes = (function(){


	// //circles function with move, relfect, and follow player functions
	// function CreateCircle(uColor = 0xFF0000, number){
	// 	let circles[];
	// 	
	// 		
	
	// return{
				
	// }
	for(let i = 0; i<number; i++){
			
		let c = {};
			c.posX= canvasElement.width/2;
			c.posY = canvasElement.height/2;
			c.originX = posX;
			c.originY = posY;
			c.radius = Math.floor(Math.random() * 5) + 1;
			c.incX = (Math.random() * 10) - 5;
			c.incY = (Math.random() * 10) - 5;
			c.color = uColor;
			c.actve = true;
			c.alpha = .5;
			// 		c.display = function(drawCtx){
	// 			this.posX += this.incX;
	// 			this.posY += this.incY;
	// 			if(this.posX < 0 - this.radius || this.posX > 640){
	// 				this.posX = this.originX;
	// 				this.posY = this.originY;
	// 			}
	// 			if(this.posY < 0 - this.radius || this.posY > 400){
	// 				this.posX = this.originX;
	// 				this.posY = this.originY;
	// 			}
	// 			drawCtx.save();
	// 			drawCtx.globalAlpha = this.alpha;
	// 			drawCtx.beginPath();
	// 			drawCtx.fillStyle = this.color;
	// 			drawCtx.arc(this.posX, this.posY, radius, 0, Math.PI*2, true); 
	// 			drawCtx.closePath();
	// 			drawCtx.fill();
	// 			drawCtx.restore();
	// 		}
	// 		circles.push();
			
	// 	}
				c.display = function(){
								this.posX += this.incX;
				this.posY += this.incY;
				if(this.posX < 0 - this.radius || this.posX > 640){
					this.posX = this.originX;
					this.posY = this.originY;
				}
				if(this.posY < 0 - this.radius || this.posY > 400){
					this.posX = this.originX;
					this.posY = this.originY;
				}
				drawCtx.save();
				drawCtx.globalAlpha = this.alpha;
				drawCtx.beginPath();
				drawCtx.fillStyle = this.color;
				drawCtx.arc(this.posX, this.posY, radius, 0, Math.PI*2, true); 
				drawCtx.closePath();
				drawCtx.fill();
				drawCtx.restore();
			}
			circles.push();
				
			
			
		}
		return{

		}
})();
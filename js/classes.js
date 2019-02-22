//circles function with move, relfect, and follow player functions
class Circle{
    constructor(color = 0xFF0000,alpha){
		this.posX = 320;
		this.posY = 200;
		this.originX = this.posX;
		this.originY = this.posY;
    this.radius = Math.floor(Math.random() * 5) + 1;
		this.incX = (Math.random() * 10) - 5;
		this.incY = (Math.random() * 10) - 5;
		this.color = color;
		this.actve = true;
		this.alpha = alpha;
    }
	
	moveCircle() {
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
		drawCtx.arc(this.posX, this.posY, this.radius, 0, Math.PI*2, true); 
		drawCtx.closePath();
		drawCtx.fill();
		drawCtx.restore();
	}

}
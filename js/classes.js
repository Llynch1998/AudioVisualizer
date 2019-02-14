//circles function with move, relfect, and follow player functions
class Circle{
    constructor(color = 0xFF0000){
		this.posX = 320;
		this.posY = 200;
        this.radius = Math.floor(Math.random() * 5) + 1;
		this.incX = Math.floor(Math.random() * 10) - 5;
		this.incY = Math.floor(Math.random() * 10) - 5;
		this.color = color;
		this.actve = true;
    }
	
	moveCircle() {
		this.posX += this.incX;
		this.posY += this.incY;
		drawCtx.beginPath();
		drawCtx.fillStyle = this.color;
		drawCtx.arc(this.posX, this.posY, this.radius, 0, Math.PI*2, true); 
		drawCtx.closePath();
		drawCtx.fill();
	}

}
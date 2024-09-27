export function drawCircle(ctx, fillstyle, thickness, steps, x0, y0, rad, scale, changeX, changeY, scaleCalc){
    function calcX(angle, hypotenuse){
        let angleInRad = angle * Math.PI / 180;
        return (Math.sin(angleInRad) * hypotenuse);
    }

    let angleGain = 360 / steps;
    ctx.fillStyle = '' + fillstyle;
    let currAngle = 0;

    while(currAngle < 360){
        let xMult = 1;
        let yMult = 1;
        let currX = 0;
        let currY = 0;
        if(currAngle > 0 && currAngle <= 90){
            xMult = 1;
            yMult = 1;
        }
        else if(currAngle > 90 && currAngle <= 180){
            xMult = 1;
            yMult = -1;
        }
        else if(currAngle > 180 && currAngle <= 270){
            xMult = -1;
            yMult = -1;
        }
        else if(currAngle > 270 && currAngle <= 360){
            xMult = -1;
            yMult = 1;
        }

        currX = xMult * calcX((currAngle > 180? 360 - currAngle: currAngle),rad);
        currY = yMult * Math.sqrt((rad * rad) - (currX * currX))

        ctx.fillRect(scale * (x0 + currX + changeX - thickness/2), scale * (y0 + currY + changeY - thickness/2),
        scaleCalc(scale) * thickness,
        scaleCalc(scale) * thickness);

        currAngle += angleGain;

        // context.drawImage(this.planetImage, scale * (this.centerX + this.currX + changeX - (this.planetImage.width/2)),
        // scale * (this.centerY + this.currY + changeY - (this.planetImage.height/2)),
        // this.planetImage.width * scale, this.planetImage.height * scale);
    }
}
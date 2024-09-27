import { useState } from "react";

export class Planet{
    picPath;
    RenderComp;
    orbitRad;
    speed;
    centerX;
    centerY;
    currX;
    currY;
    currAngle;
    planetImage;
    planetRad;

    constructor(){
        this.picPath = '';
        this.orbitRad = 0;
        this.RenderComp = ()=>{return <h1>aboba</h1>}
        this.speed = 1;
        this.centerX = 0;
        this.centerY = 0;
        this.currX = 0;
        this.currY = 0;
        this.currAngle = 0;
        this.planetRad = 0;
    }

    setRenderComp(component){
        this.RenderComp = component;
    }

    waitImageLoad(w, h){
        if(typeof w == 'number' && typeof h == 'number'){
            this.planetImage = new Image(w, h);
        }
        else{
            this.planetImage = new Image;
        }
        this.planetImage.src = this.picPath;
        this.planetImage.onload = ()=>{
            return 1;
        }
    }

    setValues(picPath, orbitRad, speed, centerX, centerY, currAngle, planetRad){
        this.picPath = picPath;
        this.orbitRad = orbitRad;
        this.speed = speed;
        this.centerX = centerX;
        this.centerY = centerY;
        this.currAngle = currAngle;
        this.planetRad = planetRad;
    }


    calcX(angle, hypotenuse){
        let angleInRad = angle * Math.PI / 180;
        return (Math.sin(angleInRad) * hypotenuse);
    }

    setCurrCoords(angle){
        let calcAngle = (angle > 180? 360 - angle : angle);
        let xMult = 1;
        let yMult = 1;
        if(angle > 0 && angle <= 90){
            xMult = 1;
            yMult = 1;
        }
        else if(angle > 90 && angle <= 180){
            xMult = 1;
            yMult = -1;
        }
        else if(angle > 180 && angle <= 270){
            xMult = -1;
            yMult = -1;
        }
        else if(angle > 270 && angle <= 360){
            xMult = -1;
            yMult = 1;
        }

        this.currX = xMult * this.calcX(calcAngle, this.orbitRad);
        this.currY = yMult * Math.sqrt((this.orbitRad * this.orbitRad) - (this.currX * this.currX))

        return ('x:'+this.currX+'y:'+this.currY)
    }

    setNextAngle(speedScale){
        //console.log(speedScale);
        this.currAngle += this.speed * (typeof speedScale == 'number'?speedScale: 1);
        this.currAngle = this.currAngle % 360;
    }

    InProximity(x, y, scale, changeX, changeY){
        let currCenterX = scale * (this.centerX + this.currX + changeX);
        let currCenterY = scale * (this.centerY + this.currY + changeY);
        let distanceToPoint = Math.sqrt(Math.pow((currCenterX - x), 2) + Math.pow(currCenterY - y, 2));
        return distanceToPoint <= (this.planetRad * scale);
    }

    renderPlanet(context, scale, changeX, changeY){
        context.drawImage(this.planetImage, scale * (this.centerX + this.currX + changeX - (this.planetImage.width/2)),
        scale * (this.centerY + this.currY + changeY - (this.planetImage.height/2)),
        this.planetImage.width * scale, this.planetImage.height * scale);
    }
}
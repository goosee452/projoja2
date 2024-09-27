import { useState, useEffect, useReducer } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Main } from './components/main'
import { calcWindowParam } from './components/calcWindowParam.js'
import { values } from './components/VALUES.jsx'
import { Functions } from './components/functions.jsx'
import { Planet } from './components/planet.jsx'
import { wheelScale } from './components/wheelScale.js'
import { mouseMovement } from './components/mouseMovement.js'
import { drawCircle } from './components/drawCircle.js'
import { PlanetSlider } from './components/planetDescr.jsx'
import { useContext } from 'react'

//---------------------------------------------------------------------------
import { earthPage } from './planetPages/earth.jsx'
import { sunPage } from './planetPages/sun.jsx'
import { mercuryPage } from './planetPages/mercury.jsx'
import { venusPage } from './planetPages/venus.jsx'
import { marsPage } from './planetPages/mars.jsx'
import { jupiterPage } from './planetPages/jupiter.jsx'
import { saturnPage } from './planetPages/saturn.jsx'
import { neptunePage } from './planetPages/neptune.jsx'
import { uranusPage } from './planetPages/uranus.jsx'
//---------------------------------------------------------------------------


import { useRef } from 'react'
const innParPerc = values.innerParamPercent;

function renderPlanet(planet, ctx, impValues, speed) {
  planet.renderPlanet(ctx, impValues.scale, impValues.changeX, impValues.changeY);
  planet.setCurrCoords(planet.currAngle)
  planet.setNextAngle(speed);
}

function planetClicked(hoverElId, planets, impValues, setCurrPlanet){
  let mouseHover = false;
  document.getElementById(hoverElId).addEventListener('mouseover', (event)=>{mouseHover = true})
  document.getElementById(hoverElId).addEventListener('mouseleave', ()=>{
    mouseHover = false;
  })
  addEventListener('click', (event)=>{
    if(!mouseHover){
      planets.reduce((prev, curr, i)=>{
        let check = planets[i].InProximity(+event.clientX, +event.clientY, impValues.scale, impValues.changeX, impValues.changeY);
        if(check){
          setCurrPlanet(i);
        }
      }, planets[0])
    }
  })
}

function setCurrAngles(planets, angles){
  planets.reduce((prev, curr, i)=>{
    planets[i].currAngle = angles[i];
  }, planets[0])
}

function socketIsOpen(ws){
  return ws.readyState === ws.OPEN;
}

//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------
function App() {
  const [count, setCount] = useState(0)
  let [speed, setSpeed] = useState(1);
  let main = new Main();

  async function connect() {
    return await fetch('http://localhost:2007/connectToSession', {
      method: 'GET',
      credentials: 'include'
    })
    .then((data)=>{
      if(!data.ok){

      }else{
        return data.text();
      }
    })
    .then((data)=>{
      return data;
    })
  }


  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  let intervalRef = useRef('0');
  //________________________________Planets_____________________________________________________________________-
  let sun = new Planet;
  sun.setValues('src/assets/sun.png', 0, 0, centerX, centerY, 0, 150);
  sun.waitImageLoad(300, 300);
  sun.setRenderComp(sunPage);

  let mercury = new Planet;
  mercury.setValues('src/assets/mercury.png', 250, 0.1, centerX, centerY, 30, 25);
  mercury.waitImageLoad(50, 50);
  mercury.setRenderComp(mercuryPage);

  let venus = new Planet;
  venus.setValues('src/assets/venus.png', 550, 0.04, centerX, centerY, 50, 50);
  venus.waitImageLoad(100, 100);
  venus.setRenderComp(venusPage);

  let earth = new Planet;
  earth.setValues('src/assets/earth.png', 900, 0.025, centerX, centerY, 160, 60);
  earth.waitImageLoad(120, 120);
  earth.setRenderComp(earthPage)

  let mars = new Planet;
  mars.setValues('src/assets/mars.png', 1300, 0.0125, centerX, centerY, 70, 50);
  mars.waitImageLoad(100, 100);
  mars.setRenderComp(marsPage);

  let jupiter = new Planet;
  jupiter.setValues('src/assets/jupiter.png', 1900, 0.002, centerX, centerY, 0, 125);
  jupiter.waitImageLoad(250, 250);
  jupiter.setRenderComp(jupiterPage);

  let saturn = new Planet;
  saturn.setValues('src/assets/saturn.png', 2400, 0.001, centerX, centerY, 180, 125);
  saturn.waitImageLoad(250, 250);
  saturn.setRenderComp(saturnPage);

  let uranus = new Planet;
  uranus.setValues('src/assets/uranus.png', 2900, 0.0003, centerX, centerY, 270, 100);
  uranus.waitImageLoad(200, 200);
  uranus.setRenderComp(uranusPage)

  let neptune = new Planet;
  neptune.setValues('src/assets/neptune.png', 3400, 0.00015, centerX, centerY, 60, 90);
  neptune.waitImageLoad(180, 180);
  neptune.setRenderComp(neptunePage);

  let planets = new Array();
  planets.push(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);
  //-------------------------------------------------------------------------------------------------------------



  let impValues = {
    scale: 1,
    mouseDown: false,
    changeX: 0,
    changeY: 0,
    currPlanet: 0,
    speed: 1
  }

  //dispatch({newInterval: int})
  useEffect(() => {
    connect();
    let ws = new WebSocket('ws://localhost:2008');
    ws.onopen = function (e) {
    };

    ws.onmessage = (e)=>{
      //console.log(e.data);
      let parsedData = JSON.parse(e.data);
      //console.log(parsedData);
      if(parsedData.msgType == 'connection' && typeof parsedData.planetData != 'undefined'){
        setCurrAngles(planets, parsedData.planetData.angles)
      }
    }


    let canv = document.getElementById('canvMain');
    let ctx = canv.getContext('2d');

    let backgroundImg = new Image();
    backgroundImg.src = 'src/assets/main_back2.png'

    let windowH = +calcWindowParam(+window.innerHeight, innParPerc);
    let windowW = +calcWindowParam(+window.innerWidth, innParPerc);

    let pattern;
    backgroundImg.onload = () => {
      pattern = ctx.createPattern(backgroundImg, "repeat");
      ctx.fillStyle = pattern;
    }

    //let scale = 1;
    const deltaScale = 0.025;
    const deltaChange = 2;

    clearInterval(intervalRef.current);
    let int = setInterval(() => {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canv.width, canv.height);

        renderPlanet(sun, ctx, impValues, impValues.speed);
        renderPlanet(mercury, ctx, impValues, impValues.speed);
        renderPlanet(earth, ctx, impValues, impValues.speed);
        renderPlanet(venus, ctx, impValues, impValues.speed)
        renderPlanet(mars, ctx, impValues, impValues.speed);
        renderPlanet(jupiter, ctx, impValues, impValues.speed);
        renderPlanet(saturn, ctx, impValues, impValues.speed);
        renderPlanet(uranus, ctx, impValues, impValues.speed);
        renderPlanet(neptune, ctx, impValues, impValues.speed);


        let planetsAngles = new Array();
        planets.reduce((prev, curr, i)=>{
          planetsAngles.push(planets[i].currAngle);
        }, planets[0])
        let socketData = {
          angles: planetsAngles
        }
        if(socketIsOpen(ws)){
          ws.send(JSON.stringify(socketData));
        }
    }, 20)
    intervalRef.current = int + '';

    //-------------------------------------------------------------------------------------------------------------------------------
    const MAX_SCALE = values.maxScale;
    const MIN_SCALE = values.minScale;
    wheelScale(impValues, deltaScale, 'sliderMain', MAX_SCALE, MIN_SCALE);
    mouseMovement(impValues, deltaChange)
    planetClicked('sliderMain', planets, impValues, setCurrPlanet);
    document.getElementById('upSpeedButton').addEventListener('click', (event)=>{
      impValues.speed = impValues.speed + 1;
    })
    document.getElementById('downSpeedButton').addEventListener('click', (event)=>{
      impValues.speed = impValues.speed > 1? impValues.speed - 1: impValues.speed;
    })
    //-------------------------------------------------------------------------------------------------------------------------------

  }, [])

  let [currPlanet, setCurrPlanet] = useState(0);
  return (
    <>
      <Functions speed={speed} setSpeed={setSpeed} vals={impValues}></Functions>
      <PlanetSlider currPlanet={currPlanet} display='true' planets={planets}></PlanetSlider>
      <main.render></main.render>
      {/* <button onClick={() => {
        console.log(currPlanet + 'bogusus');
      }}>bogus</button> */}
    </>
  )
}

export default App

import '../styles/PlanetSlider.css'

export function PlanetSlider(props){
    let display = +props.display;
    let currPlanet = +props.currPlanet;
    let planets = props.planets;

    function RenderPlanetDescr(props){
        let planets = props.planets;
        let i = +props.i;
        return planets[i].RenderComp();
    }

    function hideSlider(){
        let sliderMain = document.getElementById('sliderMain');
        let sliderButton = document.getElementById('displaySlider');

        sliderButton.disabled = true;

        function moveEl(element, Aname, dir){
            element.style.animationName = ''+Aname;
            element.style.animationDirection = '' + dir;
            element.style.animationDuration = '300ms';
            element.style.animationFillMode = 'forwards';
            element.style.animationTimingFunction = 'ease-in-out';
        }

        function clearElAnimation(element){
            element.style.animationName = 'none';
            element.style.animationDirection = '';
            element.style.animationDuration = '';
            element.style.animationFillMode = '';
            element.style.animationTimingFunction = '';
        }

        if(sliderMain.style.display == 'none'){
            sliderMain.style.display = 'block'
            moveEl(sliderMain, 'move', 'reverse');

            setTimeout(()=>{
                sliderButton.disabled = false;
                clearElAnimation(sliderMain);
            }, 300)
        }
        else{
            moveEl(sliderMain, 'move', 'normal');

            setTimeout(()=>{
                sliderMain.style.display = 'none'
                sliderButton.disabled = false;
                clearElAnimation(sliderMain);
            }, 300)
        }

        //sliderMain.style.display = 'none'
    }

    return <div id="slider">
        <div id="sliderMain"className='bobobo'>
            <RenderPlanetDescr planets={planets} i={currPlanet}></RenderPlanetDescr>
        </div>
        <button id="displaySlider" onClick={hideSlider}></button>
    </div>
}
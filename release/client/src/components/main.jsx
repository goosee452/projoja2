import { calcWindowParam } from "./calcWindowParam";
import { values } from "./VALUES";
import { Functions } from "./functions";

const innParPerc = values.innerParamPercent;

export class Main{
    
    render(){
        let windowH = calcWindowParam(+window.innerHeight, innParPerc) + 'px';
        let windowW = calcWindowParam(+window.innerWidth, innParPerc) + 'px';
        return <div id="canvMainDiv">
            <canvas width={windowW} height={windowH} id="canvMain"></canvas>
            <script>
            </script>
        </div>
    }

    onRender(){
    }
}

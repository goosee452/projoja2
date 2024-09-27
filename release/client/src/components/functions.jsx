export function Functions(props) {
    return <div id="MainFunctionsDiv">
        <nav id="Functions">
            <button id="upSpeedButton" onClick={() => {
                props.setSpeed(props.speed + 1);
            }}>Speed Up</button>
            <div>{props.speed}x</div>
            <button id="downSpeedButton" onClick={() => {
                props.speed > 1? props.setSpeed(props.speed - 1): props.speed;
            }}>Speed Down</button>
        </nav>
    </div>
}
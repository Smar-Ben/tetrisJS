import React, { Fragment } from "react";
import "../css/App.css";

function Ecran(props) {
    return (
        <Fragment>
            <div className="menu">
                <h2 style={{ color: "white", fontSize: 54, marginBottom: 0 }}>TETRIS</h2>
                <small style={{ color: "white" }}>by Rams</small>
                <br></br>
                <br></br>
                <button
                    className="button1"
                    onClick={() => {
                        props.play();
                    }}
                >
                    Jouer
                </button>
                <button className="button1">Option</button>
                <button className="button1">Best Score</button>
            </div>
        </Fragment>
    );
}

export default Ecran;

import React, { Fragment } from "react";
import "../css/App.css";

function Ecran(props) {
    return (
        <Fragment>
            <div className="pauseScreen">
                <h3 style={{ margin: 10 }}>PAUSE</h3>
                <button
                    className="button2"
                    onClick={() => {
                        props.pause();
                    }}
                >
                    Reprendre
                </button>
                <button
                    className="button2"
                    onClick={() => {
                        props.restart();
                        props.pause();
                    }}
                >
                    Recommencer
                </button>
                <button
                    className="button2"
                    onClick={() => {
                        props.quit();
                    }}
                >
                    Quitter
                </button>
            </div>
        </Fragment>
    );
}

export default Ecran;

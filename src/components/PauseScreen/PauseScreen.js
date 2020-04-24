import React, { Fragment, useState } from "react";
import "./PauseScreen.css";
import "../../css/App.css";
function Ecran(props) {
    const [choice, setChoice] = useState(0);
    const [music, setMusic] = useState(null);
    //volume de la musique
    const [volume, setVolume] = useState(20);
    //fonction qui permet de changer la musique joué pendant la partie
    const handleChange = (e) => {
        if (e.target) {
            if (music !== null) {
                if (music === e.target.value) {
                    setMusic("");
                } else {
                    setMusic(e.target.value);
                }
            } else {
                if (props.startAudio === e.target.value) {
                    setMusic("");
                } else {
                    setMusic(e.target.value);
                }
            }
        }
    };
    //fonction qui change le volume
    const changeVolume = (e) => {
        if (e.target) {
            setVolume(e.target.value);
        }
    };
    switch (choice) {
        case 0:
            return (
                <Fragment>
                    <div className="pauseScreen">
                        <h3>PAUSE</h3>
                        <button
                            className="button2"
                            onClick={() => {
                                props.changeMusic(music, volume);
                                props.pause();
                            }}
                        >
                            Reprendre
                        </button>
                        <button
                            className="button2"
                            onClick={() => {
                                setChoice(1);
                            }}
                        >
                            Option
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
        case 1:
            return (
                <Fragment>
                    <div className="pauseScreen">
                        <h3>PAUSE</h3>
                        <h4>MUSIQUE</h4>
                        <div className="musicSelector">
                            <label>
                                <input
                                    type="radio"
                                    value="original"
                                    onChange={handleChange}
                                    onClick={handleChange}
                                    checked={
                                        music !== null
                                            ? music === "original"
                                                ? true
                                                : false
                                            : props.startAudio === "original"
                                            ? true
                                            : false
                                    }
                                />
                                Original
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="moderne"
                                    onChange={handleChange}
                                    onClick={handleChange}
                                    checked={
                                        music !== null
                                            ? music === "moderne"
                                                ? true
                                                : false
                                            : props.startAudio === "moderne"
                                            ? true
                                            : false
                                    }
                                />
                                Moderne
                            </label>
                        </div>
                        <div className="volume">
                            <input
                                type="range"
                                name="volume"
                                min="0"
                                max="20"
                                value={volume}
                                onChange={changeVolume}
                            />
                            <label htmlFor="volume">Volume : {volume * 5}</label>
                        </div>

                        <button
                            className="button2"
                            onClick={() => {
                                setChoice(0);
                            }}
                        >
                            Retour
                        </button>
                    </div>
                </Fragment>
            );
        default:
    }
}

export default Ecran;

import React, { Fragment, useState } from "react";
import "../css/App.css";
import HighScore from "./HighScore";
function Ecran(props) {
    //entier qui désigne la page du menu
    //0 : menu 1: option 2: score
    const [choice, setChoice] = useState(0);
    //titre de la musique choisi par l'utilisateur
    const [music, setMusic] = useState("");
    //volume de la musique
    const [volume, setVolume] = useState(20);
    //fonction qui permet de changer la musique joué pendant la partie
    const handleChange = (e) => {
        if (e.target) {
            if (music === e.target.value) {
                setMusic("");
            } else {
                setMusic(e.target.value);
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
        //menu de base
        case 0:
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
                                props.play(volume, music);
                            }}
                        >
                            Jouer
                        </button>
                        <button
                            className="button1"
                            onClick={() => {
                                setChoice(1);
                            }}
                        >
                            Option
                        </button>
                        <button
                            className="button1"
                            onClick={() => {
                                setChoice(2);
                            }}
                        >
                            Best Score
                        </button>
                    </div>
                </Fragment>
            );
        //option (changement de la musique pour l'instant)
        case 1:
            return (
                <Fragment>
                    <div className="menu">
                        <h2 style={{ fontSize: 40 }}>OPTION</h2>
                        <h3 style={{ fontSize: 25 }}>MUSIQUE</h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                minWidth: 250,
                                marginBottom: 15,
                            }}
                        >
                            <label>
                                <input
                                    type="radio"
                                    value="original"
                                    onChange={handleChange}
                                    onClick={handleChange}
                                    checked={music === "original"}
                                />
                                Original
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="moderne"
                                    onChange={handleChange}
                                    onClick={handleChange}
                                    checked={music === "moderne"}
                                />
                                Moderne
                            </label>
                        </div>
                        <input
                            type="range"
                            name="volume"
                            min="0"
                            max="20"
                            value={volume}
                            onChange={changeVolume}
                            style={{ margin: 5, fontSize: 20 }}
                        />
                        <label htmlFor="volume">Volume : {volume * 5}</label>
                        <button
                            className="button1"
                            onClick={() => {
                                setChoice(0);
                            }}
                        >
                            RETOUR
                        </button>
                    </div>
                </Fragment>
            );
        //affichage des meilleurs score
        case 2:
            const highScore = JSON.parse(localStorage.getItem("score"));
            return (
                <Fragment>
                    <div className="menu center">
                        <h2 style={{ fontSize: 40 }}>HIGH SCORE</h2>
                        <HighScore score={highScore} indexBorder={-1}></HighScore>
                        <br></br>
                        <button
                            className="button1"
                            onClick={() => {
                                setChoice(0);
                            }}
                        >
                            RETOUR
                        </button>
                    </div>
                </Fragment>
            );
        default:
    }
}

export default Ecran;

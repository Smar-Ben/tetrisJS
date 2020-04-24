import React, { Fragment, useState } from "react";
import "../../css/App.css";
import "./Menu.css";
import useEvent from "../../hooks/useEvent";
import HighScore from "../HighScore/HighScore";
function Ecran(props) {
    //entier qui désigne la page du menu
    //0 : menu 1: option 2: score
    const [choice, setChoice] = useState(0);
    //titre de la musique choisi par l'utilisateur
    const [music, setMusic] = useState("");
    //volume de la musique
    const [volume, setVolume] = useState(20);

    //GAUCHE 37 DROITE 39 BAS 40 HAUT 38
    const [control, setControl] = useState(
        new Map([
            ["left", { name: "ArrowLeft", value: 37 }],
            ["right", { name: "ArrowRight", value: 39 }],
            ["down", { name: "ArrowDown", value: 40 }],
            ["rotate", { name: "ArrowUp", value: 38 }],
        ])
    );
    const [isChange, setChange] = useState("");
    const [oldName, setOldName] = useState("");
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

    const onSelectInput = (e) => {
        const inputName = e.target.name;
        let mapInter = new Map(control);
        const inputCode = mapInter.get(inputName);
        setOldName(inputCode.name);
        mapInter.set(inputName, { name: "", value: inputCode.value });
        setControl(mapInter);
        setChange(inputName);
    };

    const setNewInput = (e) => {
        if (isChange !== "") {
            let mapInter = new Map(control);
            mapInter.set(isChange, { name: e.key, value: e.keyCode });
            setControl(mapInter);
            setChange("");
            setOldName("");
        }
    };

    const resetValue = (e) => {
        if (isChange !== "") {
            let mapInter = new Map(control);
            const value = mapInter.get(isChange).value;
            mapInter.set(isChange, { name: oldName, value: value });
            setControl(mapInter);
            setChange("");
            setOldName("");
        }
    };
    const play = () => {
        const controlValue = [];
        control.forEach((el) => {
            controlValue.push(el.value);
        });
        props.play(volume, music, controlValue);
    };
    useEvent("keydown", setNewInput);
    useEvent("click", resetValue);
    switch (choice) {
        //menu de base
        case 0:
            return (
                <Fragment>
                    <div className="menu">
                        <h1>TETRIS</h1>
                        <small>by Rams</small>
                        <br></br>
                        <br></br>
                        <button className="button1" onClick={play}>
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
                        <h2>OPTION</h2>
                        <h3>MUSIQUE</h3>
                        <div className="musicSelector">
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
                        <div className="control">
                            <h3>COMMANDES</h3>
                            <div className="controlSelector">
                                <label htmlFor="left">Gauche</label>
                                <input
                                    name="left"
                                    type="text"
                                    value={control.get("left").name}
                                    onClick={onSelectInput}
                                    size={6}
                                    maxLength={1}
                                    readOnly
                                />
                                <label htmlFor="right">Droite</label>
                                <input
                                    name="right"
                                    type="text"
                                    value={control.get("right").name}
                                    onClick={onSelectInput}
                                    size={6}
                                    maxLength={1}
                                    readOnly
                                />
                            </div>
                            <div className="controlSelector">
                                <label htmlFor="down">Bas</label>
                                <input
                                    name="down"
                                    type="text"
                                    value={control.get("down").name}
                                    onClick={onSelectInput}
                                    size={6}
                                    maxLength={1}
                                    readOnly
                                />
                                <label htmlFor="rotate">Rotation</label>
                                <input
                                    name="rotate"
                                    value={control.get("rotate").name}
                                    onClick={onSelectInput}
                                    readOnly
                                    type="text"
                                    size={6}
                                    maxLength={1}
                                />
                            </div>
                        </div>
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
                        <h2>HIGH SCORE</h2>
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

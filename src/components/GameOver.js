import React, { Fragment, useState, useEffect } from "react";
import "../css/App.css";
import HighScore from "./HighScore";
//boolean qui permet d'éxecuter une fonction une seule fois
let didOnce = false;

function GameOver(props) {
    //nom du nouveau gagnant
    const [name, setName] = useState("");
    //index du prochain highscore dans le tableau des scores
    const [isOnHighscore, setOnHighscore] = useState(-1);
    //tableau des scores
    //les meilleurs scores sont stockés dans le local storage
    const [highScore, setHighScore] = useState(JSON.parse(localStorage.getItem("score")));
    //boolean devient lorsqu'on monte le composant
    useEffect(() => {
        didOnce = true;
        return () => {
            didOnce = false;
        };
    }, []);
    //on regarde si le joueur a battu le highscore
    const checkIsOnHighScore = () => {
        const { score } = props;
        let newIndex = -1;
        let highScoreCopy = JSON.parse(JSON.stringify(highScore));
        //on regarde si le joueur a battu l'un des meilleurs scores
        for (let i = 0; i < highScoreCopy.length; i++) {
            if (score >= highScoreCopy[i].score) {
                setOnHighscore(i);
                newIndex = i;
                break;
            }
        }
        //si le joueur a battu le record alors le joueur doit saisir son nom
        if (newIndex !== -1) {
            let inter = highScoreCopy[newIndex];
            //console.log(inter);
            for (let i = newIndex + 1; i < highScoreCopy.length; i++) {
                let oldHigscore = highScoreCopy[i];
                highScoreCopy[i] = inter;
                inter = oldHigscore;
            }
            highScoreCopy[newIndex] = { name: name, score: score };
            setHighScore(highScoreCopy);
        }
    };
    if (!didOnce) {
        didOnce = true;
        checkIsOnHighScore();
    }

    //permet de changer le nom
    const changeText = (e) => {
        if (isOnHighscore >= 0) {
            setName(e.target.value);
            let highScoreCopy = JSON.parse(JSON.stringify(highScore));
            highScoreCopy[isOnHighscore].name = e.target.value;
            setHighScore(highScoreCopy);
        }
    };
    //quitte l'écran des game over
    const handleQuit = () => {
        console.log(isOnHighscore);
        //si le joueur n'a pas battu le record alors on quitte l'écran de game over
        if (isOnHighscore === -1) {
            props.quit();
        } else if (name.length >= 2) {
            props.quit();
            localStorage.setItem("score", JSON.stringify(highScore));
        } //si le joueur n'a pas saisi un nom trop grand alors
        else {
            alert("veuillez saisir un nom");
        }
    };
    return (
        <Fragment>
            <div className="gameOverScreen">
                <h3 style={{ margin: 5 }}>GAME OVER</h3>
                <h4 style={{ margin: 5 }}> Score</h4>
                {isOnHighscore >= 0 && (
                    <p style={{ margin: 5, fontSize: 16, color: "red" }}>New Record</p>
                )}
                <HighScore
                    score={highScore}
                    indexBorder={isOnHighscore}
                    changeParent={changeText}
                ></HighScore>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        margin: 0,
                    }}
                >
                    <button className="button2" style={{ margin: 5 }} onClick={handleQuit}>
                        {" "}
                        Quitter
                    </button>
                </div>
            </div>
        </Fragment>
    );
}

export default GameOver;

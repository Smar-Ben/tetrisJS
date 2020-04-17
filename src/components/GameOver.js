import React, { Fragment, useState, useEffect } from "react";
import "../css/App.css";
import HighScore from "./HighScore";

function GameOver(props) {
    const [name, setName] = useState("");
    const [isOnHighscore, setOnHighscore] = useState(-1);
    const [highScore, setHighScore] = useState(JSON.parse(localStorage.getItem("score")));

    useEffect(() => {
        const { score } = props;
        let newIndex = -1;
        let highScoreCopy = JSON.parse(JSON.stringify(highScore));
        for (let i = 0; i < highScoreCopy.length; i++) {
            if (score >= highScoreCopy[i].score) {
                setOnHighscore(i);
                newIndex = i;
                console.log(highScoreCopy[i].name);
                break;
            }
        }
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
        //localStorage.setItem("score", JSON.stringify(highScore));
    }, []);

    const changeText = (e) => {
        if (isOnHighscore >= 0) {
            setName(e.target.value);
            let highScoreCopy = JSON.parse(JSON.stringify(highScore));
            highScoreCopy[isOnHighscore].name = e.target.value;
            setHighScore(highScoreCopy);
        }
    };
    const handleQuit = () => {
        if (name.length >= 2) {
            props.quit();
            localStorage.setItem("score", JSON.stringify(highScore));
        } else {
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
                {/* isOnHighscore >= 0 && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <p style={{ margin: 0, fontSize: 16, marginRight: 10 }}>Name: {"  "} </p>
                        <input type="text" size={4} value={name}></input>
                    </div>
                ) */}
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

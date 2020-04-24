import React, { Fragment, useRef, useEffect } from "react";
import "./HighScore.css";

function HighScore(props) {
    //référence qui est utilisé afin d'avoir le focus sur un input
    //utile lorsque l'utilisateur veut saisir son nom pour modifier le highscore
    const refInput = useRef(null);
    const handleChange = (e) => {
        props.changeParent(e);
    };
    useEffect(() => {
        if (refInput.current) {
            refInput.current.focus();
        }
    });
    //le composant reçoit un tableau en props qui correpond aux high score
    return (
        <Fragment>
            <div className="highScore">
                {props.score.map((el, index) => {
                    return (
                        <p key={index} style={{ margin: 5 }}>
                            {/**
                             * indexBorder indique l'index du tableau qui remplace le nom du joueur par un input
                             */}
                            {props.indexBorder === index ? (
                                <input
                                    className="redInput"
                                    type="text"
                                    size={10}
                                    maxLength={10}
                                    value={el.name}
                                    onChange={handleChange}
                                    ref={refInput}
                                ></input>
                            ) : (
                                el.name
                            )}{" "}
                            : {el.score}
                        </p>
                    );
                })}
            </div>
        </Fragment>
    );
}

export default HighScore;

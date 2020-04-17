import React, { Fragment, useRef, useEffect } from "react";
import "../css/App.css";

function HighScore(props) {
    const refInput = useRef(null);
    const handleChange = (e) => {
        props.changeParent(e);
    };
    //console.log(props);
    useEffect(() => {
        if (refInput.current) {
            refInput.current.focus();
        }
    });
    return (
        <Fragment>
            <div className="highScore">
                {props.score.map((el, index) => {
                    return (
                        <p key={index} style={{ margin: 5 }}>
                            {props.indexBorder === index ? (
                                <input
                                    type="text"
                                    size={10}
                                    maxLength={10}
                                    value={el.name}
                                    onChange={handleChange}
                                    style={{
                                        borderWidth: 2,
                                        borderStyle: "solid",
                                        borderColor: "red",
                                        textAlign: "center",
                                    }}
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

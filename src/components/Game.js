import React, { useEffect, useRef, Fragment, useState } from "react";
import "../css/App.css";
import playButton from "../asset/play-button.png";
import Board from "./Board";
import useInterval from "../hooks/useInteval";
import useEvent from "../hooks/useEvent";
export const CANVAS = { width: 800, height: 600 };
export const TETRIS = {
    GRID: { width: 250 + 20, height: 500 + 40, col: 10, row: 20 },
    COORD: { x: 265, y: 30 },
    SQUARE: 25
};

function Ecran() {
    const brickCanvas = useRef(null);
    let tabInter = new Array(TETRIS.GRID.row);
    for (let i = 0; i < TETRIS.GRID.row; i++) {
        tabInter[i] = new Array(TETRIS.GRID.col);
        for (let j = 0; j < TETRIS.GRID.col; j++) {
            tabInter[i][j] = 0;
        }
    }
    const [tab, setTab] = useState(tabInter);
    const [isFalling, setFalling] = useState(false);
    const [posX, setPos] = useState(4);
    const [isPlaying, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(false);
    const [count, setCount] = useState(0);
    const level = 1;

    useEffect(() => {
        updateCanvas();
    }, [tab]);
    const handler = event => {
        if (isFalling) {
            console.log(count);
            switch (event.keyCode) {
                //bouton gauche
                case 37:
                    move(-1);
                    break;
                //bouton haut
                case 38:
                    rotate();
                    break;
                //bouton de droite
                case 39:
                    move(1);
                    break;
                //bouton du bas
                case 40:
                    setSpeed(true);
                    break;
                default:
            }
        }
    };

    //fonction qui fait tourner un pièce, à défénir plus tard
    const rotate = () => {};

    const move = offsetX => {
        if (count + 1 <= 19 && offsetX + posX < 9 && offsetX + posX > 0) {
            const tetrisGrid = tab.slice();
            if (count >= 1 && count + 1 <= 19) {
                tetrisGrid[0 + count - 1][posX] = 0;
                tetrisGrid[1 + count - 1][posX + 1] = 0;
                tetrisGrid[1 + count - 1][posX] = 0;
                tetrisGrid[1 + count - 1][posX - 1] = 0;
            }
            tetrisGrid[0 + count - 1][posX + offsetX] = 1;
            tetrisGrid[1 + count - 1][posX + 1 + offsetX] = 1;
            tetrisGrid[1 + count - 1][posX + offsetX] = 1;
            tetrisGrid[1 + count - 1][posX - 1 + offsetX] = 1;
            setTab(tetrisGrid);
            setPos(posX + offsetX);
        }
    };

    /* useEffect(() => {
        console.log(count);
        window.addEventListener("keydown", handler);

        // clean up
        return () => window.removeEventListener("keydown", handler);
    }, []); */

    const stopSpeed = event => {
        if (event.keyCode == 40 && speed === true) {
            setSpeed(false);
        }
    };
    useEvent("keydown", handler);
    useEvent("keyup", stopSpeed);
    /* useEffect(() => {
        alert("ok");
    }, [count]); */
    const updateCanvas = () => {
        const ctx = brickCanvas.current.getContext("2d");
        //création des canvas

        if (ctx) {
            ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);

            //position  des cubes
            /* for (let i = 0; i < 10; i++) {
            
            ctx.fillRect(
                TETRIS.COORD.x + 1 + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                TETRIS.COORD.y + 1 + (19 - i) * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                TETRIS.SQUARE,
                TETRIS.SQUARE
            );
        } */
            const tetrisGrid = tab;
            for (let i = 0; i < TETRIS.GRID.row; i++) {
                for (let j = 0; j < TETRIS.GRID.col; j++) {
                    if (tetrisGrid[i][j] === 0) {
                    } else {
                        ctx.fillStyle = "red";
                        ctx.fillRect(
                            TETRIS.COORD.x +
                                1 +
                                j * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                            TETRIS.COORD.y +
                                1 +
                                i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                            TETRIS.SQUARE,
                            TETRIS.SQUARE
                        );
                    }
                }
            }
        }
    };

    const falling = () => {
        if (count + 1 <= 19) {
            const tetrisGrid = tab.slice();
            if (count >= 1 && count + 1 <= 19) {
                tetrisGrid[0 + count - 1][posX] = 0;
                tetrisGrid[1 + count - 1][posX + 1] = 0;
                tetrisGrid[1 + count - 1][posX] = 0;
                tetrisGrid[1 + count - 1][posX - 1] = 0;
            }
            tetrisGrid[0 + count][posX] = 1;
            tetrisGrid[1 + count][posX + 1] = 1;
            tetrisGrid[1 + count][posX] = 1;
            tetrisGrid[1 + count][posX - 1] = 1;
            setTab(tetrisGrid);
            setCount(count + 1);
            console.log(count);
        }
    };
    const play = () => {
        setPlaying(true);
        const tetrisGrid = tab.slice();
        for (let i = 0; i < 10; i++) {
            tetrisGrid[19][i] = 1;
        }
        setTab(tetrisGrid);
    };
    useInterval(
        () => {
            falling();
            setFalling(true);
        },
        isPlaying ? (speed ? 10 : 1000 / level) : null
    );

    return (
        <Fragment>
            <Board></Board>
            <canvas
                ref={brickCanvas}
                width={CANVAS.width}
                height={CANVAS.height}
                className="brick"
            />
            {!isPlaying && (
                <img
                    className="center"
                    src={playButton}
                    alt="fds"
                    onClick={() => {
                        play();
                    }}
                ></img>
            )}
        </Fragment>
    );
}

export default Ecran;

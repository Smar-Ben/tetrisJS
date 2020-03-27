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
export const piece = [
    [
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [1, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]
];

const emptyPiece = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
export const color = ["red", "cyan", "green", "yellow", "magenta", "orange", "pink"];

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
    const [posX, setPos] = useState(3);
    const [count, setCount] = useState(0);
    const [isPlaying, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(false);
    const [playing, setPiece] = useState(null);
    const level = 1;

    useEffect(() => {
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
                for (let i = 0; i < TETRIS.GRID.row; i++) {
                    for (let j = 0; j < TETRIS.GRID.col; j++) {
                        if (tab[i][j] === 0) {
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
        updateCanvas();
    }, [tab]);

    const handler = event => {
        if (isFalling) {
            let tetrisGrid;
            switch (event.keyCode) {
                //bouton gauche
                case 37:
                    tetrisGrid = place(count - 1, posX, tab.slice(), emptyPiece);
                    tetrisGrid = place(count - 1, posX - 1, tetrisGrid, playing);
                    if (tetrisGrid) {
                        setTab(tetrisGrid);
                        setPos(posX - 1);
                    }
                    break;
                //bouton haut
                case 38:
                    //rotate();
                    break;
                //bouton de droite
                case 39:
                    tetrisGrid = place(count - 1, posX, tab.slice(), emptyPiece);
                    tetrisGrid = place(count - 1, posX + 1, tetrisGrid, playing);
                    if (tetrisGrid) {
                        setTab(tetrisGrid);
                        setPos(posX + 1);
                    }
                    break;
                //bouton du bas
                case 40:
                    setSpeed(true);
                    break;
                default:
            }
        }
    };

    const stopSpeed = event => {
        if (event.keyCode === 40 && speed === true) {
            setSpeed(false);
        }
    };
    useEvent("keydown", handler);
    useEvent("keyup", stopSpeed);

    const place = (x, y, grid, piece) => {
        for (let i = x; i < x + 4; i++) {
            for (let j = y; j < y + 4; j++) {
                if (i >= 0 && i <= 19 && j >= 0 && j <= 9) {
                    grid[i][j] = piece[i - x][j - y];
                } else {
                    if (piece[i - x][j - y] === 1) {
                        return null;
                    }
                }
            }
        }
        return grid;
    };
    const falling = () => {
        if (count + 1 <= 19) {
            let tetrisGrid = tab.slice();
            if (count - 1 >= 0) {
                for (let i = 0; i < TETRIS.GRID.col; i++) {
                    tetrisGrid[count - 1][i] = 0;
                }
            }
            tetrisGrid = place(count, posX, tetrisGrid, playing);
            if (tetrisGrid) {
                setTab(tetrisGrid);
                setCount(count + 1);
            } else {
                setCount(100);
            }
        }
    };

    const play = () => {
        setPlaying(true);
        const num = Math.floor(Math.random() * 7);
        setPiece(piece[num].slice());
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

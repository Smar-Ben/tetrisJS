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
export const tokenModels = [
    [
        [
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ]
    ],
    [
        [
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 1, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [1, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            [0, 1, 1, 0],
            [1, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ]
];

const emptyToken = [
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
    const [grid, setGrid] = useState(tabInter);
    const [coord, setCoord] = useState({ x: 3, y: 0 });
    const [isPlaying, setPlaying] = useState(false);
    const [token, setToken] = useState({ num: -1, piece: null, rotate: -1 });
    //const [isFalling, setFalling] = useState(false);
    //const [speed, setSpeed] = useState(false);
    //const level = 1;

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
                        if (grid[i][j] === 0) {
                        } else {
                            ctx.fillStyle = color[grid[i][j] - 1];
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
    }, [grid]);

    const handler = event => {
        let tetrisGrid = JSON.parse(JSON.stringify(grid));
        const { x, y } = coord;
        switch (event.keyCode) {
            //bouton gauche
            case 37:
                tetrisGrid = place(x, y, tetrisGrid, emptyToken, 0);
                tetrisGrid = place(x - 1, y, tetrisGrid, token.piece, token.num);
                if (tetrisGrid) {
                    setGrid(tetrisGrid);
                    setCoord({ y: y, x: x - 1 });
                }
                break;
            //bouton haut
            case 38:
                rotation();
                break;
            //bouton de droite
            case 39:
                tetrisGrid = place(x, y, tetrisGrid, emptyToken, 0);
                tetrisGrid = place(x + 1, y, tetrisGrid, token.piece, token.num);
                if (tetrisGrid) {
                    setGrid(tetrisGrid);
                    setCoord({ y: y, x: x + 1 });
                }
                break;
            //bouton du bas
            case 40:
                //setSpeed(true);
                break;
            default:
        }
    };

    const rotation = () => {
        let { x, y } = coord;
        let { num, rotate } = token;
        let gridCopy = JSON.parse(JSON.stringify(grid));
        let newGrid = place(x, y, gridCopy, emptyToken, 0);
        if (tokenModels[num - 1].length === rotate + 1) {
            rotate = 0;
        } else {
            rotate += 1;
        }
        newGrid = place(
            x,
            y,
            newGrid,
            JSON.parse(JSON.stringify(tokenModels[num - 1][rotate])),
            token.num
        );
        const offSetx = TETRIS.GRID.col - (x + 3) < x ? -1 : 1;
        while (!newGrid) {
            x += offSetx;
            gridCopy = JSON.parse(JSON.stringify(grid));
            newGrid = place(x, y, gridCopy, emptyToken, 0);
            newGrid = place(
                x,
                y,
                newGrid,
                JSON.parse(JSON.stringify(tokenModels[num - 1][rotate])),
                token.num
            );
        }
        console.log(newGrid);
        setCoord({ x, y });
        setToken({ num: token.num, piece: tokenModels[num - 1][rotate], rotate: rotate });
        setGrid(newGrid);
    };

    /* const stopSpeed = event => {
        if (event.keyCode === 40 && speed === true) {
            setSpeed(false);
        }
    }; */
    useEvent("keydown", handler);
    //useEvent("keyup", stopSpeed);

    const place = (x, y, grid, token, num) => {
        console.log(x);
        for (let i = x; i < x + 4; i++) {
            for (let j = y; j < y + 4; j++) {
                if (i >= 0 && i <= 9 && j >= 0 && j <= 19) {
                    if (token[j - y][i - x] === 1) {
                        grid[j][i] = num;
                    } else {
                        grid[j][i] = 0;
                    }
                } else {
                    if (token[j - y][i - x] === 1) {
                        return null;
                    }
                }
            }
        }
        return grid;
    };

    const falling = () => {
        if (coord.y + 1 <= 19) {
            let tetrisGrid = grid.slice();
            if (coord.y - 1 >= 0) {
                for (let i = 0; i < TETRIS.GRID.col; i++) {
                    tetrisGrid[coord.y - 1][i] = 0;
                }
            }
            tetrisGrid = place(coord.x, coord.y, tetrisGrid, token.piece, token.num);
            if (tetrisGrid) {
                setGrid(tetrisGrid);
                setCoord({ y: coord.y + 1 });
            }
            setCoord({ y: 100 });
        }
    };

    const play = () => {
        setPlaying(true);
        const num = Math.floor(1 + Math.random() * 7);
        let tetrisGrid = JSON.parse(JSON.stringify(grid));
        tetrisGrid = place(coord.x, coord.y, tetrisGrid, tokenModels[num - 1][0], num);
        setGrid(tetrisGrid);
        setToken({
            num: num,
            piece: JSON.parse(JSON.stringify(tokenModels[num - 1][0])),
            rotate: 0
        });
    };
    /* useInterval(
        () => {
            falling();
            setFalling(true);
        },
        isPlaying ? (speed ? 10 : 1000 / level) : null
    ); */

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

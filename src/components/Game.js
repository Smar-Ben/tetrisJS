import React, { useEffect, useRef, Fragment, useState } from "react";
import "../css/App.css";
import playButton from "../asset/play-button.png";
import Board from "./Board";
import useInterval from "../hooks/useInteval";
import useEvent from "../hooks/useEvent";
import { CANVAS, TETRIS, tokenModels } from "../asset/variable";

export const color = ["red", "cyan", "green", "yellow", "magenta", "orange", "pink"];

function Ecran() {
    const brickCanvas = useRef(null);
    let tabInter = new Array(TETRIS.GRID.row);
    for (let i = 0; i < TETRIS.GRID.row; i++) {
        tabInter[i] = new Array(TETRIS.GRID.col);
        for (let j = 0; j < TETRIS.GRID.col; j++) {
            if ((j === 0 || j === 9) && (i <= 5 || i >= 15)) {
                tabInter[i][j] = 4;
            } else {
                tabInter[i][j] = 0;
            }
        }
    }
    const [grid, setGrid] = useState(tabInter);
    const [coord, setCoord] = useState({ x: 3, y: 0 });
    const [isPlaying, setPlaying] = useState(false);
    const [token, setToken] = useState({ num: -1, piece: null, rotate: -1 });
    const [nextPiece, setNextPiece] = useState(false);
    //const [isFalling, setFalling] = useState(false);
    const [speed, setSpeed] = useState(false);
    const [hasRotated, setRotation] = useState(false);
    const level = 1;

    useEffect(() => {
        const ctx = brickCanvas.current.getContext("2d");
        //création des canvas
        if (ctx) {
            ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
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
    }, [grid]);

    const handler = (event) => {
        switch (event.keyCode) {
            //bouton gauche
            case 37:
                setRotation(true);
                if (validMove(-1)) {
                    move(-1);
                }
                setRotation(false);
                break;
            //bouton haut
            case 38:
                rotation();
                break;
            //bouton de droite
            case 39:
                setRotation(true);
                if (validMove(1)) {
                    move(1);
                }
                setRotation(false);
                break;
            //bouton du bas
            case 40:
                setRotation(true);
                setSpeed(true);
                break;
            default:
        }
    };

    const validMove = (offsetX) => {
        for (let i = 0; i < token.piece.length; i++) {
            for (let j = 0; j < token.piece[i].length; j++) {
                if (token.piece[i][j] === 1) {
                    if (grid[coord.y + i - 1][coord.x + j + offsetX] !== 0) {
                        if (j + offsetX < 0 || j + offsetX >= token.piece[i].length) {
                            return false;
                        } else if (token.piece[i][j + offsetX] === 0) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    const move = (offsetX) => {
        const { x, y } = coord;
        let tetrisGrid = JSON.parse(JSON.stringify(grid));
        tetrisGrid = place(x, y - 1, tetrisGrid, token.piece, 0);
        tetrisGrid = place(x + offsetX, y - 1, tetrisGrid, token.piece, token.num);
        if (tetrisGrid) {
            setGrid(tetrisGrid);
            setCoord({ y: y, x: x + offsetX });
            setNextPiece(checkPiece(offsetX, -1));
        }
    };

    const rotation = () => {
        if (!hasRotated) {
            //let old_x = x;
            let { num, rotate } = token;
            if (tokenModels[num - 1].length === rotate + 1) {
                rotate = 0;
            } else {
                rotate += 1;
            }
            if (validRotation(tokenModels[num - 1][rotate])) {
                placeRotationPiece(rotate);
            } else {
                for (let i = 1; i <= 2; i++) {
                    if (validRotation(tokenModels[num - 1][rotate], i, 0)) {
                        placeRotationPiece(rotate, i, 0);
                        break;
                    } else if (validRotation(tokenModels[num - 1][rotate], -i, 0)) {
                        placeRotationPiece(rotate, -i, 0);
                        break;
                    }
                }
                for (let i = 1; i <= 2; i++) {
                    if (validRotation(tokenModels[num - 1][rotate], 0, -i)) {
                        placeRotationPiece(rotate, 0, -i);
                        break;
                    }
                }
            }
        }
        setRotation(true);
    };

    const placeRotationPiece = (rotate, offSetx = 0, offsetY = 0) => {
        let { x, y } = coord;
        const { num } = token;
        let gridCopy = JSON.parse(JSON.stringify(grid));
        let newGrid = place(x, y - 1, gridCopy, token.piece, 0);
        newGrid = place(
            x + offSetx,
            y - 1 + offsetY,
            newGrid,
            JSON.parse(JSON.stringify(tokenModels[num - 1][rotate])),
            token.num
        );
        setNextPiece(checkPieceRotation(tokenModels[num - 1][rotate], offSetx, offsetY));
        setCoord({ x: x + offSetx, y: y + offsetY });
        setToken({ num: token.num, piece: tokenModels[num - 1][rotate], rotate: rotate });
        setGrid(newGrid);
        setRotation(true);
    };

    const validRotation = (newPiece, offSetx = 0, offsetY = 0) => {
        for (let i = 0; i < newPiece.length; i++) {
            for (let j = 0; j < newPiece[i].length; j++) {
                if (newPiece[i][j] === 1) {
                    if (
                        coord.y + i - 1 + offsetY >= TETRIS.GRID.row ||
                        coord.y + i - 1 + offsetY < 0 ||
                        coord.x + j + offSetx >= TETRIS.GRID.col ||
                        coord.x + j + offSetx < 0
                    ) {
                        return false;
                    } else {
                        if (grid[coord.y + i - 1 + offsetY][coord.x + j + offSetx] !== 0) {
                            if (
                                i + offsetY >= token.piece.length ||
                                i + offsetY < 0 ||
                                j + offSetx >= token.piece[i].length ||
                                j + offSetx < 0
                            ) {
                                return false;
                            } else if (token.piece[i + offsetY][j + offSetx] === 0) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    };

    const checkPieceRotation = (newPiece, offSetx = 0, offsetY = 0) => {
        const { y, x } = coord;
        console.log("offsetx", offSetx);
        for (let i = 0; i < newPiece.length; i++) {
            for (let j = 0; j < newPiece[i].length; j++) {
                if (newPiece[i][j] === 1 && y + i <= 19) {
                    if (grid[y + i + offsetY][x + j + offSetx] !== 0) {
                        if (
                            i + offsetY + 1 >= token.piece.length ||
                            i + offsetY + 1 < 0 ||
                            j + offSetx >= token.piece[i].length ||
                            j + offSetx < 0
                        ) {
                            return true;
                        } else if (token.piece[i + offsetY + 1][j + offSetx] === 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    const handlerUp = (event) => {
        if (event.keyCode === 40 && speed === true) {
            setSpeed(false);
            setRotation(false);
        } else if (event.keyCode === 38 && hasRotated === true) {
            setRotation(false);
        }
    };
    useEvent("keydown", handler);
    useEvent("keyup", handlerUp);

    const place = (x, y, grid, piece, num) => {
        for (let j = y; j < y + piece.length; j++) {
            for (let i = x; i < x + piece[0].length; i++) {
                if (i >= 0 && i <= 9 && j >= 0 && j <= 19) {
                    if (piece[j - y][i - x] === 1) {
                        grid[j][i] = num;
                    }
                } else {
                    if (piece[j - y][i - x] === 1) {
                        return null;
                    }
                }
            }
        }
        return grid;
    };

    const checkPiece = (offSetx = 0, offsetY = 0) => {
        const { y, x } = coord;
        for (let i = 0; i < token.piece.length; i++) {
            for (let j = 0; j < token.piece[i].length; j++) {
                if (token.piece[i][j] === 1 && y + i + 1 + offsetY <= 19) {
                    if (grid[y + i + 1 + offsetY][x + j + offSetx] !== 0) {
                        if (i + 1 >= token.piece.length) {
                            return true;
                        } else {
                            if (j + offSetx >= token.piece[i].length || j + offSetx < 0) {
                                return true;
                            } else {
                                if (token.piece[i + 1][j + offSetx] === 0) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    };

    const falling = () => {
        if (!nextPiece) {
            //console.log(coord.x, coord.y, "fall", checkPiece());
            setRotation(true);
            let tetrisGrid = JSON.parse(JSON.stringify(grid));
            tetrisGrid = place(coord.x, coord.y - 1, tetrisGrid, token.piece, 0);
            tetrisGrid = place(coord.x, coord.y, tetrisGrid, token.piece, token.num);
            if (tetrisGrid) {
                setGrid(tetrisGrid);
                setCoord({ y: coord.y + 1, x: coord.x });
                setNextPiece(checkPiece());
            } else {
                setNextPiece(true);
            }
            setRotation(false);
        } else {
            newRandomPiece();
            setNextPiece(false);
        }
    };

    const newRandomPiece = () => {
        let { x, y } = coord;
        y = 0;
        //const num = Math.floor(1 + Math.random() * 7);
        const num = 2;
        x = Math.floor(TETRIS.GRID.col / 2 - tokenModels[num - 1][0].length / 2);
        let tetrisGrid = JSON.parse(JSON.stringify(grid));
        tetrisGrid = place(x, y, tetrisGrid, tokenModels[num - 1][0], num);
        setGrid(tetrisGrid);
        setToken({
            num: num,
            piece: JSON.parse(JSON.stringify(tokenModels[num - 1][0])),
            rotate: 0,
        });
        setCoord({ x: x, y: y + 1 });
    };

    const play = () => {
        setPlaying(true);
        newRandomPiece();
    };
    useInterval(
        () => {
            falling();
        },
        isPlaying ? (speed ? 25 : 1000 / level) : null
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

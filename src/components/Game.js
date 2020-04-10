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
        if (isPlaying) {
            switch (event.keyCode) {
                //bouton gauche
                case 37:
                    setRotation(true);

                    if (valid(token.piece, ereaseToken(), -1, 0)) {
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
                    if (valid(token.piece, ereaseToken(), 1, 0)) {
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
        }
    };

    const valid = (piece, gridCopy, offsetX = 0, offsetY = 0) => {
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    if (
                        coord.y + i - 1 + offsetY > 19 ||
                        coord.y + i - 1 + offsetY < 0 ||
                        coord.x + j + offsetX > 9 ||
                        coord.x + j + offsetX < 0
                    ) {
                        return false;
                    } else if (gridCopy[coord.y + i - 1 + offsetY][coord.x + j + offsetX] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const move = (offsetX) => {
        const { x, y } = coord;
        let tetrisGrid = ereaseToken();
        setNextPiece(newCheckPiece(token.piece, tetrisGrid, offsetX, -1));
        tetrisGrid = place(x + offsetX, y - 1, tetrisGrid, token.piece, token.num);
        setGrid(tetrisGrid);
        setCoord({ y: y, x: x + offsetX });
    };

    const rotation = () => {
        if (!hasRotated) {
            let { num, rotate } = token;
            if (tokenModels[num - 1].length === rotate + 1) {
                rotate = 0;
            } else {
                rotate += 1;
            }
            let tetrisGrid = ereaseToken();
            if (valid(tokenModels[num - 1][rotate], tetrisGrid)) {
                placeRotationPiece(rotate, tetrisGrid);
            } else {
                let alredayRotated = false;
                for (let i = 1; i <= 2; i++) {
                    if (valid(tokenModels[num - 1][rotate], tetrisGrid, i, 0)) {
                        placeRotationPiece(rotate, tetrisGrid, i, 0);
                        alredayRotated = true;
                        break;
                    } else if (valid(tokenModels[num - 1][rotate], tetrisGrid, -i, 0)) {
                        placeRotationPiece(rotate, tetrisGrid, -i, 0);
                        alredayRotated = true;
                        break;
                    }
                }
                if (!alredayRotated) {
                    for (let i = 1; i <= 2; i++) {
                        if (valid(tokenModels[num - 1][rotate], tetrisGrid, 0, -i)) {
                            placeRotationPiece(rotate, tetrisGrid, 0, -i);
                            break;
                        }
                    }
                }
            }
        }
    };

    const placeRotationPiece = (rotate, gridCopy, offSetx = 0, offsetY = 0) => {
        const { x, y } = coord;
        const { num } = token;
        setNextPiece(newCheckPiece(tokenModels[num - 1][rotate], gridCopy, offSetx, offsetY - 1));
        let newGrid = place(
            x + offSetx,
            y - 1 + offsetY,
            gridCopy,
            JSON.parse(JSON.stringify(tokenModels[num - 1][rotate])),
            token.num
        );

        setCoord({ x: x + offSetx, y: y + offsetY });
        setToken({ num: token.num, piece: tokenModels[num - 1][rotate], rotate: rotate });
        setGrid(newGrid);
    };

    const ereaseToken = () => {
        const { x, y } = coord;
        let tetrisGrid = JSON.parse(JSON.stringify(grid));
        tetrisGrid = place(x, y - 1, tetrisGrid, token.piece, 0);
        return tetrisGrid;
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
                }
            }
        }
        return grid;
    };

    const newCheckPiece = (piece, gridCopy, offSetx = 0, offsetY = 0) => {
        const { y, x } = coord;
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1 && y + i + 1 + offsetY <= 19) {
                    if (gridCopy[y + i + 1 + offsetY][x + j + offSetx] !== 0) {
                        return true;
                    }
                } else if (piece[i][j] === 1 && y + i + offsetY >= 19) {
                    return true;
                }
            }
        }
        return false;
    };

    const falling = () => {
        if (!nextPiece) {
            setRotation(true);
            let tetrisGrid = ereaseToken();
            setNextPiece(newCheckPiece(token.piece, tetrisGrid));
            tetrisGrid = place(coord.x, coord.y, tetrisGrid, token.piece, token.num);
            setGrid(tetrisGrid);
            setCoord({ y: coord.y + 1, x: coord.x });
            setRotation(false);
        } else {
            newRandomPiece();
            setNextPiece(false);
        }
    };

    const newRandomPiece = () => {
        let { x, y } = coord;
        y = 0;
        const num = Math.floor(1 + Math.random() * 7);
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

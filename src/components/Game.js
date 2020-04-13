import React, { useEffect, useRef, Fragment, useState } from "react";
import "../css/App.css";
import Menu from "./Menu";
import Board from "./Board";
import PauseScreen from "./PauseScreen";
import useInterval from "../hooks/useInteval";
import useEvent from "../hooks/useEvent";
import { CANVAS, TETRIS, tokenModels, color } from "../asset/variable";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Score from "./Score";
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
    const [nextPiece, setNextPiece] = useState(false);
    const [speed, setSpeed] = useState(false);
    const [hasRotated, setRotation] = useState(false);
    const [isPaused, setPaused] = useState(false);
    const [isGameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [nextToken, setNextoken] = useState(-1);
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

    const valid = (piece, gridCopy, offsetX = 0, offsetY = 0, x = coord.x, y = coord.y) => {
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    if (y + i - 1 + offsetY > 19 || x + j + offsetX > 9 || x + j + offsetX < 0) {
                        return false;
                    } else if (y + i - 1 + offsetY >= 0) {
                        if (gridCopy[y + i - 1 + offsetY][x + j + offsetX] !== 0) {
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
        let tetrisGrid = ereaseToken();
        setNextPiece(checkPiece(token.piece, tetrisGrid, offsetX, -1));
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
        setNextPiece(checkPiece(tokenModels[num - 1][rotate], gridCopy, offSetx, offsetY - 1));
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

    const checkPiece = (piece, gridCopy, offSetx = 0, offsetY = 0, x = coord.x, y = coord.y) => {
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
            setNextPiece(checkPiece(token.piece, tetrisGrid));
            tetrisGrid = place(coord.x, coord.y, tetrisGrid, token.piece, token.num);
            setGrid(tetrisGrid);
            setCoord({ y: coord.y + 1, x: coord.x });
            setRotation(false);
        } else {
            newRandomPiece();
        }
    };

    const newRandomPiece = () => {
        let { x, y } = coord;
        y = 0;
        setSpeed(false);
        let num;
        let nextNum = Math.floor(1 + Math.random() * 7);
        if (token.num === -1) {
            num = Math.floor(1 + Math.random() * 7);
        } else {
            num = nextToken;
        }
        x = Math.floor(TETRIS.GRID.col / 2 - tokenModels[num - 1][0].length / 2);
        let tetrisGrid = checkLigne();
        if (valid(tokenModels[num - 1][0], grid, 0, 1, x, y)) {
            placeNewPiece(x, y, num, tetrisGrid);
        } else {
            let gameOver = true;
            for (let i = 1; i < lengthPiece(tokenModels[num - 1][0]); i++) {
                y -= 1;
                if (valid(tokenModels[num - 1][0], grid, 0, 1, x, y)) {
                    placeNewPiece(x, y, num, tetrisGrid);
                    gameOver = false;
                    i = lengthPiece(tokenModels[num - 1][0]) + 1;
                }
            }
            if (gameOver) {
                setPlaying(false);
                setGrid(tabInter);
            }
        }
        setNextoken(nextNum);
    };

    const placeNewPiece = (x, y, num, tetrisGrid) => {
        setNextPiece(checkPiece(tokenModels[num - 1][0], grid, 0, 0, x, y));
        tetrisGrid = place(x, y, tetrisGrid, tokenModels[num - 1][0], num);
        setGrid(tetrisGrid);
        setToken({
            num: num,
            piece: JSON.parse(JSON.stringify(tokenModels[num - 1][0])),
            rotate: 0,
        });
        setCoord({ x: x, y: y + 1 });
    };

    const checkLigne = () => {
        const lineToDelete = [];
        let skipLine = false;
        for (let i = 0; i < TETRIS.GRID.row; i++) {
            skipLine = false;
            for (let j = 0; j < TETRIS.GRID.col; j++) {
                if (grid[i][j] === 0) {
                    skipLine = true;
                    j = TETRIS.GRID.col;
                }
            }
            if (!skipLine) {
                lineToDelete.push(i);
            }
        }
        setScore(score + 100 * lineToDelete.length);
        return destroyLine(lineToDelete);
    };

    const destroyLine = (lineToDelete) => {
        let newGrid = JSON.parse(JSON.stringify(grid));
        for (let i = 0; i < lineToDelete.length; i++) {
            for (let j = 0; j < TETRIS.GRID.col; j++) {
                newGrid[lineToDelete[i]][j] = 0;
            }
            newGrid = descent(newGrid, lineToDelete[i]);
        }
        return newGrid;
    };

    const descent = (gridCopy, start) => {
        let newGrid = JSON.parse(JSON.stringify(gridCopy));
        for (let i = 1; i <= start; i++) {
            for (let j = 0; j < TETRIS.GRID.col; j++) {
                gridCopy[i][j] = newGrid[i - 1][j];
            }
        }
        for (let j = 0; j < TETRIS.GRID.col; j++) {
            gridCopy[0][j] = 0;
        }
        return gridCopy;
    };

    const lengthPiece = (piece) => {
        let count = 0;
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    count++;
                    j = piece[i].length;
                }
            }
        }
        return count;
    };

    const play = () => {
        setPlaying(true);
        newRandomPiece();
    };

    const handlePause = () => {
        setPaused(!isPaused);
    };

    const quit = () => {
        setPlaying(false);
        setPaused(false);
        let tabZero = new Array(TETRIS.GRID.row);
        for (let i = 0; i < TETRIS.GRID.row; i++) {
            tabZero[i] = new Array(TETRIS.GRID.col);
            for (let j = 0; j < TETRIS.GRID.col; j++) {
                tabZero[i][j] = 0;
            }
        }
        setGrid(tabZero);
    };

    const restart = () => {
        let tabZero = new Array(TETRIS.GRID.row);
        for (let i = 0; i < TETRIS.GRID.row; i++) {
            tabZero[i] = new Array(TETRIS.GRID.col);
            for (let j = 0; j < TETRIS.GRID.col; j++) {
                tabZero[i][j] = 0;
            }
        }
        setGrid(tabZero);
        setToken({ num: -1, piece: null, rotate: -1 });
        setNextPiece(false);
        setSpeed(false);
        setRotation(false);
    };

    useInterval(
        () => {
            falling();
        },
        isPlaying ? (isPaused ? null : speed ? 25 : 1000 / level) : null
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
            {!isPlaying && <Menu play={play}></Menu>}
            {isPlaying && (
                <button className="pauseButton" onClick={handlePause}>
                    {isPaused ? (
                        <FontAwesomeIcon icon={faPlay} size="2x" style={{ color: "grey" }} />
                    ) : (
                        <FontAwesomeIcon icon={faPause} size="2x" style={{ color: "grey" }} />
                    )}
                </button>
            )}
            {isPaused && <PauseScreen pause={handlePause} restart={restart} quit={quit} />}
            {isPlaying && <Score score={score} piece={nextToken}></Score>}
        </Fragment>
    );
}

export default Ecran;

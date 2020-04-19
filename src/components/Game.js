import React, { useEffect, useRef, Fragment, useState } from "react";
import "../css/App.css";
import Menu from "./Menu";
import Board from "./Board";
import PauseScreen from "./PauseScreen";
import useInterval from "../hooks/useInteval";
import useEvent from "../hooks/useEvent";
import { CANVAS, TETRIS, tokenModels, color } from "../asset/variable";
import { faPause, faPlay, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Score from "./Score";
import GameOverScreen from "./GameOver";
import musicOriginal from "../asset/tetrisOriginal.mp3";
import music99 from "../asset/tetris99.mp3";

let music = null;
function Ecran() {
    const brickCanvas = useRef(null);
    let tabInter = new Array(TETRIS.GRID.row);
    for (let i = 0; i < TETRIS.GRID.row; i++) {
        tabInter[i] = new Array(TETRIS.GRID.col);
        for (let j = 0; j < TETRIS.GRID.col; j++) {
            tabInter[i][j] = 0;
        }
    }
    //grille de jeu
    const [grid, setGrid] = useState(tabInter);
    //coordonnées de la piece
    const [coord, setCoord] = useState({ x: 3, y: 0 });
    //boolean qui permet de savoir si le joueur joue
    const [isPlaying, setPlaying] = useState(false);
    //objet qui correspond à la pièce que le joueur utilise
    //num correspond à la couleur
    //piece est un tableau les positions de la pièces
    //rotate: numéro de la rotation
    const [token, setToken] = useState({ num: -1, piece: null, rotate: -1 });
    //boolean qui est vrai quand la prochaine pièce ne peut pas tomber
    const [nextPiece, setNextPiece] = useState(false);
    //boolean qui est vrai lorsque le joueur accelère la chute
    const [speed, setSpeed] = useState(false);
    //boolean qui est vrai quand une piéce est en train de subir une rotation
    const [hasRotated, setRotation] = useState(false);
    //boolean qui est vrai quand le jeu est pause
    const [isPaused, setPaused] = useState(false);
    //boolean qui est vrai quand le joueur a un game over
    const [isGameOver, setGameOver] = useState(false);
    //score du joueur
    const [score, setScore] = useState(0);
    //prochaine piece du jeu
    const [nextToken, setNextoken] = useState(-1);
    //niveau du jeu
    const [level, setLevel] = useState(1);
    //nom de la musique en cours
    const [audio, setAudio] = useState("");
    //volume de la musique
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        if (audio !== "") {
            if (audio === "moderne") {
                music = new Audio(music99);
            } else if (audio === "original") {
                music = new Audio(musicOriginal);
            }
            if (music) {
                music.play();
                music.loop = true;
            }
        } else {
            if (music) {
                music.pause();
            }
        }
        return () => {
            if (music) {
                music.pause();
                music = null;
            }
        };
    }, [audio]);

    useEffect(() => {
        if (music) {
            music.volume = (volume * 5) / 100;
        }
    }, [volume]);
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

    useEffect(() => {
        if (isGameOver) {
            if (music) {
                music.pause();
            }
        }
    }, [isGameOver]);

    useEffect(() => {
        //localStorage.clear();
        const score = JSON.parse(window.localStorage.getItem("score"));
        if (!score) {
            let baseScore = [];
            const name = ["GOD", "SMAR", "NEAS", "BEN", "NEB"];
            const score = [10000, 7500, 5000, 3000, 1500];
            for (let i = 0; i < 5; i++) {
                baseScore.push({ name: name[i], score: score[i] });
            }
            window.localStorage.setItem("score", JSON.stringify(baseScore));
        }
    }, []);

    const handler = (event) => {
        if (isPlaying && !isPaused && !isGameOver) {
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

    const handlerVisibility = (event) => {
        if (event.target.visibilityState === "hidden") {
            if (isPlaying) {
                handlePause();
            }
        }
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
    useEvent("visibilitychange", handlerVisibility);

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

    const newRandomPiece = (begin = false) => {
        let { x, y } = coord;
        y = 0;
        setSpeed(false);
        let num;
        let nextNum = Math.floor(1 + Math.random() * 7);
        if (token.num === -1 || begin) {
            num = Math.floor(1 + Math.random() * 7);
        } else {
            num = nextToken;
        }
        x = Math.floor(TETRIS.GRID.col / 2 - tokenModels[num - 1][0].length / 2);
        let tetrisGrid;
        if (begin) {
            let tabZero = new Array(TETRIS.GRID.row);
            for (let i = 0; i < TETRIS.GRID.row; i++) {
                tabZero[i] = new Array(TETRIS.GRID.col);
                for (let j = 0; j < TETRIS.GRID.col; j++) {
                    tabZero[i][j] = 0;
                }
            }
            tetrisGrid = JSON.parse(JSON.stringify(tabZero));
        } else {
            tetrisGrid = checkLigne();
        }
        if (begin) {
            placeNewPiece(x, y, num, tetrisGrid);
        } else if (valid(tokenModels[num - 1][0], grid, 0, 1, x, y)) {
            placeNewPiece(x, y, num, tetrisGrid);
        } else {
            let gameOver = true;
            // let length =
            //console.log(numberZero(tokenModels[num - 1][0]));
            const offsetY = numberZero(tokenModels[num - 1][0]);
            const rowPiece = lengthPiece(tokenModels[num - 1][0]);
            for (let i = 1; y + (rowPiece + offsetY - 1) > 0; i++) {
                y -= 1;
                if (valid(tokenModels[num - 1][0], grid, 0, 1, x, y)) {
                    placeNewPiece(x, y, num, tetrisGrid);
                    gameOver = false;
                    i = lengthPiece(tokenModels[num - 1][0]) + 1;
                }
            }
            if (gameOver) {
                setGameOver(true);
            }
        }
        setNextoken(nextNum);
    };

    const placeNewPiece = (x, y, num, tetrisGrid) => {
        setNextPiece(checkPiece(tokenModels[num - 1][0], tetrisGrid, 0, 0, x, y));
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
        if (lineToDelete.length > 0) {
            const newScore = score + 100 * lineToDelete.length;
            setScore(newScore);
            setLevel(Math.floor(newScore / 1000 + 1));
        }
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

    const numberZero = (piece) => {
        let count = 0;
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] === 1) {
                    return count;
                }
            }
            count++;
        }
        return count;
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

    const play = (volume, music) => {
        setVolume(volume);
        setAudio(music);
        setPlaying(true);
        newRandomPiece(true);
        setScore(0);
    };

    const handlePause = () => {
        setPaused(!isPaused);
        if (music) {
            if (!isPaused) {
                music.pause();
            } else {
                music.play();
            }
        }
    };

    const quit = () => {
        setPlaying(false);
        setPaused(false);
        setGameOver(false);
        let tabZero = new Array(TETRIS.GRID.row);
        for (let i = 0; i < TETRIS.GRID.row; i++) {
            tabZero[i] = new Array(TETRIS.GRID.col);
            for (let j = 0; j < TETRIS.GRID.col; j++) {
                tabZero[i][j] = 0;
            }
        }
        setGrid(tabZero);
        setAudio("");
        setVolume(100);
        if (music) {
            music.pause();
            music = null;
        }
    };

    const restart = () => {
        //setGrid(tabZero);
        //setToken({ num: -1, piece: null, rotate: -1 });
        setSpeed(false);
        setRotation(false);
        if (music) {
            music.currentTime = 0;
            music.play();
        }
        newRandomPiece(true);
        setScore(0);
        setPlaying(true);
    };

    const interval = () => {
        if (isPlaying) {
            if (isPaused || isGameOver) {
                return null;
            } else if (speed) {
                return 25;
            } else {
                return 1000 / level;
            }
        }
        return null;
    };
    useInterval(() => {
        falling();
    }, interval());
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
                    <FontAwesomeIcon
                        icon={isPaused ? faPlay : faPause}
                        size="2x"
                        style={{ color: "grey" }}
                    />
                </button>
            )}
            {isPlaying && (
                <button
                    className="musicButton"
                    onClick={() => {
                        if (music) {
                            if (music.paused) {
                                music.play();
                            } else {
                                music.pause();
                            }
                        }
                    }}
                >
                    <FontAwesomeIcon
                        icon={
                            audio !== ""
                                ? music !== null
                                    ? music.paused
                                        ? faVolumeUp
                                        : faVolumeMute
                                    : faVolumeMute
                                : faVolumeUp
                        }
                        size="2x"
                        style={{ color: "grey" }}
                    />
                </button>
            )}
            {isPaused && <PauseScreen pause={handlePause} restart={restart} quit={quit} />}
            {isPlaying && <Score score={score} piece={nextToken} level={level}></Score>}
            {isGameOver && <GameOverScreen score={score} quit={quit} />}
        </Fragment>
    );
}

export default Ecran;

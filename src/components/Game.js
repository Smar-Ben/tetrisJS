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

    //permet de lancer la musique ou de l'arrêter en fonction de la variable audio
    useEffect(() => {
        if (audio !== "") {
            if (audio === "moderne") {
                music = new Audio(music99);
            } else if (audio === "original") {
                music = new Audio(musicOriginal);
            }
            if (music) {
                music.load();
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

    //gére le volume du son
    useEffect(() => {
        if (music) {
            music.volume = (volume * 5) / 100;
        }
    }, [volume]);

    //modifie le canvas qui affiche la grille du tetris à
    useEffect(() => {
        const ctx = brickCanvas.current.getContext("2d");
        //création des canvas
        if (ctx) {
            //on efface l'ancienne grille de jeu
            ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
            //on regarde toute les cases des grilles
            for (let i = 0; i < TETRIS.GRID.row; i++) {
                for (let j = 0; j < TETRIS.GRID.col; j++) {
                    //on affiche les carrés de la grille
                    if (grid[i][j] !== 0) {
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

    //lorsque le joueur subit un game over, alors la music est en pause
    useEffect(() => {
        if (isGameOver) {
            if (music) {
                music.pause();
            }
        }
    }, [isGameOver]);

    //si le joueur fait sa première partie alors on initialise le high score dans le local storage
    useEffect(() => {
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

    //fonction qui est appelé à chaque entré de clavier
    const handler = (event) => {
        //si le joueur n'est pas en pause ou en game over alors il peut déplacer la pièce sur la grille de jeu
        if (isPlaying && !isPaused && !isGameOver) {
            switch (event.keyCode) {
                //bouton gauche
                //déplace une pièce à gauche si cela est possible
                case 37:
                    setRotation(true);
                    if (valid(token.piece, ereaseToken(), -1, 0)) {
                        move(-1);
                    }
                    setRotation(false);
                    break;
                //bouton haut
                //permet de faire tourner une pièce si c'est possibe
                case 38:
                    rotation();
                    break;
                //bouton de droite
                //déplace une pièce à droite si cela est possible
                case 39:
                    setRotation(true);
                    if (valid(token.piece, ereaseToken(), 1, 0)) {
                        move(1);
                    }
                    setRotation(false);
                    break;
                //bouton du bas
                //accélère la chute d'une pièce
                case 40:
                    setRotation(true);
                    setSpeed(true);
                    break;
                default:
            }
        }
    };

    //retourne un bolean vrai si une pièce est valide dans la grille de jeu
    const valid = (piece, gridCopy, offsetX = 0, offsetY = 0, x = coord.x, y = coord.y) => {
        //on regarde tout les case d'un pièce
        //si une case est rempli et qu'elle est touche une autre pièce dans la grille de jeu
        //alors on retourne faux
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

    //déplace une pièce en fonction d'un offsetX
    const move = (offsetX) => {
        //on déplace la pièce en fonction de offsetX
        const { x, y } = coord;
        let tetrisGrid = ereaseToken();
        setNextPiece(checkPiece(token.piece, tetrisGrid, offsetX, -1));
        tetrisGrid = place(x + offsetX, y - 1, tetrisGrid, token.piece, token.num);
        setGrid(tetrisGrid);
        setCoord({ y: y, x: x + offsetX });
    };

    //permet de faire tourner une pièce
    const rotation = () => {
        if (!hasRotated) {
            //on regarde la prochaine pièce
            let { num, rotate } = token;
            if (tokenModels[num - 1].length === rotate + 1) {
                rotate = 0;
            } else {
                rotate += 1;
            }
            //on efface la pièce actuelle
            let tetrisGrid = ereaseToken();
            //On regarde si il est possible de placer la pièce retourné
            if (valid(tokenModels[num - 1][rotate], tetrisGrid)) {
                placeRotationPiece(rotate, tetrisGrid);
            }
            //sinon on déplace la pièce puis on l'a fait tourner
            else {
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

    //permet de placer la pièce après qu'elle est subit
    const placeRotationPiece = (rotate, gridCopy, offSetx = 0, offsetY = 0) => {
        const { x, y } = coord;
        const { num } = token;
        //on place la pièce dans la grille de jeu
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

    //permet d'effacer la pièce qui tombe dans la grille
    const ereaseToken = () => {
        const { x, y } = coord;
        let tetrisGrid = JSON.parse(JSON.stringify(grid));
        tetrisGrid = place(x, y - 1, tetrisGrid, token.piece, 0);
        return tetrisGrid;
    };

    //fonction qui est appelé quand l'utlisateur change d'onglet sur le navigatuer
    const handlerVisibility = (event) => {
        //si on a pas la visibilité sur la page alors met sur pause
        if (event.target.visibilityState === "hidden") {
            if (isPlaying && !isPaused && !isGameOver) {
                handlePause();
            }
        }
    };

    //fonction qui est appelé quand on relache une touche
    const handlerUp = (event) => {
        //l'utilisateur relache la touche du bas,
        //alors on arrête l'accélèration de la pièce qui tombe
        if (event.keyCode === 40 && speed === true) {
            setSpeed(false);
            setRotation(false);
        }
        //fin de la rotation
        else if (event.keyCode === 38 && hasRotated === true) {
            setRotation(false);
        }
    };
    //différents événement sur les entrées clavier
    useEvent("keydown", handler);
    useEvent("keyup", handlerUp);
    //événement est appelé lorsque l'onglet n'est plus visible
    useEvent("visibilitychange", handlerVisibility);
    useEvent("blur", () => {
        if (isPlaying && !isPaused && !isGameOver) {
            handlePause();
        }
    });
    //permet de placer une piece dans la grille de jeu
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

    //regarde si la prochaine ligne est déjà rempli
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

    //fonction qui permet de simuler la chute de chaque pièce du jeu
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

    //ajoute une nouvelle pièce qui tombe
    const newRandomPiece = (begin = false) => {
        //coordonnées
        let { x, y } = coord;
        y = 0;
        setSpeed(false);
        //pièce qui va tomber
        let num;
        //prochaine pièce qui va tomber
        let nextNum = Math.floor(1 + Math.random() * 7);
        //on regarde la prochaine pièce
        //si elle n'existe pas alors on donne un numéro aléatoire
        if (token.num === -1 || begin) {
            num = Math.floor(1 + Math.random() * 7);
        } else {
            num = nextToken;
        }
        x = Math.floor(TETRIS.GRID.col / 2 - tokenModels[num - 1][0].length / 2);
        let tetrisGrid;
        //si begin est vrai alors on efface le tableau
        if (begin) {
            let tabZero = new Array(TETRIS.GRID.row);
            for (let i = 0; i < TETRIS.GRID.row; i++) {
                tabZero[i] = new Array(TETRIS.GRID.col);
                for (let j = 0; j < TETRIS.GRID.col; j++) {
                    tabZero[i][j] = 0;
                }
            }
            tetrisGrid = JSON.parse(JSON.stringify(tabZero));
        }
        //sinon on regarde si on peut supprimer une ligne
        else {
            tetrisGrid = checkLigne();
        }
        //on place la nouvelle
        if (begin) {
            placeNewPiece(x, y, num, tetrisGrid);
        } else if (valid(tokenModels[num - 1][0], grid, 0, 1, x, y)) {
            placeNewPiece(x, y, num, tetrisGrid);
        }
        //si on peut pas placer de nouvelle pièce alors on regarde si il y a un game over
        else {
            let gameOver = true;
            // let length =
            //console.log(numberZero(tokenModels[num - 1][0]));
            const offsetY = numberZero(tokenModels[num - 1][0]);
            const rowPiece = lengthPiece(tokenModels[num - 1][0]);
            //si
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

    //permet de placer une nouvelle piece
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

    //regarde si il faut supprimer des lignes sur la grille de jeu
    const checkLigne = () => {
        const lineToDelete = [];
        let skipLine = false;
        //on regarde la grille de jeu
        for (let i = 0; i < TETRIS.GRID.row; i++) {
            skipLine = false;
            for (let j = 0; j < TETRIS.GRID.col; j++) {
                if (grid[i][j] === 0) {
                    skipLine = true;
                    j = TETRIS.GRID.col;
                }
            }
            //on supprime une ligne
            if (!skipLine) {
                lineToDelete.push(i);
            }
        }
        //si une ligne est supprimer alors on modifie le score
        if (lineToDelete.length > 0) {
            const newScore = score + 100 * lineToDelete.length;
            setScore(newScore);
            setLevel(Math.floor(newScore / 1000 + 1));
        }
        //On retourne la grille de jeu avec les lignes supprimés
        return destroyLine(lineToDelete);
    };

    //fonction qui détruit une ligne de jeu
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

    //fonction qui fait tomber les blocs lors de la suppression d'une ligne
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

    //calcul le nombre de lignes de zéro d'un pièce
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
    //taille en longueur de la pièce qui va tomber
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

    //fonction qui lance le jeu
    const play = (volume, music) => {
        setVolume(volume);
        setAudio(music);
        setPlaying(true);
        newRandomPiece(true);
        setScore(0);
    };
    //fonction permettant de mettre le jeu en pause
    const handlePause = () => {
        setPaused(!isPaused);
        if (music && !isPaused) {
            if (!isPaused) {
                music.pause();
            } else {
                music.play();
            }
        }
    };
    //fonction permettant de changer la musique après une pause
    const changeMusicPause = (newAudio, newVolume) => {
        if (audio !== newAudio && newAudio !== null) {
            setAudio(newAudio);
            if (newVolume !== volume) {
                setVolume(newVolume);
            }
        }
    };
    //fonction permettant de quitter le jeu
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

    //permet de recommencer une partie
    const restart = () => {
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

    //fonction défénissant le délai de l'intervalle de chute des pièce
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

    /*  const modifyIconPause = () => {
        if (audio !== "" || music != null) {
            if (music.paused) {
                return faVolumeUp;
            }
            return faVolumeMute;
        } else {
            return faVolumeUp;
        }
    }; */
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
            {isPaused && (
                <PauseScreen
                    pause={handlePause}
                    changeMusic={changeMusicPause}
                    restart={restart}
                    quit={quit}
                    startAudio={audio}
                    startVolume={volume}
                />
            )}
            {isPlaying && <Score score={score} piece={nextToken} level={level}></Score>}
            {isGameOver && <GameOverScreen score={score} quit={quit} />}
        </Fragment>
    );
}

export default Ecran;

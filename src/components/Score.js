import React, { useEffect, useRef, Fragment } from "react";
import { CANVAS, TETRIS, tokenModels, color } from "../asset/variable";

import "../css/App.css";
//constante qui stocke la taille de la case de la prochaine pièce qui va tomber
const showNextToken = {
    width: (4 * TETRIS.GRID.width) / TETRIS.GRID.col,
    height: (4 * TETRIS.GRID.height) / TETRIS.GRID.row,
};
//constante des bordure
const border = { width: 10, height: 10 };
//constante qui stocke les coordonées de la case de la prochaine pièce
const coordNextPiece = {
    x: (TETRIS.COORD.x - showNextToken.width) / 2,
    y: 50,
};
//constante de la boite de score
const boxSize = { width: 175, height: 135 };
const boxCoord = {
    x: (TETRIS.COORD.x - boxSize.width - border.width) / 2,
    y: 370,
};

//fonction qui dessine la case de la prochaine pièce qui va tomber
function drawTable(canvasRef) {
    const row = 4;
    const col = 4;
    const ctx = canvasRef.current.getContext("2d");
    //création des canvas

    //création des bordure
    ctx.fillStyle = "crimson";
    ctx.fillRect(
        coordNextPiece.x - border.width,
        coordNextPiece.y - border.height,
        showNextToken.width + 2 * border.width + 2,
        showNextToken.height + 2 * border.height + 2
    );
    //création des carré noir
    ctx.fillStyle = "black";
    ctx.fillRect(coordNextPiece.x, coordNextPiece.y, showNextToken.width, showNextToken.height);
    //dessin des lignes verticales
    for (let i = 0; i <= row; i++) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(
            coordNextPiece.x - 1,
            coordNextPiece.y + i * Math.floor(TETRIS.GRID.height / TETRIS.GRID.row)
        );
        ctx.lineTo(
            coordNextPiece.x + showNextToken.width,
            coordNextPiece.y + i * Math.floor(TETRIS.GRID.height / TETRIS.GRID.row)
        );
        ctx.stroke();
    }
    //dessin des lignes horizontales
    for (let i = 0; i <= col; i++) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(
            coordNextPiece.x + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
            coordNextPiece.y
        );
        ctx.lineTo(
            coordNextPiece.x + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
            coordNextPiece.y + showNextToken.height
        );
        ctx.stroke();
    }
}

//fonction qui dessine la prochaine pièce
function drawPiece(canvasRef, num) {
    //création des canvas
    const ctx = canvasRef.current.getContext("2d");
    drawTable(canvasRef);
    const piece = tokenModels[num - 1][0];
    //on place les coordonnées de la prochaine pièce
    //les coordonnées correspondent à la moitié du carré
    const y = 4 / 2 - Math.floor(piece.length / 2);
    const x = 4 / 2 - Math.floor(piece[0].length / 2);
    //on dessine la prochaine pièce qui va tomber
    for (let i = y; i < y + piece.length; i++) {
        for (let j = x; j < x + piece[0].length; j++) {
            if (piece[i - y][j - x] === 1) {
                ctx.fillStyle = color[num - 1];
                ctx.fillRect(
                    coordNextPiece.x + 1 + j * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                    coordNextPiece.y + 1 + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                    TETRIS.SQUARE,
                    TETRIS.SQUARE
                );
            }
        }
    }
}

//fonction affiche un texte score
function drawScoreTxt(canvasRef) {
    //création des canvas
    const ctx = canvasRef.current.getContext("2d");
    //création des bordure
    ctx.fillStyle = "crimson";
    ctx.fillRect(
        boxCoord.x - border.width,
        boxCoord.y - border.height,
        boxSize.width + 2 * border.width + 2,
        boxSize.height + 2 * border.height + 2
    );
    //création d'un carré noir qui permet d'afficher le texte
    ctx.fillStyle = "black";
    ctx.fillRect(boxCoord.x, boxCoord.y, boxSize.width, boxSize.height);
    //affichage d'un texte SCORE en blanc
    ctx.font = "28px  -apple-system ";
    ctx.fillStyle = "white";
    const txt = "SCORE";
    const offsetTexty = 35;
    const sizeTxt = ctx.measureText(txt);
    const xText = boxCoord.x + (boxSize.width - sizeTxt.width) / 2;
    //création d'un trait qui sépare le texte du score et le score
    ctx.fillText(txt, xText, boxCoord.y + offsetTexty);
    ctx.fillStyle = "crimson";
    const size = 5;
    ctx.fillRect(boxCoord.x, boxCoord.y + offsetTexty + 15, boxSize.width, size);
}

//affiche le score de joueur et le niveau du joueur
function drawScore(canvasRef, score, level) {
    //création des canvas
    const ctx = canvasRef.current.getContext("2d");
    const scoreTxt = score.toString();
    //affichage du score du joueur
    ctx.font = "28px  -apple-system ";
    const offsetScoreY = 55;
    const sizeFont = 28;
    const sizeScore = ctx.measureText(scoreTxt);
    //on efface l'ancien score
    ctx.fillStyle = "black";
    ctx.fillRect(
        boxCoord.x,
        boxCoord.y + offsetScoreY,
        boxSize.width,
        boxSize.height - offsetScoreY
    );
    //on affiche le nouveau score
    ctx.fillStyle = "white";
    const scoreX = boxCoord.x + (boxSize.width - sizeScore.width) / 2;
    ctx.fillText(scoreTxt, scoreX, boxCoord.y + offsetScoreY + sizeFont);
    //trait qui sépare le score et le niveau du joueur
    ctx.fillStyle = "crimson";
    ctx.fillRect(boxCoord.x, boxCoord.y + offsetScoreY + sizeFont + 8, boxSize.width, 5);
    ctx.font = "20px  -apple-system ";
    ctx.fillStyle = "white";
    //affichage du niveau du joueur
    const levelTxt = "LEVEL " + level.toString();
    const levelSize = ctx.measureText(levelTxt);
    const levelX = boxCoord.x + (boxSize.width - levelSize.width) / 2;
    ctx.fillText(levelTxt, levelX, boxCoord.y + offsetScoreY + 2 * sizeFont + 8);
}
function Ecran(props) {
    //référecne sur les canvas qui affiche le score
    const canvasRef = useRef(null);
    //constructeur qui est appellé lors du montage du composant
    useEffect(() => {
        //on affiche les texte de score
        drawTable(canvasRef);
        drawScoreTxt(canvasRef);
    }, []);
    //fonction qui est appellé à chaque changement de nouvelle pièce
    useEffect(() => {
        //affiche la prochaine pièce qui va tomber
        drawPiece(canvasRef, props.piece);
    }, [props.piece]);
    //fonction qui est appelé à chaque changement de niveau et score
    useEffect(() => {
        //affiche le score et le niveau du joueur
        drawScore(canvasRef, props.score, props.level);
    }, [props.score, props.level]);
    return (
        <Fragment>
            <canvas ref={canvasRef} width={CANVAS.width} height={CANVAS.height} className="brick" />
        </Fragment>
    );
}

export default Ecran;

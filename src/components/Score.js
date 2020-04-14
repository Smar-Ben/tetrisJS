import React, { useEffect, useRef, Fragment } from "react";
import { CANVAS, TETRIS, tokenModels, color } from "../asset/variable";

import "../css/App.css";
const showNextToken = {
    width: (4 * TETRIS.GRID.width) / TETRIS.GRID.col,
    height: (4 * TETRIS.GRID.height) / TETRIS.GRID.row,
};
const border = { width: 10, height: 10 };
const coordNextPiece = {
    x: (TETRIS.COORD.x - showNextToken.width) / 2,
    y: 50,
};
const boxSize = { width: 175, height: 95 };
const boxCoord = {
    x: (TETRIS.COORD.x - boxSize.width - border.width) / 2,
    y: 420,
};
/* const scoreCoord = {
    x: 
} */
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
    ctx.fillStyle = "black";
    ctx.fillRect(coordNextPiece.x, coordNextPiece.y, showNextToken.width, showNextToken.height);
    //or
    //resetGrid(ctx)
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
/* function resetGrid(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(coordNextPiece.x, coordNextPiece.y, showNextToken.width, showNextToken.height);
} */
function drawPiece(canvasRef, num) {
    const ctx = canvasRef.current.getContext("2d");
    drawTable(canvasRef);
    //resetGrid(ctx)
    const piece = tokenModels[num - 1][0];
    const y = 2 - Math.floor(piece.length / 2);
    const x = 2 - Math.floor(piece[0].length / 2);
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

function drawScoreTxt(canvasRef) {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "crimson";
    ctx.fillRect(
        boxCoord.x - border.width,
        boxCoord.y - border.height,
        boxSize.width + 2 * border.width + 2,
        boxSize.height + 2 * border.height + 2
    );
    ctx.fillStyle = "black";
    ctx.fillRect(boxCoord.x, boxCoord.y, boxSize.width, boxSize.height);
    ctx.font = "28px  -apple-system ";
    ctx.fillStyle = "white";
    const txt = "SCORE";
    const offsetTexty = 35;
    const sizeTxt = ctx.measureText(txt);
    const xText = boxCoord.x + (boxSize.width - sizeTxt.width) / 2;
    ctx.fillText(txt, xText, boxCoord.y + offsetTexty);
    console.log(sizeTxt);
    ctx.fillStyle = "crimson";
    const size = 5;
    ctx.fillRect(boxCoord.x, boxCoord.y + offsetTexty + 15, boxSize.width, size);
}

function drawScore(canvasRef, score) {
    const ctx = canvasRef.current.getContext("2d");
    const scoreTxt = score.toString();
    ctx.font = "28px  -apple-system ";
    const offsetScoreY = 55;
    const sizeFont = 28;
    const sizeScore = ctx.measureText(scoreTxt);
    ctx.fillStyle = "black";
    ctx.fillRect(
        boxCoord.x,
        boxCoord.y + offsetScoreY,
        boxSize.width,
        boxSize.height - offsetScoreY
    );
    ctx.fillStyle = "white";
    const scoreX = boxCoord.x + (boxSize.width - sizeScore.width) / 2;
    ctx.fillText(scoreTxt, scoreX, boxCoord.y + offsetScoreY + sizeFont);
}
function Ecran(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        drawTable(canvasRef);
        drawScoreTxt(canvasRef);
        drawScore(canvasRef, props.score);
    }, []);
    useEffect(() => {
        drawPiece(canvasRef, props.piece);
    }, [props.piece]);
    useEffect(() => {
        drawScore(canvasRef, props.score);
    }, [props.score]);
    return (
        <Fragment>
            <canvas ref={canvasRef} width={CANVAS.width} height={CANVAS.height} className="brick" />
        </Fragment>
    );
}

export default Ecran;

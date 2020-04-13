import React, { useEffect, useRef, Fragment } from "react";
import { CANVAS, TETRIS, tokenModels, color } from "../asset/variable";

import "../css/App.css";
const showNextToken = {
    width: (4 * TETRIS.GRID.width) / TETRIS.GRID.col,
    height: (4 * TETRIS.GRID.height) / TETRIS.GRID.row,
};
const scoreCoord = {
    x: (TETRIS.COORD.x - showNextToken.width) / 2,
    y: 50,
};
function drawTable(canvasRef) {
    const row = 4;
    const col = 4;
    const ctx = canvasRef.current.getContext("2d");
    //création des canvas
    const border = { width: 10, height: 10 };

    //création des bordure
    ctx.fillStyle = "crimson";
    ctx.fillRect(
        scoreCoord.x - border.width,
        scoreCoord.y - border.height,
        showNextToken.width + 2 * border.width + 2,
        showNextToken.height + 2 * border.height + 2
    );
    resetGrid(ctx);
    /*     for (let i = 0; i <= row; i++) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(
            scoreCoord.x - 1,
            scoreCoord.y + i * Math.floor(TETRIS.GRID.height / TETRIS.GRID.row)
        );
        ctx.lineTo(
            scoreCoord.x + showNextToken.width,
            scoreCoord.y + i * Math.floor(TETRIS.GRID.height / TETRIS.GRID.row)
        );
        ctx.stroke();
    }
    for (let i = 0; i <= col; i++) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(
            scoreCoord.x + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
            scoreCoord.y
        );
        ctx.lineTo(
            scoreCoord.x + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
            scoreCoord.y + showNextToken.height
        );
        ctx.stroke();
    } */
}
function resetGrid(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(scoreCoord.x, scoreCoord.y, showNextToken.width, showNextToken.height);
}
function drawPiece(canvasRef, num) {
    const ctx = canvasRef.current.getContext("2d");
    resetGrid(ctx);
    const piece = tokenModels[num - 1][0];
    const y = 2 - Math.floor(piece.length / 2);
    const x = 2 - Math.floor(piece[0].length / 2);
    for (let i = y; i < y + piece.length; i++) {
        for (let j = x; j < x + piece[0].length; j++) {
            if (piece[i - y][j - x] === 1) {
                ctx.fillStyle = color[num - 1];
                ctx.fillRect(
                    scoreCoord.x + 1 + j * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                    scoreCoord.y + 1 + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
                    TETRIS.SQUARE,
                    TETRIS.SQUARE
                );
            }
        }
    }
}

function Ecran(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        drawTable(canvasRef);
    }, []);
    useEffect(() => {
        drawPiece(canvasRef, props.piece);
    }, [props.piece]);
    return (
        <Fragment>
            <canvas
                ref={canvasRef}
                width={CANVAS.width}
                height={CANVAS.height}
                style={{ zIndex: 20 }}
                className="brick"
            />
        </Fragment>
    );
}

export default Ecran;

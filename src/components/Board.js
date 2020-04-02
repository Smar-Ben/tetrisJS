import React, { useEffect, useRef, Fragment } from "react";
import { CANVAS, TETRIS } from "../asset/variable";

function drawTable(canvasRef) {
    const ctx = canvasRef.current.getContext("2d");
    //création des canvas
    ctx.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
    const border = { width: 10, height: 10 };
    //création des bordure
    ctx.fillStyle = "crimson";
    ctx.fillRect(
        TETRIS.COORD.x - border.width - 1,
        TETRIS.COORD.y - border.height - 1,
        TETRIS.GRID.width + 2 * border.width + 2,
        TETRIS.GRID.height + 2 * border.height + 2
    );
    //création des lignes de jeu
    ctx.fillStyle = "black";
    ctx.fillRect(TETRIS.COORD.x, TETRIS.COORD.y, TETRIS.GRID.width, TETRIS.GRID.height);
    for (let i = 0; i < TETRIS.GRID.row + 1; i++) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(
            TETRIS.COORD.x - 1,
            TETRIS.COORD.y + i * Math.floor(TETRIS.GRID.height / TETRIS.GRID.row)
        );
        ctx.lineTo(
            TETRIS.COORD.x + TETRIS.GRID.width + 1,
            TETRIS.COORD.y + i * Math.floor(TETRIS.GRID.height / TETRIS.GRID.row)
        );
        ctx.stroke();
    }
    for (let i = 0; i < TETRIS.GRID.row + 1; i++) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.moveTo(
            TETRIS.COORD.x + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
            TETRIS.COORD.y
        );
        ctx.lineTo(
            TETRIS.COORD.x + i * Math.floor(TETRIS.GRID.width / TETRIS.GRID.col),
            TETRIS.COORD.y + TETRIS.GRID.height
        );
        ctx.stroke();
    }
}
function Board() {
    const canvasRef = useRef(null);
    useEffect(() => {
        drawTable(canvasRef);
    }, [canvasRef]);
    return (
        <Fragment>
            <canvas ref={canvasRef} width={CANVAS.width} height={CANVAS.height} />
        </Fragment>
    );
}

export default Board;

import * as path from "path";
import { displayGridObjConfig } from "../helpers/displayGrid";
import { readInputRaw } from "../helpers/readInput";

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .split("")
        .filter(l => l !== "\n")
        .map(Number);

    const width = 25;
    const height = 6;

    console.time("part1");

    const board: number[][][] = [];

    for (let i = 0; i < input.length / (width * height); i++) {
        const newLayer = [];
        for (let j = 0; j < height; j++) {
            const row = [];
            for (let l = 0; l < width; l++) {
                row.push(input[i * width * height + j * width + l]);
            }
            newLayer.push(row);
        }
        board.push(newLayer);
    }

    const zeroCounts = board.map(l => l.flat().filter(l => l === 0).length);
    const matchingLayer = board[zeroCounts.indexOf(Math.min(...zeroCounts))];
    const total =
        matchingLayer.flat().filter(l => l === 1).length *
        matchingLayer.flat().filter(l => l === 2).length;

    console.log("Part 1:", total);

    console.timeEnd("part1");

    console.time("part2");

    const newBoard: number[][] = Array(height)
        .fill(42)
        .map(() => Array(width).fill(2));

    for (let i = 0; i < board.length; i++) {
        const boardRows = board[i].length;
        for (let j = 0; j < boardRows; j++) {
            for (let k = 0; k < board[i][j].length; k++) {
                if (newBoard[j][k] === 2) {
                    newBoard[j][k] = board[i][j][k];
                }
            }
        }
    }

    console.log(
        "Part 2:\n" + displayGridObjConfig(newBoard, { 1: "#", 0: " " })
    );

    console.timeEnd("part2");
};

main();

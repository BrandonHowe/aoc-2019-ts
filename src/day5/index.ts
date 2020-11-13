import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const parseIntcode = (raw: number[], input: number) => {
    const program = [...raw];
    let currentPointer = 0;
    let output = 0;
    while (true) {
        const opcodeStr = program[currentPointer].toString().padStart(5, "0");
        const val = Number(opcodeStr.slice(-2));
        const firstMode = !!+opcodeStr.charAt(2);
        const secondMode = !!+opcodeStr.charAt(1);
        const thirdMode = !!+opcodeStr.charAt(0);
        const firstParam = firstMode
            ? program[currentPointer + 1]
            : program[program[currentPointer + 1]];
        const secondParam = secondMode
            ? program[currentPointer + 2]
            : program[program[currentPointer + 2]];
        const thirdParam = thirdMode
            ? program[currentPointer + 3]
            : program[program[currentPointer + 3]];
        if (val === 1) {
            program[program[currentPointer + 3]] = firstParam + secondParam;
            currentPointer += 4;
        } else if (val === 2) {
            program[program[currentPointer + 3]] = firstParam * secondParam;
            currentPointer += 4;
        } else if (val === 3) {
            program[program[currentPointer + 1]] = input;
            currentPointer += 2;
        } else if (val === 4) {
            output = firstParam;
            console.log(`Outputting ${output}`);
            currentPointer += 2;
        } else if (val === 5) {
            currentPointer =
                firstParam !== 0 ? secondParam : currentPointer + 3;
        } else if (val === 6) {
            currentPointer =
                firstParam === 0 ? secondParam : currentPointer + 3;
        } else if (val === 7) {
            program[program[currentPointer + 3]] = +(firstParam < secondParam);
            currentPointer += 4;
        } else if (val === 8) {
            program[program[currentPointer + 3]] = +(
                firstParam === secondParam
            );
            currentPointer += 4;
        } else if (val === 99) {
            return program;
        } else if (!val) {
            return program;
        }
    }
};

const main = async () => {
    const program = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .split(",")
        .map(Number);

    console.time("part1");

    parseIntcode(program, 1);

    console.log("Part 1: Check the output");

    console.timeEnd("part1");

    console.time("part2");

    parseIntcode(program, 5);

    console.log("Part 2: Check the output");

    console.timeEnd("part2");
};

main();

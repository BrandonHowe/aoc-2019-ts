import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const parseIntcode = (raw: number[]) => {
    const program = [...raw];
    let currentPointer = 0;
    while (true) {
        const val = program[currentPointer];
        if (val === 1) {
            program[program[currentPointer + 3]] =
                program[program[currentPointer + 1]] +
                program[program[currentPointer + 2]];
        } else if (val === 2) {
            program[program[currentPointer + 3]] =
                program[program[currentPointer + 1]] *
                program[program[currentPointer + 2]];
        } else if (val === 99) {
            return program;
        }
        currentPointer += 4;
    }
};

const findValue = (raw: number[], target: number) => {
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            const copiedRaw = [...raw];
            copiedRaw[1] = i;
            copiedRaw[2] = j;
            if (parseIntcode(copiedRaw)[0] === target) {
                return 100 * i + j;
            }
        }
    }
};

const main = async () => {
    const input = await readInputRaw(path.join(__dirname, "./input.txt"));

    const program = input.split(",").map(Number);

    console.time("part1");

    const result = parseIntcode(program);

    console.log("Part 1:", result[0]);

    console.timeEnd("part1");

    console.time("part2");

    console.log("Part 2:", findValue(program, 19690720));

    console.timeEnd("part2");
};

main();

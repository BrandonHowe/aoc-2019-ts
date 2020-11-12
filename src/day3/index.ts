import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const location = (loc: [number, number]) =>
    (loc[0] + loc[1]) * (loc[0] + loc[1] + 1) * 0.5 + loc[1];

const reverseCantorPair = (z: number) => {
    const pair = [];
    const t = Math.floor((-1 + Math.sqrt(1 + 8 * z)) / 2);
    const x = (t * (t + 3)) / 2 - z;
    const y = z - (t * (t + 1)) / 2;
    pair[0] = x;
    pair[1] = y;
    return pair;
};

interface Vector {
    x: number;
    y: number;
    step: number;
}

const executeInstruction = (
    state: Record<number, number>,
    step: Record<number, number>,
    head: Vector,
    action: string
) => {
    const movementLength = Number(action.slice(1));
    for (let i = 0; i < movementLength; i++) {
        head.step++;
        switch (action.charAt(0)) {
            case "R":
                head.x++;
                state[location([head.x, head.y])] =
                    (state[location([head.x, head.y])] || 0) + 1;
                step[location([head.x, head.y])] =
                    (step[location([head.x, head.y])] || 0) + head.step;
                break;
            case "L":
                head.x--;
                state[location([head.x, head.y])] =
                    (state[location([head.x, head.y])] || 0) + 1;
                step[location([head.x, head.y])] =
                    (step[location([head.x, head.y])] || 0) + head.step;
                break;
            case "U":
                head.y++;
                state[location([head.x, head.y])] =
                    (state[location([head.x, head.y])] || 0) + 1;
                step[location([head.x, head.y])] =
                    (step[location([head.x, head.y])] || 0) + head.step;
                break;
            case "D":
                head.y--;
                state[location([head.x, head.y])] =
                    (state[location([head.x, head.y])] || 0) + 1;
                step[location([head.x, head.y])] =
                    (step[location([head.x, head.y])] || 0) + head.step;
                break;
        }
    }
};

const main = async () => {
    const input = (
        await readInputSplit(path.join(__dirname, "./input.txt"))
    ).map(l => l.split(","));

    console.time("part1");

    let state: Record<number, number> = {};
    const steps: Record<number, number> = {};

    const head: Vector = { x: 5000, y: 5000, step: 0 };

    input[0].map(l => executeInstruction(state, steps, head, l));

    head.x = 5000;
    head.y = 5000;
    head.step = 0;

    state = Object.fromEntries(
        Object.entries(state).map(l => [l[0], l[1] >= 1 ? 1 : 0])
    );

    input[1].map(l => executeInstruction(state, steps, head, l));

    const intersectionKeys = Object.keys(
        Object.fromEntries(Object.entries(state).filter(l => l[1] >= 2))
    );

    const intersections = intersectionKeys
        .map(l => reverseCantorPair(Number(l)))
        .map(l => [l[0] - 5000, l[1] - 5000]);

    console.log(
        "Part 1:",
        Math.min(...intersections.map(l => Math.abs(l[0]) + Math.abs(l[1])))
    );

    console.timeEnd("part1");

    console.time("part2");

    console.log(
        "Part 2:",
        Math.min(...intersectionKeys.map(l => steps[Number(l)]))
    );

    console.timeEnd("part2");
};

main();

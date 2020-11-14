import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

function* parseIntcode(raw: number[]) {
    const program = [...raw];
    let currentPointer = 0;
    let currOutput = 0;
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
            program[program[currentPointer + 1]] = yield;
            currentPointer += 2;
        } else if (val === 4) {
            currOutput = firstParam;
            yield firstParam;
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
            return currOutput;
        } else if (!val) {
            return currOutput;
        }
    }
}

const tryPhaseSetting = async (input: number[], setting: number[]) => {
    const ampA = parseIntcode([...input]);
    ampA.next();
    ampA.next(setting[0]);
    const resA = ampA.next(0).value!;
    const ampB = parseIntcode([...input]);
    ampB.next();
    ampB.next(setting[1]);
    const resB = ampB.next(resA).value!;
    const ampC = parseIntcode([...input]);
    ampC.next();
    ampC.next(setting[2]);
    const resC = ampC.next(resB).value!;
    const ampD = parseIntcode([...input]);
    ampD.next();
    ampD.next(setting[3]);
    const resD = ampD.next(resC).value!;
    const ampE = parseIntcode([...input]);
    ampE.next();
    ampE.next(setting[4]);
    const resE = ampE.next(resD).value!;

    return resE;
};

const perms = <T>(xs: T[]): T[][] => {
    if (!xs.length) return [[]];
    return xs.flatMap((x: T) => {
        // get permutations of xs without x, then prepend x to each
        return perms(xs.filter((v: T) => v !== x)).map((vs: T[]) => [x, ...vs]);
    });
};

const tryPhaseSettingFeedback = (input: number[], setting: number[]) => {
    const outputs = [];
    let recentRes = 0;
    const ampA = parseIntcode([...input]);
    const ampB = parseIntcode([...input]);
    const ampC = parseIntcode([...input]);
    const ampD = parseIntcode([...input]);
    const ampE = parseIntcode([...input]);

    ampA.next();
    ampA.next(setting[0]);
    recentRes = ampA.next(0).value!;
    ampB.next();
    ampB.next(setting[1]);
    recentRes = ampB.next(recentRes).value!;
    ampC.next();
    ampC.next(setting[2]);
    recentRes = ampC.next(recentRes).value!;
    ampD.next();
    ampD.next(setting[3]);
    recentRes = ampD.next(recentRes).value!;
    ampE.next();
    ampE.next(setting[4]);
    const { value, done } = ampE.next(recentRes);
    if (done) {
        return value!;
    } else {
        recentRes = value!;
    }

    while (true) {
        ampA.next();
        recentRes = ampA.next(recentRes).value!;
        ampB.next();
        recentRes = ampB.next(recentRes).value!;
        ampC.next();
        recentRes = ampC.next(recentRes).value!;
        ampD.next();
        recentRes = ampD.next(recentRes).value!;
        ampE.next();
        const { value, done } = ampE.next(recentRes);
        if (done) {
            return outputs.filter(l => !!l)[
                outputs.filter(l => !!l).length - 1
            ];
        } else {
            outputs.push(value!);
            recentRes = value!;
        }
    }
};

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .split(",")
        .map(Number);

    console.time("part1");

    const permutations = perms([0, 1, 2, 3, 4]);

    const results = await Promise.all(
        permutations.map(l => tryPhaseSetting(input, l))
    );

    console.log("Part 1:", Math.max(...results));

    console.timeEnd("part1");

    console.time("part2");

    const permutations2 = perms([5, 6, 7, 8, 9]);

    const results2 = await Promise.all(
        permutations2.map(l => tryPhaseSettingFeedback(input, l))
    );
    console.log("Part 2:", Math.max(...results2));

    console.timeEnd("part2");
};

main();

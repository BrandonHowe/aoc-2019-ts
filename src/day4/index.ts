import * as path from "path";
import { readInputRaw, readInputSplitNum } from "../helpers/readInput";

const passwordMatches = (pass: number) => {
    const strPass = pass.toString();
    if (strPass.length !== 6) return;
    let doubleFound = false;
    for (let i = 0; i < strPass.length - 1; i++) {
        if (Number(strPass.charAt(i)) > Number(strPass.charAt(i + 1))) {
            return false;
        }
        if (Number(strPass.charAt(i)) === Number(strPass.charAt(i + 1))) {
            doubleFound = true;
        }
    }
    return doubleFound;
};

const passwordMatchesP2 = (pass: number) => {
    const strPass = pass.toString();
    if (strPass.length !== 6) return;
    let doubleFound = false;
    for (let i = 0; i < strPass.length - 1; i++) {
        if (Number(strPass.charAt(i)) > Number(strPass.charAt(i + 1))) {
            return false;
        }
        if (
            Number(strPass.charAt(i - 1)) !== Number(strPass.charAt(i)) &&
            Number(strPass.charAt(i)) === Number(strPass.charAt(i + 1)) &&
            Number(strPass.charAt(i + 2)) !== Number(strPass.charAt(i))
        ) {
            doubleFound = true;
        }
    }
    return doubleFound;
};

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .split("-")
        .map(Number);

    console.time("part1");

    const pwArr = Array(input[1] - input[0] + 1)
        .fill(null)
        .map((_, idx) => idx + input[0]);

    console.log("Part 1:", pwArr.filter(passwordMatches).length);

    console.timeEnd("part1");

    console.time("part2");

    console.log("Part 2:", pwArr.filter(passwordMatchesP2).length);

    console.timeEnd("part2");
};

main();

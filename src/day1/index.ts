import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const fuelNeeded = (val: number) => {
    return Math.floor(val / 3) - 2;
};

const fuelNeededRec = (val: number) => {
    let total = fuelNeeded(val);
    let newVal = fuelNeeded(total);
    while (newVal > 0) {
        total += newVal;
        newVal = fuelNeeded(newVal);
    }
    return total;
};

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));

    console.time("part 1");

    const result = input.reduce((acc, cur) => acc + fuelNeeded(cur), 0);

    console.log("Part 1:", result);

    console.timeEnd("part 1");

    console.time("part 2");

    const resultPart2 = input.reduce((acc, cur) => acc + fuelNeededRec(cur), 0);

    console.log("Part 2:", resultPart2);

    console.timeEnd("part 2");
};

main();

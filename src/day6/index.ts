import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const findOrbitCount = (
    orbits: Record<string, string>,
    planet: string
): string[] => {
    return planet in orbits
        ? [...findOrbitCount(orbits, orbits[planet]), planet]
        : ["COM"];
};

const main = async () => {
    const input: Record<string, string> = (
        await readInputSplit(path.join(__dirname, "./input.txt"))
    )
        .map(l => l.split(")"))
        .reduce(
            (acc, cur) => ({ ...acc, [cur[1]]: cur[0] }),
            {} as Record<string, string>
        );

    console.time("part1");

    const paths = Object.keys(input).reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: findOrbitCount(input, cur).slice(0, -1)
        }),
        {} as Record<string, string[]>
    );

    console.log(
        "Part 1:",
        Object.values(paths).reduce((acc, cur) => acc + cur.length, 0)
    );

    console.timeEnd("part1");

    console.time("part2");

    const youPath = paths.YOU;
    const sanPath = paths.SAN;

    const intersection = youPath.filter(l => sanPath.includes(l));

    console.log(
        "Part 2:",
        youPath.length -
            intersection.length +
            sanPath.length -
            intersection.length
    );

    console.timeEnd("part2");
};

main();

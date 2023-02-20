/* istanbul ignore file */

import { randomBytes } from "crypto";
import { appendFileSync, writeFileSync } from "fs";

import { onlyAlphanumericRegex } from "./constants";

let bytes = 3 * 1024 * 1000; // 3MB
const min = 8;
const max = 30;
let randomNum;
let randomAlphanumericString;

let totalCharacters = 0;
let words = 0;

/** Helper file to create a < 3MB of random words to be imported in Trie. */
export const buildDataFile = () => {
  while (bytes > 0) {
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    randomAlphanumericString = randomBytes(randomNum)
      .toString("base64")
      .replace(onlyAlphanumericRegex, "");

    if (randomAlphanumericString.length <= 1) continue;

    bytes -= randomNum;
    totalCharacters += randomAlphanumericString.length;
    words++;

    appendFileSync(
      "./test-data/alphanumeric.txt",
      randomAlphanumericString + (bytes > 0 && "\r\n")
    );
  }
  writeFileSync(
    "./test-data/alphanumeric-stats.json",
    JSON.stringify({ totalCharacters, words }, undefined, 2)
  );
  console.log("Total characters: ", totalCharacters);
  console.log("Total words: ", words);
  console.log("Text file was created successfully!");
};

// buildDataFile();

import { readFileSync } from "fs";

import { AlphaNumericTrie } from "../src/alphanumeric-trie";

// Max number of seconds for insertion of 134742 words consisting of 1945066 characters
// calculated by running the test 100 times and taking the max value
// not reliable but it's a good starting point for development
const maxSeconds = 2;

// Retry test 3 times to avoid false positives of low latency
jest.retryTimes(3);

describe("MemoryTesting", () => {
  const contents = readFileSync("./test-data/alphanumeric.txt", "utf-8");
  const testData = contents.split(/\r\n/);

  const convertMsToSeconds = (num: number) =>
    parseFloat((num / 1000).toFixed(3));

  const { totalCharacters, words } = JSON.parse(
    readFileSync("./test-data/alphanumeric-stats.json", "utf-8")
  );

  it(`should not exceed base memory footprint when inserting ${words} words consisting of ${totalCharacters} characters`, () => {
    const trie = new AlphaNumericTrie();
    const start = performance.now();

    testData.forEach((data, index) => {
      trie.add(data, index);
    });
    const end = performance.now();

    expect(trie.totalAddedChars).toEqual(totalCharacters);
    expect(trie.totalAddedWords).toEqual(words);

    expect(convertMsToSeconds(end - start)).toBeLessThanOrEqual(maxSeconds);
  });
});

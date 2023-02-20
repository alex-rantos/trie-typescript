import { readFileSync } from "fs";
import { setFlagsFromString } from "v8";
import { runInNewContext } from "vm";

import { AlphaNumericTrie } from "../src/alphanumeric-trie";

// Flags to enable garbage collection
setFlagsFromString("--expose_gc");
const gc = runInNewContext("gc");

// Max memory usage in MB for heapTotal and heapUsed
// calculated by running the test 100 times and taking the max value
// not reliable but it's a good starting point for development
const memoryHeapTotal = 576;
const memoryHeapUsed = 579;

// Retry test 3 times to avoid false positives of memory spikes
jest.retryTimes(3);

describe("MemoryTesting", () => {
  const contents = readFileSync("./test-data/alphanumeric.txt", "utf-8");
  const testData = contents.split(/\r\n/);

  const convertNumberToMB = (num: number) =>
    parseFloat((((num / 1024 / 1024) * 100) / 100.0).toFixed(2));

  const getMemoryUsage = () => {
    gc();
    const memoryData = process.memoryUsage();

    return {
      heapTotal: convertNumberToMB(memoryData.heapTotal),
      heapUsed: convertNumberToMB(memoryData.heapUsed),
    };
  };

  const { totalCharacters, words } = JSON.parse(
    readFileSync("./test-data/alphanumeric-stats.json", "utf-8")
  );

  it(`should not exceed base memory footprint when inserting ${words} words consisting of ${totalCharacters} characters`, () => {
    const baseUsage = getMemoryUsage();
    const trie = new AlphaNumericTrie();
    testData.forEach((data, index) => {
      trie.add(data, index);
    });
    const afterUsage = getMemoryUsage();

    expect(trie.totalAddedChars).toEqual(totalCharacters);
    expect(trie.totalAddedWords).toEqual(words);

    // Check if memory usage is within the expected range
    expect(afterUsage.heapTotal - baseUsage.heapTotal).toBeLessThanOrEqual(
      memoryHeapTotal
    );
    expect(afterUsage.heapUsed - baseUsage.heapUsed).toBeLessThanOrEqual(
      memoryHeapUsed
    );
  });
});

import { readFileSync } from "fs";

import { AlphaNumericTrie } from "../src/alphanumeric-trie";
import { onlyAlphanumericRegex } from "../utils/constants";

describe("AlphaNumericTrie", () => {
  const trie = new AlphaNumericTrie();
  const { totalCharacters, words } = JSON.parse(
    readFileSync("./test-data/alphanumeric-stats.json", "utf-8")
  );
  const contents = readFileSync("./test-data/alphanumeric.txt", "utf-8");
  const testData = contents.split(/\r\n/);

  it("should add and get a value", () => {
    testData.forEach((key, index) => {
      const value = { age: index, name: "Alex", surname: "Rantos" };
      trie.add(key, value);
      expect(trie.get(key)).toEqual(value);
      expect(trie.has(key)).toEqual(true);
    });

    expect(trie.totalAddedChars).toEqual(totalCharacters);
    expect(trie.totalAddedWords).toEqual(words);
  });
  it("should return null if there is no ExactMatch", () => {
    expect(trie.get(testData[50].slice(0, -1))).toEqual(null);
    expect(trie.has(testData[50].slice(0, -1))).toEqual(false);
  });
  it("should return null when no match", () => {
    expect(trie.get("")).toEqual(null);
    expect(trie.has("")).toEqual(false);
  });
  it("should remove unsupported character from key when added", () => {
    const invalidString = "alex$___123aaaaaaaaaaa__231dawdadawfafga_";
    trie.add(invalidString, 5);
    expect(trie.has(invalidString)).toEqual(false);
    expect(trie.get(invalidString)).toEqual(null);
    expect(trie.has(invalidString.replace(onlyAlphanumericRegex, ""))).toEqual(
      true
    );
    expect(trie.get(invalidString.replace(onlyAlphanumericRegex, ""))).toEqual(
      5
    );
  });
  it("should lowercase keys when added", () => {
    const uppercaseKey = "ALLCAPS";
    trie.add(uppercaseKey, 5);
    expect(trie.has(uppercaseKey)).toEqual(false);
    expect(trie.get(uppercaseKey)).toEqual(null);
    expect(trie.has(uppercaseKey.toLowerCase())).toEqual(true);
    expect(trie.get(uppercaseKey.toLowerCase())).toEqual(5);
  });
});

describe("Trie Verbose Option Flag", () => {
  const trieVerbose = new AlphaNumericTrie({ verbose: true });
  const trieNonVerbose = new AlphaNumericTrie({ verbose: false });
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementationOnce(() => {});
  });
  afterEach(() => {
    warn.mockClear();
  });

  it("should warn user when unsupported character was added when verbose flag is activated", () => {
    const invalidString = "alex$";
    trieVerbose.add(invalidString, 5);
    expect(warn).toBeCalledWith(
      `Invalid character [$] of key string [${invalidString}]`
    );
  });
  it("should warn user when overwriting duplicate key value was added when verbose flag is activated", () => {
    const trieVerbose = new AlphaNumericTrie({ verbose: true });
    const key = "alex";
    trieVerbose.add(key, 5);
    expect(trieVerbose.get(key)).toEqual(5);
    expect(warn).toBeCalledTimes(0);
    trieVerbose.add(key, 10);
    expect(trieVerbose.get(key)).toEqual(10);
    expect(warn).toBeCalledWith(
      `Key [${key}] already exists in the trie. Overwriting value.`
    );
  });

  it("should NOT warn user when unsupported character was added when verbose flag is deactivated", () => {
    const invalidString = "alex$";
    trieNonVerbose.add(invalidString, 5);
    expect(warn).not.toBeCalledWith(
      `Invalid character [$] of key string [${invalidString}]`
    );
  });
  it("should NOT warn user when overwriting duplicate key value was added when verbose flag is deactivated", () => {
    const trieNonVerbose = new AlphaNumericTrie({ verbose: false });
    const key = "alex";
    trieNonVerbose.add(key, 5);
    expect(trieNonVerbose.get(key)).toEqual(5);
    expect(warn).toBeCalledTimes(0);
    trieNonVerbose.add(key, 10);
    expect(trieNonVerbose.get(key)).toEqual(10);
    expect(warn).not.toBeCalledWith(
      `Key [${key}] already exists in the trie. Overwriting value.`
    );
  });
});

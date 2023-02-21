"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlphaNumericTrie = void 0;
const TRIE_NODE_CELLS = 36;
/**
 * A simple Trie data structure for optimized for lowercased alphanumeric strings.
 * Optimization was done based on the following assumption:
 * 1. Lookup keys consists of alphabetic english characters & digits.
 *    - Each Node in the trie is an array of 36 cells for optimal lookup.
 *    - 26 first cells are for lowercased alphabetical characters and the rest 10 for numeric.
 */
class AlphaNumericTrie {
    constructor({ verbose, cellPerNode } = {}) {
        this._totalAddedChars = 0;
        this._totalAddedWords = 0;
        /**
         * Add a value to the trie based on the key.
         * @param value value to add
         */
        this.add = (key, value) => {
            let node = this._root;
            for (let i = 0; i < key.length; i++) {
                const char = key[i].toLocaleLowerCase();
                const index = this.getIndexForChar(char, key);
                // If the character is not supported, skip it
                if (index === -1)
                    continue;
                this._totalAddedChars++;
                if (!node.children[index]) {
                    node.children[index] = this.createTrieNode();
                }
                node = node.children[index];
            }
            if (node.isExactMatch) {
                this._verbose &&
                    console.warn(`Key [${key}] already exists in the trie. Overwriting value.`);
                this._totalAddedWords--;
            }
            this._totalAddedWords++;
            node.isExactMatch = true;
            node.value = value;
        };
        /**
         * Add a value to the trie based on the key.
         * @param value value to add
         */
        this.get = (key) => {
            let node = this._root;
            for (let i = 0; i < key.length; i++) {
                const char = key[i];
                const index = this.getIndexForChar(char, key);
                if (!node.children[index]) {
                    return null;
                }
                node = node.children[index];
            }
            if (node.isExactMatch) {
                return node.value;
            }
            return null;
        };
        /**
         * Check if the trie contains a value for the key.
         * @param key key to check
         * @returns true if the trie contains a value for the key, false otherwise
         */
        this.has = (key) => this.get(key) !== null;
        /** Create a trie node */
        this.createTrieNode = (val) => ({
            children: Array(this._cellPerNode),
            isExactMatch: false,
            value: val !== null && val !== void 0 ? val : null,
        });
        this._root = this.createTrieNode();
        this._cellPerNode = cellPerNode !== null && cellPerNode !== void 0 ? cellPerNode : TRIE_NODE_CELLS;
        this._verbose = verbose !== null && verbose !== void 0 ? verbose : false;
    }
    /** Get the total number of characters inserted in the trie */
    get totalAddedChars() {
        return this._totalAddedChars;
    }
    /** Get the total number of words inserted in the trie */
    get totalAddedWords() {
        return this._totalAddedWords;
    }
    /**
     * Get the index of the char in the trie node array
     * First 26 cells are for alphabetical characters a-z
     * Next 10 cells are for numerical characters 0-9
     * @param char character to get the index for
     * @param key key string for logging purposes
     * @returns the index of the char in the trie node array or -1 if the char is unsupported
     */
    getIndexForChar(char, key) {
        const charCode = char.charCodeAt(0) - "a".charCodeAt(0);
        if (charCode >= 0 && charCode <= 25) {
            return charCode;
        }
        else {
            const charCodeNum = char.charCodeAt(0) - "0".charCodeAt(0);
            if (charCodeNum >= 0 && charCodeNum <= 9) {
                return charCodeNum + 26;
            }
            else {
                this._verbose &&
                    console.warn(`Invalid character [${char}] of key string [${key}]`);
                return -1;
            }
        }
    }
}
exports.AlphaNumericTrie = AlphaNumericTrie;

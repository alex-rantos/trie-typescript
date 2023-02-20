/** Interface for the options object */
interface ITrieOptions {
    /** Flag to indicate if the trie should be expose warnings */
    verbose?: boolean;
    cellPerNode?: number;
}
/**
 * A simple Trie data structure for optimized for lowercased alphanumeric strings.
 * Optimization was done based on the following assumption:
 * 1. Lookup keys consists of alphabetic english characters & digits.
 *    - Each Node in the trie is an array of 36 cells for optimal lookup.
 *    - 26 first cells are for lowercased alphabetical characters and the rest 10 for numeric.
 */
export declare class AlphaNumericTrie<T> {
    private _cellPerNode;
    private _root;
    private _verbose;
    private _totalAddedChars;
    private _totalAddedWords;
    constructor({ verbose, cellPerNode }?: ITrieOptions);
    /**
     * Add a value to the trie based on the key.
     * @param value value to add
     */
    add: (key: string, value: T) => void;
    /**
     * Add a value to the trie based on the key.
     * @param value value to add
     */
    get: (key: string) => T | null;
    /**
     * Check if the trie contains a value for the key.
     * @param key key to check
     * @returns true if the trie contains a value for the key, false otherwise
     */
    has: (key: string) => boolean;
    /** Get the total number of characters inserted in the trie */
    get totalAddedChars(): number;
    /** Get the total number of words inserted in the trie */
    get totalAddedWords(): number;
    /** Create a trie node */
    private createTrieNode;
    /**
     * Get the index of the char in the trie node array
     * First 26 cells are for alphabetical characters a-z
     * Next 10 cells are for numerical characters 0-9
     * @param char character to get the index for
     * @param key key string for logging purposes
     * @returns the index of the char in the trie node array or -1 if the char is unsupported
     */
    private getIndexForChar;
}
export {};

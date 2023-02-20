/** Interface for the trie node */
interface IAlphaNumericTrieNode<T> {
  /** Array of children nodes */
  children: Array<IAlphaNumericTrieNode<T>>;
  /** Flag to indicate if the node is an exact match */
  isExactMatch: boolean;
  /** Value of the node */
  value: T | null;
}

/** Interface for the options object */
interface ITrieOptions {
  /** Flag to indicate if the trie should be expose warnings */
  verbose?: boolean;
  cellPerNode?: number;
}

const TRIE_NODE_CELLS = 36;

/**
 * A simple Trie data structure for optimized for lowercased alphanumeric strings.
 * Optimization was done based on the following assumption:
 * 1. Lookup keys consists of alphabetic english characters & digits.
 *    - Each Node in the trie is an array of 36 cells for optimal lookup.
 *    - 26 first cells are for lowercased alphabetical characters and the rest 10 for numeric.
 */
export class AlphaNumericTrie<T> {
  private _cellPerNode: number;
  private _root: IAlphaNumericTrieNode<T>;
  private _verbose: boolean;
  private _totalAddedChars = 0;
  private _totalAddedWords = 0;

  constructor({ verbose, cellPerNode }: ITrieOptions = {}) {
    this._root = this.createTrieNode();
    this._cellPerNode = cellPerNode ?? TRIE_NODE_CELLS;
    this._verbose = verbose ?? false;
  }

  /**
   * Add a value to the trie based on the key.
   * @param value value to add
   */
  public add = (key: string, value: T) => {
    let node = this._root;
    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      const index = this.getIndexForChar(char, key);

      // If the character is not supported, skip it
      if (index === -1) continue;
      this._totalAddedChars++;
      if (!node.children[index]) {
        node.children[index] = this.createTrieNode();
      }
      node = node.children[index];
    }

    if (node.isExactMatch) {
      this._verbose &&
        console.warn(
          `Key [${key}] already exists in the trie. Overwriting value.`
        );
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
  public get = (key: string): T | null => {
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
  public has = (key: string): boolean => this.get(key) !== null;

  /** Get the total number of characters inserted in the trie */
  public get totalAddedChars() {
    return this._totalAddedChars;
  }
  /** Get the total number of words inserted in the trie */
  public get totalAddedWords() {
    return this._totalAddedWords;
  }

  /** Create a trie node */
  private createTrieNode = (val?: T): IAlphaNumericTrieNode<T> => ({
    children: Array(this._cellPerNode),
    isExactMatch: false,
    value: val ?? null,
  });

  /**
   * Get the index of the char in the trie node array
   * First 26 cells are for alphabetical characters a-z
   * Next 10 cells are for numerical characters 0-9
   * @param char character to get the index for
   * @param key key string for logging purposes
   * @returns the index of the char in the trie node array or -1 if the char is unsupported
   */
  private getIndexForChar(char: string, key: string) {
    const charCode = char.charCodeAt(0) - "a".charCodeAt(0);
    if (charCode >= 0 && charCode <= 25) {
      return charCode;
    } else {
      const charCodeNum = char.charCodeAt(0) - "0".charCodeAt(0);
      if (charCodeNum >= 0 && charCodeNum <= 9) {
        return charCodeNum + 26;
      } else {
        this._verbose &&
          console.warn(`Invalid character [${char}] of key string [${key}]`);
        return -1;
      }
    }
  }
}

## AlphaNumericTrie

A simple Trie data structure for optimized for lowercased latin alphanumeric strings.
Optimization was done based on the following assumption:

1. Lookup keys consists of alphabetical characters.

- Each Node in the trie holds an array of 36 cells for optimal lookup.
  - 26 first cells are for lowercased alphabetical characters and the rest 10 for numeric.

2. If a non supported character is inserted (e.g. `≈`, `\` etc.), it is skipped.

### Use

Install via npm:

```bash
npm i trie-typescript
```

or via yarn:

```bash
yarn add trie-typescript
```

JS usage example:

```js
import { AlphaNumericTrie } from "trie-typescript";

const alphaNumericTrie = new AlphaNumericTrie();
alphaNumericTrie.add("foo123", { myVal: "bar" });
alphaNumericTrie.has("foo123"); // true
alphaNumericTrie.get("foo123"); // {myVal: "bar"}

alphaNumericTrie.add("Foo!!!", { myVal: "!!!bar" });
alphaNumericTrie.has("Foo!!!"); // false
alphaNumericTrie.get("foo"); // {myVal: "!!!bar"}
```

> Feel free to reach out for feedback.

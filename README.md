# README

A simple Trie data structure for optimized for lowercased alphanumeric strings.
Optimization was done based on the following assumption:

1. Lookup keys consists of alphabetical characters.

- Each Node in the trie is an array of 36 cells for optimal lookup.
- 26 first cells are for lowercased alphabetical characters and the rest 10 for numeric.

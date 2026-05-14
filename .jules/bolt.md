## 2024-05-18 - [DataTable sorting memoization]
**Learning:** `DataTable.tsx` recalculates its sorting and clones its main `data` array on every single render cycle, regardless of if the data has changed. In heavily used components like this table, this causes a major O(N log N) performance penalty.
**Action:** When creating components that receive an array and perform complex operations (like `sort`, `filter` or `reduce`), always wrap that derived state inside a `useMemo` block using the input data array and relevant control states as its dependency list.

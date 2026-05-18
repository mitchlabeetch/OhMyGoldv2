## 2026-05-18 - Zustand useAuth hook performance fix
**Learning:** Returning the entire store context using destructuring `const { x, y } = useAuthStore()` inside a hook re-evaluates the entire component whenever ANY property in the `useAuthStore` changes, causing unneeded re-renders.
**Action:** Always use specific state selectors `useAuthStore(s => s.x)` individually, especially when dealing with often-used hooks like `useAuth`.

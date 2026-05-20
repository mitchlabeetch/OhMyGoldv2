## 2024-05-20 - Zustand Store Selector Optimization
**Learning:** Returning the entire Zustand store from a hook (e.g., `const { user, profile } = useAuthStore()`) causes unnecessary React re-renders in all consuming components whenever any state in the store changes, even if the consumed values haven't changed.
**Action:** Always use specific state selectors when consuming Zustand stores: `const user = useAuthStore((s) => s.user)`.

// Existing hooks
export * from "./useAuth";
export * from "./useAuditLog";
export * from "./useNotifications";
// usePermissions is already re-exported from useAuth; import from usePermissions.ts directly when needed
export { usePermissions } from "./usePermissions";
export * from "./useSession";

// Phase 4 API hooks
export * from "./useLocations";
export * from "./useMembers";
export * from "./usePlans";
export * from "./useSubscriptions";
export * from "./useClasses";
export * from "./useBookings";
export * from "./usePayments";
export * from "./usePOS";
export * from "./useCRM";
export * from "./useAnalytics";
export * from "./useStaff";
export * from "./useAccess";

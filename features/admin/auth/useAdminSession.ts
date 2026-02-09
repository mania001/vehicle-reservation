export function useAdminSession() {
  return {
    admin: {
      id: 'temp-admin-id',
      role: 'reservation_manager', // or vehicle_manager
    },
    isAuthenticated: true,
  }
}

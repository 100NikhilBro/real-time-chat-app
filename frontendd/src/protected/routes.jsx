import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("zapchat_token")

  return isAuthenticated ? children : <Navigate to="/login"  />
}

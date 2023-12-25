import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PublicRoute = ({ component }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

  return isAuthenticated ? <Navigate to="/admin" replace /> : component
}

export default PublicRoute

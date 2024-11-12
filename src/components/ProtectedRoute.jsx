import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, checkSession } = useUser();
  const location = useLocation();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 
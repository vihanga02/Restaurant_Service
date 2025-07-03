import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check login status and role from backend
        const res = await axios.get(
          requiredRole === 'Admin'
            ? 'http://localhost:8000/api/admin/check-login'
            : 'http://localhost:8000/api/customers/navbar',
          { withCredentials: true }
        );
        if (res.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [requiredRole]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    return <Navigate to={requiredRole === 'Admin' ? '/admin/login' : '/login'} replace />;
  }
  return children;
};

export default ProtectedRoute; 
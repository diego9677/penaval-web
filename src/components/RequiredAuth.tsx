import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContext } from "../context/AuthProvider";

export default function RequireAuth({ children }: { children?: ReactNode; }) {
  const { authState: { loading, isLogged } } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        loading
      </div>
    );
  }

  if (!isLogged) {
    return (
      <Navigate to='/login' state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}
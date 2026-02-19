import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAppContext } from '../context/useContext';


const ProtectedRoute = () => {
    const { user, userLoading } = useAppContext();

    
    

    if (!user && !userLoading) {
        return <Navigate to="/login" replace />;
    }

    
    return <Outlet />;
};

export default ProtectedRoute;
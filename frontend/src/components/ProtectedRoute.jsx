import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Check if user is logged in and has the 'Responder' role
    if (userInfo && userInfo.token && userInfo.role === 'Responder') {
        return <Outlet />; // If authorized, render the child route (e.g., DashboardPage)
    } else {
        return <Navigate to="/login" replace />; // If not authorized, redirect to the login page
    }
};

export default ProtectedRoute;

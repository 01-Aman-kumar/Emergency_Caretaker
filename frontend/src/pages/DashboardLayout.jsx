import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import io from 'socket.io-client';
import './DashboardLayout.css';

const socket = io('http://localhost:5000');

const DashboardLayout = () => {
    useEffect(() => {
        // Ask for notification permission as soon as the dashboard loads
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const handleNewRequest = (newRequest) => {
            if (Notification.permission === 'granted') {
                new Notification('New Emergency Request!', {
                    body: `${newRequest.emergencyType} reported with ${newRequest.victimCount} victims.`,
                    icon: '/favicon.ico' // Optional: Add an icon
                });
            }
        };

        socket.on('newHelpRequest', handleNewRequest);

        return () => {
            socket.off('newHelpRequest', handleNewRequest);
        };
    }, []);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;

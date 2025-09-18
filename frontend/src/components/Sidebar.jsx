import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HouseDoor, ListTask, ClockHistory, Person, Gear, BoxArrowLeft } from 'react-bootstrap-icons';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-header">
                <h3>Responder Dashboard</h3>
            </div>
            <ul className="sidebar-nav">
                <li><NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}><HouseDoor /> Dashboard</NavLink></li>
                <li><NavLink to="/active-requests" className={({isActive}) => isActive ? "active" : ""}><ListTask /> Active Requests</NavLink></li>
                <li><NavLink to="/history" className={({isActive}) => isActive ? "active" : ""}><ClockHistory /> Response History</NavLink></li>
                <li><NavLink to="/profile" className={({isActive}) => isActive ? "active" : ""}><Person /> Profile</NavLink></li>
                <li><NavLink to="/settings" className={({isActive}) => isActive ? "active" : ""}><Gear /> Settings</NavLink></li>
            </ul>
            <div className="sidebar-footer">
                <ul className="sidebar-nav">
                    <li><a href="#logout" onClick={logoutHandler}><BoxArrowLeft /> Logout</a></li>
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;

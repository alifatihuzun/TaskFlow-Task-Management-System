import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">📋</span>
                    <span className="logo-text">TaskFlow</span>
                </Link>
            </div>
            <div className="navbar-menu">
                <Link to="/" className="navbar-link">Dashboard</Link>
                <Link to="/tasks" className="navbar-link">Görevler</Link>
            </div>
            <div className="navbar-user">
                <span className="user-name">{user?.fullName}</span>
                <span className="user-role">{user?.role}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" id="logout-button">
                    Çıkış
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

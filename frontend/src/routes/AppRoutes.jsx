import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import RestaurantSignup from '../pages/RestaurantSignup';
import LandingPage from '../pages/Landing/LandingPage';
import Dashboard from '../pages/Dashboard';
import StaffDashboard from '../pages/StaffDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<RestaurantSignup />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
    );
};

export default AppRoutes;

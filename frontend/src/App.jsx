import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RequestHelpPage from './pages/RequestHelpPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardContent from './pages/DashboardContent';
import ActiveRequestsPage from './pages/ActiveRequestsPage';
import ResponseHistoryPage from './pages/ResponseHistoryPage';
import ProfilePage from './pages/ProfilePage'; // Import
import SettingsPage from './pages/SettingsPage'; // Import
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /><HomePage /><Footer /></>} />
        <Route path="/request-help" element={<><Header /><RequestHelpPage /><Footer /></>} />
        <Route path="/login" element={<><Header /><LoginPage /><Footer /></>} />
        <Route path="/register" element={<><Header /><RegisterPage /><Footer /></>} />
        <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="active-requests" element={<ActiveRequestsPage />} />
                <Route path="history" element={<ResponseHistoryPage />} />
                <Route path="profile" element={<ProfilePage />} /> {/* Add route */}
                <Route path="settings" element={<SettingsPage />} /> {/* Add route */}
            </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

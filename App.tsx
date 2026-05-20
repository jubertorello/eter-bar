import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import LandingPage from './src/pages/LandingPage';
import AdminDashboard from './src/pages/AdminDashboard';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;

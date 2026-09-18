import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './src/context/AppContext';
import LandingPage from './src/pages/LandingPage';

// El panel se carga aparte para que los visitantes de la landing no descarguen su código.
const AdminDashboard = lazy(() => import('./src/pages/AdminDashboard'));

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div className="min-h-screen bg-[#050000]" />}>
                <AdminDashboard />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;

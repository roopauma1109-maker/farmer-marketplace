import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CropDetailsPage } from './pages/CropDetailsPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { AssistedAccessPage } from './pages/AssistedAccessPage';
import { AIPredictionPage } from './pages/AIPredictionPage';

// Farmer Pages
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { FarmerMyCropsPage } from './pages/FarmerMyCropsPage';
import { FarmerAddCropPage } from './pages/FarmerAddCropPage';
import { FarmerEnquiriesPage } from './pages/FarmerEnquiriesPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';

// Buyer Pages
import { BuyerProfilePage } from './pages/BuyerProfilePage';

export function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/crop/:id" element={<CropDetailsPage />} />
          <Route path="/market-prices" element={<MarketPricesPage />} />
          <Route path="/assisted-access" element={<AssistedAccessPage />} />
          <Route path="/ai-insights" element={<AIPredictionPage />} />

          {/* Farmer Protected Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/crops"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerMyCropsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/add-crop"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerAddCropPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/market-prices"
            element={<Navigate to="/market-prices" replace />}
          />
          <Route
            path="/farmer/enquiries"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerEnquiriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/profile"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Buyer Protected Routes */}
          <Route
            path="/buyer/profile"
            element={
              <ProtectedRoute allowedRole="buyer">
                <BuyerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

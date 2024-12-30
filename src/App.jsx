import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import Home from './pages/Home/Home';
import OurWork from './pages/OurWork/OurWork';
import Programs from './pages/Programs/Programs';
import GetInvolved from './pages/GetInvolved/GetInvolved';
import AboutUs from './pages/AboutUs/AboutUs';
import News from './pages/News/News';
import NewsDetail from './pages/News/NewsDetail';
import Donate from './pages/Donate/Donate';
import RefugeeTeensTalk from './pages/Programs/ProgramPages/RefugeeTeensTalk';
import KakumaMediaProduction from './pages/Programs/ProgramPages/KakumaMediaProduction';
import KakumaTheatre from './pages/Programs/ProgramPages/KakumaTheatre';
import Volunteer from './pages/Volunteer/Volunteer';

// Admin Pages
import Login from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <div className="app">
            {/* Public Routes */}
            <Routes>
              <Route
                path="/*"
                element={
                  <>
                    <Navbar />
                    <Routes>
                      <Route index element={<Home />} />
                      <Route path="our-work" element={<OurWork />} />
                      <Route path="programs" element={<Programs />} />
                      <Route path="programs/refugee-teens-talk" element={<RefugeeTeensTalk />} />
                      <Route path="programs/media-production" element={<KakumaMediaProduction />} />
                      <Route path="programs/theatre" element={<KakumaTheatre />} />
                      <Route path="get-involved" element={<GetInvolved />} />
                      <Route path="about-us" element={<AboutUs />} />
                      <Route path="news" element={<News />} />
                      <Route path="news/:id" element={<NewsDetail />} />
                      <Route path="donate" element={<Donate />} />
                      <Route path="volunteer" element={<Volunteer />} />
                    </Routes>
                    <Footer />
                  </>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/dashboard/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;

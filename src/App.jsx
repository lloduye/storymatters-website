import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
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
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import './pages/Admin/Login.css';
import './pages/Admin/AdminDashboard.css';

// Layout component for the main site
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="app-container">
          <Routes>
            {/* Public routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/our-work" element={<OurWork />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/programs/refugee-teens-talk" element={<RefugeeTeensTalk />} />
              <Route path="/programs/media-production" element={<KakumaMediaProduction />} />
              <Route path="/programs/theatre" element={<KakumaTheatre />} />
              <Route path="/volunteer" element={<Volunteer />} />
            </Route>

            {/* Admin routes without MainLayout */}
            <Route path="/admin">
              <Route path="login" element={<Login />} />
              <Route 
                path="dashboard/*" 
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  </ErrorBoundary>
                } 
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

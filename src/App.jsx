import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import OurWork from './pages/OurWork/OurWork';
import Programs from './pages/Programs/Programs';
import GetInvolved from './pages/GetInvolved/GetInvolved';
import AboutUs from './pages/AboutUs/AboutUs';
import News from './pages/News/News';
import Donate from './pages/Donate/Donate';
import RefugeeTeensTalk from './pages/Programs/ProgramPages/RefugeeTeensTalk';
import KakumaMediaProduction from './pages/Programs/ProgramPages/KakumaMediaProduction';
import KakumaTheatre from './pages/Programs/ProgramPages/KakumaTheatre';
import NewsDetail from './pages/News/NewsDetail';
import Volunteer from './pages/Volunteer/Volunteer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/programs/refugee-teens-talk" element={<RefugeeTeensTalk />} />
            <Route path="/programs/media-production" element={<KakumaMediaProduction />} />
            <Route path="/programs/theatre" element={<KakumaTheatre />} />
            <Route path="/volunteer" element={<Volunteer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

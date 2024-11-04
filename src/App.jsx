import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import OurWork from './pages/OurWork/OurWork'
import Programs from './pages/Programs/Programs'
import GetInvolved from './pages/GetInvolved/GetInvolved'
import AboutUs from './pages/AboutUs/AboutUs'
import News from './pages/News/News'
import Donate from './pages/Donate/Donate'

function App() {
  return (
    <Router>
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
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

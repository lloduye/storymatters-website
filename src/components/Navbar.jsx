import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" onClick={scrollToTop}>Home</Link>
        <Link to="/news" onClick={scrollToTop}>News</Link>
        <Link to="/about" onClick={scrollToTop}>About</Link>
        {/* other nav links */}
      </div>
    </nav>
  );
}; 
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Programs Section */}
                <div className="footer-section">
                    <h3>Our Programs</h3>
                    <ul>
                        <li><Link to="/programs/youth">Youth Programs</Link></li>
                        <li><Link to="/programs/community">Community Outreach</Link></li>
                        <li><Link to="/programs/education">Educational Initiatives</Link></li>
                        <li><Link to="/programs/workshops">Workshops</Link></li>
                    </ul>
                </div>

                {/* Get Involved Section */}
                <div className="footer-section">
                    <h3>Get Involved</h3>
                    <ul>
                        <li><Link to="/volunteer">Volunteer</Link></li>
                        <li><Link to="/donate">Donate</Link></li>
                        <li><Link to="/partnerships">Partnerships</Link></li>
                        <li><Link to="/events">Upcoming Events</Link></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <ul>
                        <li>Email: contact@storymatters.org</li>
                        <li>Phone: +254 700 000 000</li>
                        <li>Address: Kakuma Refugee Camp</li>
                        <li>Turkana County, Kenya</li>
                        <li className="social-links">
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
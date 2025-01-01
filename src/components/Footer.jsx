import { EMAIL_CONFIG } from '../utils/emailConfig';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li>Email: <li>info@stoymattersentertainment.com</li></li>
            <li>Phone: +254 700 000 000</li>
            <li>Address: Kakuma Refugee Camp</li>
            <li>Turkana County, Kenya</li>
          </ul>
          <div className="social-links">
            {/* social links if any */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
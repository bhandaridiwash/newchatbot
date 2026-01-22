import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <span className="logo-icon">🤖</span>
                            <span className="logo-text">RestaurantAI</span>
                        </div>
                        <p className="footer-description">
                            Empowering restaurants with AI-powered chatbots for seamless ordering, reservations, and payments.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Product</h4>
                        <ul className="footer-links">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#demo">Demo</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Company</h4>
                        <ul className="footer-links">
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Support</h4>
                        <ul className="footer-links">
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#docs">Documentation</a></li>
                            <li><a href="#api">API Reference</a></li>
                            <li><a href="#status">System Status</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">Legal</h4>
                        <ul className="footer-links">
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><a href="#security">Security</a></li>
                            <li><a href="#compliance">Compliance</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © 2024 RestaurantAI. All rights reserved.
                    </p>
                    <div className="footer-social">
                        <a href="#twitter" className="social-link">Twitter</a>
                        <a href="#linkedin" className="social-link">LinkedIn</a>
                        <a href="#facebook" className="social-link">Facebook</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

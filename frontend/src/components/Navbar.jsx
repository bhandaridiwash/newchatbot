import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <Logo size={32} />
                        <span className="logo-text">RestaurantAI</span>
                    </Link>


                    <div className="navbar-links">
                        <a onClick={() => scrollToSection('features')} className="navbar-link">Features</a>
                        <a onClick={() => scrollToSection('how-it-works')} className="navbar-link">How It Works</a>
                        <a onClick={() => scrollToSection('pricing')} className="navbar-link">Pricing</a>
                        <a onClick={() => scrollToSection('faq')} className="navbar-link">FAQ</a>
                    </div>

                    <div className="navbar-actions">
                        <Link to="/login">
                            <Button variant="secondary" size="small">Sign In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" size="small">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section className="hero">
            <div className="hero-pattern"></div>
            <div className="hero-blob hero-blob-1"></div>
            <div className="hero-blob hero-blob-2"></div>
            <div className="container">
                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="hero-title">
                                Transform Your Restaurant with
                                <span className="hero-gradient"> AI-Powered Conversations</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            className="hero-description"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Automate orders, reservations, and payments through intelligent text-based chatbots on WhatsApp, Web, and Social Media. Serve more customers, reduce wait times, and boost revenue all without adding staff.
                        </motion.p>

                        <motion.div
                            className="hero-cta"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button variant="primary" size="large">Start Free Trial</Button>
                            <Button variant="secondary" size="large">Watch Demo</Button>
                        </motion.div>

                        <motion.div
                            className="hero-stats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="stat">
                                <div className="stat-value">10K+</div>
                                <div className="stat-label">Restaurants</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">2M+</div>
                                <div className="stat-label">Orders Processed</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">99.9%</div>
                                <div className="stat-label">Uptime</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    >
                        <div className="hero-image-wrapper">
                            <img
                                src="/assets/hero-mockup.png"
                                alt="Restaurant AI Dashboard Mockup"
                                className="hero-image"
                            />
                            <motion.div
                                className="floating-badge badge-1"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="badge-icon">🍕</div>
                                <div className="badge-content">
                                    <div className="badge-title">New Order</div>
                                    <div className="badge-text">Large Pepproni Pizza</div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="floating-badge badge-2"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="badge-icon">💰</div>
                                <div className="badge-content">
                                    <div className="badge-title">Payment Received</div>
                                    <div className="badge-text">Rs. 2,450 via eSewa</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

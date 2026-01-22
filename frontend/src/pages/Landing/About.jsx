import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import './About.css';

const About = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div id="about">
            {/* How It Works Section */}
            <section id="how-it-works" className="section how-it-works-section">
                <div className="container">
                    <motion.div
                        className="section-header text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <Badge status="preparing">Process</Badge>
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-description">
                            Get started in minutes. No technical expertise required.
                        </p>
                    </motion.div>

                    {/* New Image-Based Process Steps */}
                    <div className="process-steps">
                        <motion.div
                            className="process-step"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="process-content">
                                <div className="step-number">01</div>
                                <h3 className="step-title">Connect Channels & Menu</h3>
                                <p className="step-description">Link your WhatsApp Business, Facebook, and Instagram. Upload your menu and let our AI learn it instantly.</p>
                            </div>
                            <div className="process-image-wrapper">
                                <img src="/assets/how-it-works-1.png" alt="Connect Channels" className="process-image" />
                            </div>
                        </motion.div>

                        <motion.div
                            className="process-step process-step--reverse"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="process-content">
                                <div className="step-number">02</div>
                                <h3 className="step-title">Customize & Go Live</h3>
                                <p className="step-description">Train the AI text assistant with your brand voice and special offers. Activate your 24/7 chatbot to start taking text orders.</p>
                            </div>
                            <div className="process-image-wrapper">
                                <img src="/assets/how-it-works-3.png" alt="AI Training" className="process-image" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Multi-Tenant Section */}
            <section className="section multi-tenant-section">
                <div className="container">
                    <div className="multi-tenant-content">
                        <motion.div
                            className="multi-tenant-text"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <Badge status="delivered">Multi-Tenant</Badge>
                            <h2 className="section-title">Built for Restaurant Chains & Franchises</h2>
                            <p className="section-description">
                                Manage multiple locations from a single dashboard. Each restaurant gets its own customized chatbot with centralized analytics and billing.
                            </p>
                            <ul className="feature-list">
                                <li className="feature-list-item">
                                    <span className="feature-check">✓</span>
                                    Centralized menu management across all locations
                                </li>
                                <li className="feature-list-item">
                                    <span className="feature-check">✓</span>
                                    Location-specific pricing and availability
                                </li>
                                <li className="feature-list-item">
                                    <span className="feature-check">✓</span>
                                    Unified customer data and loyalty programs
                                </li>
                                <li className="feature-list-item">
                                    <span className="feature-check">✓</span>
                                    Role-based access for managers and staff
                                </li>
                            </ul>
                            <Button variant="primary" size="large">Learn More</Button>
                        </motion.div>
                        <div className="multi-tenant-visual">
                            <motion.div
                                className="tenant-card"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <div className="tenant-icon">🍔</div>
                                <div className="tenant-name">Burger Hub Downtown</div>
                                <div className="tenant-stats">
                                    <span>142 orders today</span>
                                </div>
                            </motion.div>
                            <motion.div
                                className="tenant-card"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="tenant-icon">🍕</div>
                                <div className="tenant-name">Pizza Paradise North</div>
                                <div className="tenant-stats">
                                    <span>89 orders today</span>
                                </div>
                            </motion.div>
                            <motion.div
                                className="tenant-card"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <div className="tenant-icon">🍜</div>
                                <div className="tenant-name">Noodle House Central</div>
                                <div className="tenant-stats">
                                    <span>201 orders today</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import './Comparison.css';

const Comparison = () => {
    return (
        <section className="section comparison-section">
            <div className="container">
                <motion.div
                    className="section-header text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Badge status="preparing">Why Us</Badge>
                    <h2 className="section-title">The Old Way vs. The AI Way</h2>
                    <p className="section-description">
                        Stop losing customers to busy lines and missed messages. Upgrade to automation.
                    </p>
                </motion.div>

                <div className="comparison-layout">
                    {/* Left Side: Single Vertical Graph */}
                    <div className="comparison-visual">
                        <div className="visual-block vertical-chart-block">
                            <h3 className="block-title">Efficiency</h3>

                            <div className="graph-container--vertical">

                                {/* Manual Staff */}
                                <div className="bar-group--vertical">
                                    <div className="bar-wrapper">
                                        <motion.div
                                            className="bar--vertical bar--manual"
                                            initial={{ height: '20px' }}
                                            whileInView={{ height: '60%' }}
                                            transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                                            viewport={{ once: true }}
                                        >
                                            <span className="bar-value-top">60%</span>
                                        </motion.div>
                                    </div>
                                    <span className="bar-label-bottom">Manual Staff</span>
                                </div>

                                {/* AI */}
                                <div className="bar-group--vertical">
                                    <div className="bar-wrapper">
                                        <motion.div
                                            className="bar--vertical bar--ai"
                                            initial={{ height: '20px' }}
                                            whileInView={{ height: '90%' }}
                                            transition={{ type: 'spring', stiffness: 50, damping: 10, delay: 0.2 }}
                                            viewport={{ once: true }}
                                        >
                                            <span className="bar-value-top">90% Faster</span>
                                        </motion.div>
                                    </div>
                                    <span className="bar-label-bottom">Restaurant AI</span>
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* Right Side: Feature Comparison Table */}
                    <div className="comparison-features">
                        <table className="features-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Old Way</th>
                                    <th className="highlight">New Way</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Availability</td>
                                    <td className="dimmed">8-12 Hours</td>
                                    <td className="highlight">24/7 Always On</td>
                                </tr>
                                <tr>
                                    <td>Response Time</td>
                                    <td className="dimmed">MINUTES</td>
                                    <td className="highlight">INSTANT</td>
                                </tr>
                                <tr>
                                    <td>Order Accuracy</td>
                                    <td className="dimmed">~85-90%</td>
                                    <td className="highlight">100%</td>
                                </tr>
                                <tr>
                                    <td>Simultaneous Chats</td>
                                    <td className="dimmed">1 per staff</td>
                                    <td className="highlight">Unlimited</td>
                                </tr>
                                <tr>
                                    <td>Upselling</td>
                                    <td className="dimmed">Inconsistent</td>
                                    <td className="highlight">Automatic</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comparison;

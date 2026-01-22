import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import './Integrations.css';

const Integrations = () => {
    return (
        <section className="section integrations-section">
            <div className="container">
                <div className="integrations-content">
                    <motion.div
                        className="integrations-text"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge status="new">Integrations</Badge>
                        <h2 className="section-title">Connects With Tools You Already Use</h2>
                        <p className="section-description" style={{ margin: 0 }}>
                            No need to switch systems. We integrate seamlessly with your existing social media, payment gateways, and POS systems.
                        </p>
                    </motion.div>

                    <motion.div
                        className="integrations-grid"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="integration-item">
                            <div className="integration-icon-wrapper" style={{ background: '#25D366' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.029.66 2.233.914 3.195.914h.013c7.29 0 10.64-5.954 6.78-9.421-1.854-1.638-4.326-2.442-7.182-2.442zm-5.733 11.235l.89.893s-1.045-3.04-1.2-3.69c-.156-.65.045-3.69.045-3.69s.56-1.55 1.76-2.28c1.2-.73 3.03-.68 4.29-1.29 1.25-.61 2.94.06 4.38 1.48 1.44 1.42 1.63 3.48 1.63 3.48s.55 1.54 0 2.93c-.55 1.39-2.07 1.76-2.07 1.76s-1.87 2.06-2.88 2.06c-1.01 0-2.81 1.04-4.81-1.04-2-2.08-2.03-2.61-2.03-2.61z" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0c-6.84 0-12.09 5.865-11.425 12.48.315 2.565 1.425 4.545 2.64 6.135L1.44 24l5.595-1.47c1.47.81 3.12 1.245 4.8 1.245h.03c6.63 0 12.03-5.385 12.03-12.03-.015-3.21-1.26-6.225-3.375-8.295zM12.045 21.99c-1.605 0-3.18-.435-4.575-1.26l-.33-.195-3.39.885.9-3.315-.21-.345c-.945-1.5-1.44-3.225-1.44-4.995 0-5.505 4.485-9.99 9.99-9.99 2.67 0 5.175 1.035 7.065 2.925 1.875 1.89 2.925 4.38 2.925 7.05-.015 5.505-4.5 10.005-10.935 9.24z" />
                                    <path d="M16.59 14.655c-.255-.12-1.5-.735-1.725-.825-.225-.09-.39-.12-.555.135-.165.24-.63.81-.78.975-.15.165-.3.18-.555.06-.255-.135-1.08-.39-2.055-1.26-.765-.675-1.29-1.515-1.44-1.77-.15-.255-.015-.39.105-.51l.36-.42c.12-.135.15-.24.225-.39.075-.15.03-.285-.015-.375-.045-.09-.39-.945-.54-1.29-.135-.345-.285-.3-.39-.3h-.33c-.12 0-.315.045-.48.225-.165.18-.63.615-.63 1.5s.645 1.74.735 1.86c.09.12 1.26 1.935 3.06 2.7 1.05.45 1.45.36 1.98.345.585-.015 1.5-.615 1.71-1.2.21-.6.21-1.125.15-1.215-.06-.09-.225-.15-.48-.27z" />
                                </svg>
                            </div>
                            <span className="integration-name">WhatsApp</span>
                        </div>
                        <div className="integration-item">
                            <div className="integration-icon-wrapper" style={{ background: '#006AFF' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.093.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.11S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.181 8.96l3.179 3.262 5.867-3.262-6.036 6.002z" />
                                </svg>
                            </div>
                            <span className="integration-name">Messenger</span>
                        </div>
                        <div className="integration-item">
                            <div className="integration-icon-wrapper" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>
                            <span className="integration-name">Instagram</span>
                        </div>
                        <div className="integration-item">
                            <div className="integration-icon-wrapper" style={{ background: '#60BB46' }}>
                                {/* Placeholder for eSewa Icon - Custom E */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white" width="32" height="32">
                                    <path d="M50 0C22.386 0 0 22.386 0 50s22.386 50 50 50 50-22.386 50-50S77.614 0 50 0zm0 90c-22.091 0-40-17.909-40-40S27.909 10 50 10s40 17.909 40 40-17.909 40-40 40zm-5-60h25a5 5 0 010 10H50v10h15a5 5 0 010 10H50v10h20a5 5 0 010 10H45a5 5 0 01-5-5V35a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <span className="integration-name">eSewa</span>
                        </div>
                        <div className="integration-item">
                            <div className="integration-icon-wrapper" style={{ background: '#5C2D91' }}>
                                {/* Placeholder for Khalti Icon - Custom K */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="white" width="32" height="32">
                                    <path d="M20 20h15v25l25-25h20L55 50l25 30H60L35 55v25H20V20z" />
                                </svg>
                            </div>
                            <span className="integration-name">Khalti</span>
                        </div>
                        <div className="integration-item">
                            <div className="integration-icon-wrapper" style={{ background: '#635BFF' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
                                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.915 0-1.147 1.236-1.926 2.449-1.926 1.642 0 2.91.806 3.906 1.549l2.259-3.22c-1.272-.924-3.15-1.579-5.485-1.579-4.053 0-6.95 2.15-6.95 5.86 0 3.737 2.668 5.253 6.643 6.606 2.508.854 3.094 1.737 3.094 2.977 0 1.264-1.285 2.138-3.055 2.138-1.597 0-3.834-.962-5.127-1.956l-2.457 3.16c1.298 1.146 3.659 2.155 6.745 2.155 4.672 0 7.822-2.193 7.822-6.386 0-3.551-2.448-5.719-6.488-6.463z" />
                                </svg>
                            </div>
                            <span className="integration-name">Stripe</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Integrations;

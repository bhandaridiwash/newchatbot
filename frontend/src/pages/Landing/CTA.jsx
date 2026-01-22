import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import './CTA.css';

const CTA = () => {
    return (
        <section className="section cta-section">
            <div className="container">
                <motion.div
                    className="cta-content text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="cta-title">Ready to Automate Your Restaurant?</h2>
                    <p className="cta-description">
                        Join thousands of restaurants using our AI to boost revenue and streamline operations. Start your free 14-day trial today.
                    </p>
                    <div className="cta-buttons">
                        <Button variant="primary" size="large">Start Free Trial</Button>
                        <Button variant="outline" size="large" className="cta-btn-secondary">Schedule Demo</Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

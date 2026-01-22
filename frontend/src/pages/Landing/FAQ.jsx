import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import './FAQ.css';

const FAQ = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section id="faq" className="section faq-section">
            <div className="container">
                <motion.div
                    className="section-header text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <Badge status="preparing">FAQ</Badge>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                </motion.div>

                <div className="faq-grid">
                    <div className="faq-item">
                        <h3 className="faq-question">How long does setup take?</h3>
                        <p className="faq-answer">
                            Most restaurants are up and running within 30 minutes. Our onboarding team guides you through connecting channels, uploading your menu, and customizing your AI assistant.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Do I need technical knowledge?</h3>
                        <p className="faq-answer">
                            Not at all! Our platform is designed for restaurant owners, not developers. Everything is point-and-click, and our support team is always ready to help.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Which messaging platforms do you support?</h3>
                        <p className="faq-answer">
                            We support WhatsApp Business, Facebook Messenger, Instagram DMs, Web Chat, and SMS. More integrations are added regularly based on customer feedback.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Can I customize the AI responses?</h3>
                        <p className="faq-answer">
                            Yes! You can train the AI with your brand voice, add custom responses, set up special offers, and configure how it handles different scenarios.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">What payment methods are supported?</h3>
                        <p className="faq-answer">
                            We integrate with major payment processors including Stripe, PayPal, Square, and local payment gateways. Customers can pay with cards, digital wallets, or cash on delivery.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Is there a free trial?</h3>
                        <p className="faq-answer">
                            Yes! All plans come with a 14-day free trial. No credit card required. You can test all features and see how it works for your restaurant before committing.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;

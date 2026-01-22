import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import './Testimonials.css';

const Testimonials = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section className="section testimonials-section">
            <div className="container">
                <motion.div
                    className="section-header text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <Badge status="delivered">Testimonials</Badge>
                    <h2 className="section-title">Loved by Restaurant Owners</h2>
                </motion.div>

                <motion.div
                    className="testimonials-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="testimonial-card">
                        <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "RestaurantAI increased our orders by 40% in the first month. The AI chatbot handles everything perfectly, and our staff can focus on cooking."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">👨‍🍳</div>
                            <div className="author-info">
                                <div className="author-name">Marco Rossi</div>
                                <div className="author-role">Owner, Bella Italia</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="testimonial-card">
                        <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Managing 5 locations was a nightmare. Now everything is centralized, and I can see real-time data from all restaurants in one dashboard."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">👩‍💼</div>
                            <div className="author-info">
                                <div className="author-name">Sarah Chen</div>
                                <div className="author-role">CEO, Noodle Express Chain</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="testimonial-card">
                        <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "The WhatsApp integration is a game-changer. Our customers love ordering directly through chat, and we've reduced phone call volume by 80%."
                        </p>
                        <div className="testimonial-author">
                            <div className="author-avatar">👨‍🍳</div>
                            <div className="author-info">
                                <div className="author-name">Raj Patel</div>
                                <div className="author-role">Manager, Spice Garden</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;

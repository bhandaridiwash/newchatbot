import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '../../components/FeatureCard';
import OrdersIcon from '../../assets/icons/OrdersIcon';
import MenuIcon from '../../assets/icons/MenuIcon';
import AiIcon from '../../assets/icons/AiIcon';
import AnalyticsIcon from '../../assets/icons/AnalyticsIcon';
import Badge from '../../components/ui/Badge';
import './Features.css';

const Features = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section id="features" className="section features-section">
            <div className="container">
                <motion.div
                    className="section-header text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <Badge status="new">Features</Badge>
                    <h2 className="section-title">Everything You Need to Automate Your Restaurant</h2>
                    <p className="section-description">
                        Powerful AI-driven features that handle customer interactions, streamline operations, and increase revenue.
                    </p>
                </motion.div>

                <div className="features-grid">
                    <FeatureCard
                        className="span-2 feature-card-primary"
                        icon={<OrdersIcon size={40} />}
                        title="Smart Order Management"
                        description="AI understands text-based orders, suggests add-ons, and processes payments instantly. Reduce order errors by 95%."
                        delay={0}
                    />
                    <FeatureCard
                        className="span-row-2"
                        icon={<MenuIcon size={40} />}
                        title="Intelligent Reservations"
                        description="Automated table booking with real-time availability. Sends confirmations, reminders, and manages your floor plan efficiently to reduce no-shows and optimize seating."
                        delay={100}
                    />
                    <FeatureCard
                        icon={<AiIcon size={32} />}
                        title="Seamless Payments"
                        description="Integrated payment processing across all channels. Support for cards, digital wallets (eSewa, Khalti), and cash."
                        delay={200}
                    />
                    <FeatureCard
                        icon={<AnalyticsIcon size={32} />}
                        title="Advanced Analytics"
                        description="Real-time insights into orders, customer preferences. Make data-driven decisions."
                        delay={0}
                    />
                    <FeatureCard
                        icon={<OrdersIcon size={32} />}
                        title="Multi-Channel Support"
                        description="One platform for WhatsApp, Facebook Messenger, Instagram, Web Chat, and more."
                        delay={100}
                    />
                    <FeatureCard
                        className="span-2 feature-card-dark"
                        icon={<AiIcon size={40} />}
                        title="24/7 AI Automation"
                        description="Never miss an order. AI text chatbot handles inquiries, takes orders, and processes payments around the clock, acting as your perfect digital employee."
                        delay={200}
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;

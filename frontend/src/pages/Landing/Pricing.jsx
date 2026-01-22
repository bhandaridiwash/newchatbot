import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Loader } from 'lucide-react';
import plansAPI from '../../services/plansApi';
import './Pricing.css';

const Pricing = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch public plans (active plans only)
            const data = await plansAPI.getActivePlans();
            if (data && data.data) {
                const plansData = data.data.map(plan => ({
                    ...plan,
                    features: Array.isArray(plan.features) 
                        ? plan.features 
                        : (plan.features 
                            ? Object.entries(plan.features)
                                .filter(([key, value]) => value === true || typeof value === 'object')
                                .map(([key, value]) => typeof value === 'string' ? value : key)
                            : [])
                }));
                setPlans(plansData);
            }
        } catch (err) {
            console.error('Error fetching plans:', err);
            setError('Failed to load pricing plans');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <section id="pricing" className="section pricing-section">
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '400px'
                    }}>
                        <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: '#4f46e5' }} />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="pricing" className="section pricing-section">
                <div className="container">
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#991b1b',
                        background: '#fee2e2',
                        borderRadius: '8px'
                    }}>
                        <p>Unable to load pricing plans. Please try again later.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing" className="section pricing-section">
            <div className="container">
                <motion.div
                    className="section-header text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <Badge status="new">Pricing</Badge>
                    <h2 className="section-title">Simple, Transparent Pricing</h2>
                    <p className="section-description">
                        Choose the plan that fits your restaurant. No hidden fees.
                    </p>
                </motion.div>

                <motion.div
                    className="pricing-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {plans.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                            <p>No pricing plans available at the moment.</p>
                        </div>
                    ) : (
                        plans.map((plan, index) => {
                            const isPopular = index === 1; // Highlight second plan as popular
                            return (
                                <motion.div
                                    key={plan.id}
                                    variants={fadeInUp}
                                    className={`pricing-card ${isPopular ? 'pricing-card--featured' : ''}`}
                                >
                                    {isPopular && <div className="pricing-badge">Most Popular</div>}
                                    <h3 className="pricing-name">{plan.name}</h3>
                                    <div className="pricing-price">
                                        <span className="price-currency">{plan.currency === 'PKR' ? 'Rs.' : plan.currency}</span>
                                        <span className="price-amount">{plan.price.toLocaleString()}</span>
                                        <span className="price-period">/{plan.billing_period === 'monthly' ? 'month' : plan.billing_period}</span>
                                    </div>
                                    <p className="pricing-description">{plan.description}</p>
                                    <ul className="pricing-features">
                                        {plan.features && plan.features.length > 0 ? (
                                            plan.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))
                                        ) : (
                                            <li>Feature list coming soon</li>
                                        )}
                                    </ul>
                                    <Button
                                        variant={isPopular ? "primary" : "secondary"}
                                        className="pricing-button"
                                    >
                                        Start Free Trial
                                    </Button>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Pricing;

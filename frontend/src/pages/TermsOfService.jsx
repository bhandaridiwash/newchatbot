import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

const TermsOfService = () => {
    return (
        <div className="page-wrapper">
            <Navbar />
            <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>Terms of Service</h1>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        By accessing and using RestaurantAI, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Description of Service</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        RestaurantAI provides AI-powered chatbot solutions for restaurants, enabling automated ordering, reservations, and customer service.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>3. User Account</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>4. Modifications to Service</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        RestaurantAI reserves the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
                    </p>
                </section>
                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>5. Contact Us</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        If you have any questions about these Terms, please contact us at support@restaurantai.com.
                    </p>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default TermsOfService;

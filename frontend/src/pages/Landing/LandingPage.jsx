import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from './HeroSection';
import TrustedBy from './TrustedBy';
import Features from './Features';
import Integrations from './Integrations';
import About from './About';
import Comparison from './Comparison';
import Pricing from './Pricing';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import CTA from './CTA';
import './LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Navbar />
            <HeroSection />
            <TrustedBy />
            <Features />
            <Integrations />
            <About />
            <Comparison />
            <Pricing />
            <Testimonials />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;

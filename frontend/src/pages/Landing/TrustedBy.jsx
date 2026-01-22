import React from 'react';
import './TrustedBy.css';

const TrustedBy = () => {
    // Placeholder logos using text for now, in a real app these would be SVGs/images
    const partners = [
        "Burger King", "Pizza Hut", "KFC", "Nandos", "Subway", "Dominos"
    ];

    return (
        <section className="trusted-by-section">
            <div className="container">
                <p className="trusted-text">Trusted by 500+ restaurants worldwide</p>
                <div className="logos-wrapper">
                    <div className="logos-scroll">
                        {/* Duplicate lists for seamless scrolling animation */}
                        <div className="logos-track">
                            {partners.map((partner, index) => (
                                <div key={`p1-${index}`} className="logo-item">{partner}</div>
                            ))}
                        </div>
                        <div className="logos-track">
                            {partners.map((partner, index) => (
                                <div key={`p2-${index}`} className="logo-item">{partner}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;

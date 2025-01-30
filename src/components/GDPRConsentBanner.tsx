import React, { useState, useEffect } from 'react';

interface GdprConsentBannerProps {
    onConsent: () => void;
}

const GdprConsentBanner: React.FC<GdprConsentBannerProps> = ({ onConsent }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consentGiven = localStorage.getItem('gdpr_consent');
        if (!consentGiven) {
            setIsVisible(true);
        }
    }, []);

    const handleConsent = () => {
        localStorage.setItem('gdpr_consent', 'true');
        setIsVisible(false);
        onConsent();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="gdpr-banner">
            <p>We use cookies to improve your experience. By using our site, you agree to our privacy policy.</p>
            <button onClick={handleConsent}>Accept</button>
        </div>
    );
};

export default GdprConsentBanner;

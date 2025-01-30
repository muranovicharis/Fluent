import React, { useState, useEffect } from 'react';

export default function GDPRConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('gdpr-consent');
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('gdpr-consent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-blue-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <p className="ml-3 font-medium text-white truncate">
                <span className="md:hidden">We use cookies for essential features.</span>
                <span className="hidden md:inline">
                  We use cookies and similar technologies to ensure the basic functionality of our service
                  and to enhance your experience. Your data is protected under GDPR guidelines.
                </span>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <button
                onClick={handleAccept}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Update handleAccept to sync with Supabase
const handleAccept = async () => {
  const { error } = await supabase
    .from('customers')
    .update({ 
      gdpr_consent: true,
      gdpr_consent_date: new Date().toISOString()
    })
    .eq('id', user.id); // Assuming you have user context

  if (!error) {
    localStorage.setItem('gdpr-consent', 'true');
    setShowConsent(false);
  }
};

// Add data deletion handler
const handleDataDeletion = async () => {
  const { error } = await supabase.rpc('delete_customer_data', {
    customer_id: user.id
  });
  
  if (!error) {
    localStorage.removeItem('gdpr-consent');
    // Redirect or handle post-deletion
  }
};
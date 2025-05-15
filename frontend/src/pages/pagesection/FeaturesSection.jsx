import React from 'react';

export default function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="feature-card">
        <img src="/assets/checkin.png" alt="Check-In / Out" />
        <p>Check-In / Out</p>
      </div>
      <div className="feature-card">
        <img src="/assets/payment.png" alt="Payment" />
        <p>Payment</p>
      </div>
      <div className="feature-card">
        <img src="/assets/report.png" alt="Report" />
        <p>Report</p>
      </div>
      <div className="feature-card">
        <img src="/assets/reviews.png" alt="Reviews" />
        <p>Reviews</p>
      </div>
    </section>
  );
}

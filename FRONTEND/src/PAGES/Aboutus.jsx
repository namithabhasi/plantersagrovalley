import React from 'react';
import { useNavigate } from 'react-router-dom';
import aboutuspic1 from '../assets/aboutuspic1.jpg';
import aboutuspic2 from '../assets/aboutuspic2.jpg';
import './Aboutus.css';

function Aboutus() {
  const navigate = useNavigate();

  return (
    <div className="about-page-wrapper">
      
      {/* 1. HERO SECTION */}
      <section className="about-hero-section">
        <div className="container about-hero-container">
          <div className="about-hero-content">
            <span className="about-pre-title">ABOUT US</span>
            <h1 className="about-hero-title">Rooted in Nature, Growing Together.</h1>
            <p className="about-hero-desc">
              At Planters Agro Valley, we believe that every plant has the power to bring life, harmony, and happiness to your space. We are here to make gardening simple, joyful, and accessible for everyone.
            </p>
            <div className="about-hero-actions">
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-primary about-btn-shop"
              >
                Shop Plants
              </button>
            </div>
          </div>
          <div className="about-hero-media">
            <img 
              src={aboutuspic1} 
              alt="Planters Agro Valley shelf setup" 
              className="about-hero-img"
            />
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="about-story-section">
        <div className="container about-story-container">
          
          {/* Left Column: Image */}
          <div className="about-story-media">
            <img 
              src={aboutuspic2} 
              alt="Planting hands setup" 
              className="about-story-img"
            />
          </div>

          {/* Middle Column: Text Details */}
          <div className="about-story-text">
            <span className="about-pre-title green">OUR STORY</span>
            <h2 className="about-section-title">Cultivating Green Dreams Since Day One</h2>
            <p className="about-story-paragraph">
              Planters Agro Valley began with a simple idea - to connect people with nature through high-quality plants and gardening essentials. What started as a small passion project has now grown into a trusted destination for plant lovers across the country.
            </p>
            <p className="about-story-paragraph">
              We carefully handpick every plant and product to ensure the best quality, healthy growth, and a delightful experience for our customers.
            </p>
          </div>

          {/* Right Column: Values Checklist (NO ICONS) */}
          <div className="about-story-checklist">
            <div className="about-checklist-item">
              <h4 className="about-checklist-title">Wide Variety</h4>
              <p className="about-checklist-desc">From indoor greens to outdoor beauties.</p>
            </div>
            <div className="about-checklist-item">
              <h4 className="about-checklist-title">Premium Quality</h4>
              <p className="about-checklist-desc">Healthy plants, carefully selected for you.</p>
            </div>
            <div className="about-checklist-item">
              <h4 className="about-checklist-title">Safe Delivery</h4>
              <p className="about-checklist-desc">Secure packaging and on-time delivery to your doorstep.</p>
            </div>
            <div className="about-checklist-item">
              <h4 className="about-checklist-title">Happy Gardening</h4>
              <p className="about-checklist-desc">Helping you create green spaces you love.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. OUR VALUES SECTION */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-values-header">
            <span className="about-pre-title">OUR VALUES</span>
            <h2 className="about-section-title text-center">What Drives Us Every Day</h2>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card">
              <h3 className="about-value-title">Sustainability</h3>
              <p className="about-value-desc">
                We promote eco-friendly practices and products for a greener planet.
              </p>
            </div>
            <div className="about-value-card">
              <h3 className="about-value-title">Integrity</h3>
              <p className="about-value-desc">
                Honest service, transparent practices, and customer-first approach.
              </p>
            </div>
            <div className="about-value-card">
              <h3 className="about-value-title">Passion</h3>
              <p className="about-value-desc">
                We are plant lovers dedicated to spreading the joy of gardening.
              </p>
            </div>
            <div className="about-value-card">
              <h3 className="about-value-title">Community</h3>
              <p className="about-value-desc">
                Building a community of green enthusiasts and growing together.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Aboutus;

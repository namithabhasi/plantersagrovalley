import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHeart, FaSun } from 'react-icons/fa';

import imgCorp from '../assets/BRINGLIFE/image copy.png';
import imgFam from '../assets/BRINGLIFE/image.png';
import imgMe from '../assets/BRINGLIFE/image copy 3.png';
import imgFuture from '../assets/BRINGLIFE/image copy 7.png';
import imgGolden from '../assets/BRINGLIFE/image copy 6.png';
import imgWorkspace from '../assets/BRINGLIFE/image copy 2.png';
import imgBalcony from '../assets/BRINGLIFE/image copy 5.png';
import imgPeaceful from '../assets/BRINGLIFE/image copy 8.png';
import imgRooftop from '../assets/BRINGLIFE/image copy 4.png';

function BringLifeSection() {
  const cards = [
    { image: imgCorp, title: 'Corporate Life', link: '/plants' },
    { image: imgFam, title: 'Family Time', link: '/plants' },
    { image: imgMe, title: 'Me Time', link: '/plants' },
    { image: imgFuture, title: 'Plant a Better Future', link: '/seeds' },
    { image: imgGolden, title: 'Golden Moments', link: '/plants' },
    { image: imgWorkspace, title: 'Green Workspaces', link: '/plants' },
    { image: imgBalcony, title: 'Balcony Garden', link: '/balcony-garden' },
    { image: imgPeaceful, title: 'Peaceful Breaks', link: '/plants' },
    { image: imgRooftop, title: 'Rooftop Oasis', link: '/plants' },
  ];

  return (
    <section className="bring-life-section">
      <div className="container bring-life-container">
        
        {/* Left Column */}
        <div className="bring-life-left">
          <div className="bring-life-badge">
            <FaLeaf className="badge-icon" />
            <span>LIVE BEYOND THE SCREEN</span>
          </div>
          
          <h2 className="bring-life-title">
            Bring Life <br />
            Back to Nature.
          </h2>
          
          <p className="bring-life-tagline">
            Every profession deserves a moment of green.
          </p>
          
          <p className="bring-life-desc">
            Whether you're working long hours in a corporate office, studying
            for exams, running a business, or managing a busy home, spending
            time with plants helps you disconnect from screens, reduce stress,
            improve focus, and reconnect with nature. Even a few peaceful
            minutes each day can refresh your mind and restore your energy.
          </p>
          
          <div className="bring-life-features">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <FaLeaf className="feature-icon" />
              </div>
              <span className="feature-text">Reduce Daily Stress</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <FaHeart className="feature-icon" />
              </div>
              <span className="feature-text">Refresh Your Mind</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <FaSun className="feature-icon" />
              </div>
              <span className="feature-text">Spend More Time in Nature</span>
            </div>
          </div>
          
          <Link to="/plants" className="btn-explore-green">
            Explore Green Living
          </Link>
        </div>
        
        {/* Right Column Grid */}
        <div className="bring-life-right">
          <div className="bring-life-grid">
            {cards.map((card, idx) => (
              <Link to={card.link} key={idx} className="bring-life-card">
                <div className="card-image-container">
                  <img src={card.image} alt={card.title} className="card-image" />
                </div>
                <h4 className="card-title">{card.title}</h4>
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}

export default BringLifeSection;

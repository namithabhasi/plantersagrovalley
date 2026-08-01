import React from 'react';
import { Link } from 'react-router-dom';

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
    <section className="page-section bring-life-section" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
      <div className="container bring-life-container">
        
        {/* Left Column */}
        <div className="bring-life-left flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="bring-life-badge">
            <span>LIVE BEYOND THE SCREEN</span>
          </div>
          
          <h2 className="bring-life-title" style={{ fontSize: '32px' }}>
            BRING LIFE BACK TO NATURE.
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

          <div className="flex flex-col gap-3 mt-4 mb-2 items-start justify-start w-fit mx-auto lg:mx-0">
            <div className="flex items-center gap-3">
              <span className="text-[var(--color-primary)] text-2xl leading-none">•</span>
              <span className="font-[var(--font-family-heading)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-main)]">
                Reduce Daily Stress
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[var(--color-primary)] text-2xl leading-none">•</span>
              <span className="font-[var(--font-family-heading)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-main)]">
                Refresh Your Mind
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[var(--color-primary)] text-2xl leading-none">•</span>
              <span className="font-[var(--font-family-heading)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-main)]">
                Spend More Time in Nature
              </span>
            </div>
          </div>
          
          <Link to="/plants" className="btn-explore-green" style={{ marginTop: '8px' }}>
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

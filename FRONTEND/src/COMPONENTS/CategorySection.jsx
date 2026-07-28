import React from 'react';
import { Link } from 'react-router-dom';

// Import assets
import plantsImg from '../assets/carouselimage1.png';
import seedsImg from '../assets/vegetableseeds.jpg';
import bulbsImg from '../assets/flowerbulbs.jpg';
import plantersImg from '../assets/pots and planters.jpg';
import decorImg from '../assets/gardendecors.jpg';
import fertilizerImg from '../assets/fertilizer.jpg';

const categories = [
  {
    name: 'Plants',
    image: plantsImg,
    link: '/plants'
  },
  {
    name: 'Vegetable Seeds',
    image: seedsImg,
    link: '/seeds'
  },
  {
    name: 'Flower Bulbs',
    image: bulbsImg,
    link: '/seeds'
  },
  {
    name: 'Pots & Planters',
    image: plantersImg,
    link: '/planters'
  },
  {
    name: 'Garden Decor',
    image: decorImg,
    link: '/garden-decor'
  },
  {
    name: 'Fertilizers',
    image: fertilizerImg,
    link: '/fertilizer'
  }
];

function CategorySection() {
  return (
    <section className="plantsguru-category-section">
      <div className="container">
        <div className="section-header">
          <h3 className="section-title">SHOP BY CATEGORY</h3>
        </div>
        <div className="plantsguru-category-grid">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={category.link} 
              className="plantsguru-category-card"
            >
              <img 
                src={category.image} 
                alt={`Shop by ${category.name}`} 
                className="plantsguru-category-image" 
              />
              <div className="plantsguru-category-text">
                <span className="plantsguru-category-label">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;

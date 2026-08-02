import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axiosInstance';

// Import assets
import plantsImg from '../assets/carouselimage1.png';
import seedsImg from '../assets/vegetableseeds.jpg';
import bulbsImg from '../assets/flowerbulbs.jpg';
import plantersImg from '../assets/pots and planters.jpg';
import decorImg from '../assets/gardendecors.jpg';
import fertilizerImg from '../assets/fertilizer.jpg';

const getFallbackImage = (slug, name) => {
  const s = (slug || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (s.includes('seed') || n.includes('seed')) return seedsImg;
  if (s.includes('bulb') || n.includes('bulb')) return bulbsImg;
  if (s.includes('pot') || s.includes('planter') || n.includes('pot') || n.includes('planter')) return plantersImg;
  if (s.includes('decor') || s.includes('accessory') || n.includes('decor') || n.includes('accessory')) return decorImg;
  if (s.includes('fertilizer') || n.includes('fertilizer')) return fertilizerImg;
  
  return plantsImg;
};

const getCategoryLink = (slug) => {
  const s = (slug || '').toLowerCase();
  if (s === 'seeds') return '/seeds';
  if (s === 'pots-planters') return '/planters';
  if (s === 'fertilizer' || s === 'fertilizers') return '/fertilizer';
  if (s === 'garden-decor' || s === 'garden-accessories') return '/garden-decor';
  return `/plants?category=${slug}`;
};

function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/categories?activeOnly=true');
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="page-section plantsguru-category-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">SHOP BY CATEGORY</h3>
          </div>
          <div className="plantsguru-category-grid">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="plantsguru-category-card skeleton"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="page-section plantsguru-category-section">
      <div className="container">
        <div className="section-header">
          <h3 className="section-title">SHOP BY CATEGORY</h3>
        </div>
        <div className="plantsguru-category-grid">
          {categories.map((category) => (
            <Link 
              key={category._id} 
              to={getCategoryLink(category.slug)} 
              className="plantsguru-category-card"
            >
              <img 
                src={category.image || getFallbackImage(category.slug, category.name)} 
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

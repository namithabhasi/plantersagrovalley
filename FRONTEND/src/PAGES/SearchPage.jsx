import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaStar } from 'react-icons/fa';

// Import local product datasets
import { plantProducts } from './Plants';
import { seedProducts } from './Seeds';
import { planterProducts } from './Planterspage';
import { fertilizerProducts } from './Fertilizers';
import { gardenProducts } from './Gardendecors';

function SearchPage() {
  const { addToCart } = useCart();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = (params.get('q') || '').trim();
    setSearchQuery(q);

    if (!q) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Combine all local datasets
    const allProducts = [
      ...plantProducts.map(p => ({ ...p, categoryType: 'plants' })),
      ...seedProducts.map(p => ({ ...p, categoryType: 'seeds' })),
      ...planterProducts.map(p => ({ ...p, categoryType: 'planters' })),
      ...fertilizerProducts.map(p => ({ ...p, categoryType: 'fertilizers' })),
      ...gardenProducts.map(p => ({ ...p, categoryType: 'garden-decor' }))
    ];

    // Filter by name, category slug, or description
    const filtered = allProducts.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(q.toLowerCase());
      const descMatch = product.description ? product.description.toLowerCase().includes(q.toLowerCase()) : false;
      const catMatch = product.category ? product.category.toLowerCase().includes(q.toLowerCase()) : false;
      return nameMatch || descMatch || catMatch;
    });

    // Simulate a brief loading effect for a polished premium feel
    const timer = setTimeout(() => {
      setProducts(filtered);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.search]);

  return (
    <div className="py-16 md:py-20 min-h-[60vh] bg-[var(--color-bg-main)]">
      <div className="container">
        
        {/* Header */}
        <div className="section-header text-left mb-10 border-b border-[var(--color-border)] pb-6">
          <h2 className="search-page-title mb-2">
            Search Results
          </h2>
          <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)]">
            {loading ? (
              'Searching store...'
            ) : (
              <>
                Found {products.length} {products.length === 1 ? 'result' : 'results'} for <strong>"{searchQuery}"</strong>
              </>
            )}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="product-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="product-card-wrapper" style={{ minHeight: '350px' }}>
                <div className="product-card" style={{ flexGrow: 1, backgroundColor: '#f6f7f8' }}>
                  <div className="product-card-image skeleton animate-pulse" style={{ height: '200px', backgroundColor: '#edeef1' }}></div>
                  <div className="product-card-content" style={{ padding: '15px' }}>
                    <div className="skeleton animate-pulse" style={{ height: '18px', width: '80%', backgroundColor: '#edeef1', marginBottom: '10px' }}></div>
                    <div className="skeleton animate-pulse" style={{ height: '14px', width: '50%', backgroundColor: '#edeef1' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[3px]">
            <h3 className="font-[var(--font-family-heading)] text-2xl font-normal text-[var(--color-primary-dark)] mb-3">
              {searchQuery ? 'No results found' : 'Search Planters Agro Valley'}
            </h3>
            <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
              {searchQuery 
                ? "We couldn't find any products matching your search term. Please try checking your spelling or search for something else."
                : "Please enter a search term in the navbar search field to search for plants, seeds, planters, fertilizers, and more."
              }
            </p>
            <Link to="/plants" className="btn btn-primary px-8 py-3 inline-flex w-auto uppercase tracking-wider font-semibold">
              Browse All Plants
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const hasDiscount = !!product.discount;
              const originalPrice = product.originalPrice || product.oldPrice || null;
              const displayPrice = product.price;
              const discountText = product.discount || (originalPrice ? `-${Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%` : null);
              const rating = product.rating || 5;
              const inStock = product.inStock !== false;

              return (
                <div key={product.id} className="product-card-wrapper">
                  <div className="product-card" style={{ flexGrow: 1 }}>
                    {discountText && inStock && (
                      <span className="card-badge sale">{discountText}</span>
                    )}
                    {!inStock && (
                      <span className="card-badge sale bg-red-600 text-white">SOLD OUT</span>
                    )}

                    <div className="product-card-image">
                      <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-card-content">
                      <h4 className="product-title" title={product.name}>
                        {product.name}
                      </h4>

                      <div className="product-price-row" style={{ marginTop: 'auto', marginBottom: 'var(--space-2)' }}>
                        {originalPrice ? (
                          <>
                            <span className="price-original">Rs. {originalPrice}.00</span>
                            <span className="price-current sale">Rs. {displayPrice}.00</span>
                          </>
                        ) : (
                          <span className="price-current">Rs. {displayPrice}.00</span>
                        )}
                      </div>

                      <div className="product-rating" style={{ marginBottom: 0, minHeight: '18px' }}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < rating ? 'var(--color-gold)' : '#e2e8f0'}
                            size={14}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart({ id: product.id, name: product.name, price: displayPrice, image: product.image })}
                    className="btn btn-primary"
                    style={{ borderRadius: '3px' }}
                    disabled={!inStock}
                  >
                    {inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;

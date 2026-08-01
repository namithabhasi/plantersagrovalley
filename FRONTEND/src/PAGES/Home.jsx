import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HeroCarousel from '../COMPONENTS/HeroCarousel'
import BringLifeSection from '../COMPONENTS/BringLifeSection'
import CategorySection from '../COMPONENTS/CategorySection'
import { FaStar, FaSeedling, FaTruck, FaUndo } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import axios from '../api/axiosInstance'

// Import assets for best sellers
import haworthiaImg from '../assets/Haworthia.jpg'
import crassulaImg from '../assets/Crassula Ovata Green Succulent.jpg'
import palmImg from '../assets/Indoors_ Discover the Timeless Elegance of the Parlor Palm.jpg'
import peaceLilyImg from '../assets/Peace Lily (Spathiphyllum).jpg'

// Import assets for indoor plants
import anthuriumImg from '../assets/Anthurium.png'
import birdOfParadiseImg from '../assets/BIRD OF PARADISE (1).jpg'
import rubberPlantImg from '../assets/_dark leaf rubber plant (ficus elastica) - indoor decorative tree_.jpg'
import snakePlantImg from '../assets/Golden Hahnii Snake Plant Seeds Sansevieria Birds Nest.jpg'

// Import assets for fruit plants
import allTimeMangoImg from '../assets/alltimemango.jpg'
import kesarMangoImg from '../assets/mangokesar.jpg'
import avocadoImg from '../assets/From Seed to Tree_ The Beauty of Home-Grown Organic Avocado.jpg'
import jackfruitImg from '../assets/jackfruit.jpg'
import corporateGiftImg from '../assets/corporategift.png'

// Import assets for bonsai plants
import bonsai1 from '../assets/BONSAIPLANTS/image.png'
import bonsai2 from '../assets/BONSAIPLANTS/image copy.png'
import bonsai3 from '../assets/BONSAIPLANTS/image copy 2.png'
import bonsai4 from '../assets/BONSAIPLANTS/image copy 3.png'
import bonsai5 from '../assets/BONSAIPLANTS/image copy 4.png'
const mockBonsaiProducts = [
  {
    _id: 'mock-bonsai-1',
    name: 'Grafted Ficus Bonsai',
    price: 1299,
    salePrice: 999,
    images: [bonsai1],
    averageRating: 4.8,
    category: { name: 'Bonsai Plants' },
    slug: 'grafted-ficus-bonsai',
    inStock: true
  },
  {
    _id: 'mock-bonsai-2',
    name: 'Fukien Tea Bonsai',
    price: 1499,
    salePrice: 1199,
    images: [bonsai2],
    averageRating: 4.6,
    category: { name: 'Bonsai Plants' },
    slug: 'fukien-tea-bonsai',
    inStock: true
  },
  {
    _id: 'mock-bonsai-3',
    name: 'Jade Succulent Bonsai',
    price: 899,
    salePrice: 699,
    images: [bonsai3],
    averageRating: 4.7,
    category: { name: 'Bonsai Plants' },
    slug: 'jade-succulent-bonsai',
    inStock: true
  },
  {
    _id: 'mock-bonsai-4',
    name: 'Chinese Elm Bonsai',
    price: 1899,
    salePrice: 1599,
    images: [bonsai4],
    averageRating: 4.9,
    category: { name: 'Bonsai Plants' },
    slug: 'chinese-elm-bonsai',
    inStock: true
  }
];

function Home() {
  const { addToCart } = useCart();

  const [dbBestSellers, setDbBestSellers] = useState([]);
  const [dbIndoorPlants, setDbIndoorPlants] = useState([]);
  const [dbBonsaiPlants] = useState(mockBonsaiProducts);
  const [dbFruitPlants, setDbFruitPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch bestsellers
        const bestSellersRes = await axios.get('/products/bestselling');
        if (bestSellersRes.data.success && bestSellersRes.data.products) {
          setDbBestSellers(bestSellersRes.data.products.slice(0, 4));
        }

        // Fetch all products to filter for categories (like before)
        const { data } = await axios.get('/products?activeOnly=true&limit=500');
        if (data.success && data.products) {
          const allProducts = data.products;

          const getDiscountPercent = (p) => {
            if (p.salePrice && p.salePrice < p.price) {
              return ((p.price - p.salePrice) / p.price) * 100;
            }
            return 0;
          };

          // Indoor Plants
          const isIndoorCategory = (category) => {
            if (!category) return false;
            const name = (category.name || '').toLowerCase();
            const slug = (category.slug || '').toLowerCase();
            return slug === 'indoor-plants' || name === 'indoor plants';
          };

          const indoorProducts = allProducts.filter(
            p => isIndoorCategory(p.category)
          );

          const sortedIndoor = [...indoorProducts].sort((a, b) => {
            // Prioritize items with discount
            const aHasDiscount = a.salePrice && a.salePrice < a.price;
            const bHasDiscount = b.salePrice && b.salePrice < b.price;
            if (bHasDiscount !== aHasDiscount) return bHasDiscount - aHasDiscount;
            if (b.averageRating !== a.averageRating) {
              return b.averageRating - a.averageRating;
            }
            return getDiscountPercent(b) - getDiscountPercent(a);
          });

          setDbIndoorPlants(sortedIndoor.slice(0, 4));

          // Fruit Plants
          const isFruitCategory = (category) => {
            if (!category) return false;
            const name = (category.name || '').toLowerCase();
            const slug = (category.slug || '').toLowerCase();
            return slug === 'fruit-plants' || name === 'fruit plants';
          };

          const fruitProducts = allProducts.filter(
            p => isFruitCategory(p.category)
          );

          const sortedFruit = [...fruitProducts].sort((a, b) => {
            // Prioritize items with discount
            const aHasDiscount = a.salePrice && a.salePrice < a.price;
            const bHasDiscount = b.salePrice && b.salePrice < b.price;
            if (bHasDiscount !== aHasDiscount) return bHasDiscount - aHasDiscount;
            if (b.averageRating !== a.averageRating) {
              return b.averageRating - a.averageRating;
            }
            return getDiscountPercent(b) - getDiscountPercent(a);
          });

          setDbFruitPlants(sortedFruit.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch products for sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <HeroCarousel />
      <CategorySection />

      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">BUY BEST SELLING PLANTS</h3>
          </div>

          <div className="product-grid">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="product-card-wrapper skeleton" style={{ minHeight: '350px' }}>
                  <div className="product-card" style={{ flexGrow: 1, backgroundColor: '#f6f7f8' }}>
                    <div className="product-card-image skeleton" style={{ height: '200px', backgroundColor: '#edeef1' }}></div>
                    <div className="product-card-content" style={{ padding: '15px' }}>
                      <div className="skeleton" style={{ height: '18px', width: '80%', backgroundColor: '#edeef1', marginBottom: '10px' }}></div>
                      <div className="skeleton" style={{ height: '14px', width: '50%', backgroundColor: '#edeef1' }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              dbBestSellers.map((product) => {
                const hasDiscount = product.salePrice && product.salePrice < product.price;
                const originalPrice = hasDiscount ? product.price : null;
                const displayPrice = hasDiscount ? product.salePrice : product.price;
                const discountText = hasDiscount ? `-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%` : null;
                const rating = product.averageRating || 5;
                const productImage = product.images && product.images[0] ? product.images[0].url : haworthiaImg;

                return (
                  <div key={product._id} className="product-card-wrapper">
                    <div className="product-card" style={{ flexGrow: 1 }}>
                      {discountText && (
                        <span className="card-badge sale">{discountText}</span>
                      )}

                      <div className="product-card-image">
                        <img src={productImage} alt={product.name} />
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
                      onClick={() => addToCart({ id: product._id, name: product.name, price: displayPrice, image: productImage })}
                      className="btn btn-primary"
                      style={{ borderRadius: '3px' }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="page-section alt-bg">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">BUY INDOOR PLANTS</h3>
            <Link
              to="/plants"
              className="section-header-link"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="product-grid">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="product-card-wrapper skeleton" style={{ minHeight: '350px' }}>
                  <div className="product-card" style={{ flexGrow: 1, backgroundColor: '#f6f7f8' }}>
                    <div className="product-card-image skeleton" style={{ height: '200px', backgroundColor: '#edeef1' }}></div>
                    <div className="product-card-content" style={{ padding: '15px' }}>
                      <div className="skeleton" style={{ height: '18px', width: '80%', backgroundColor: '#edeef1', marginBottom: '10px' }}></div>
                      <div className="skeleton" style={{ height: '14px', width: '50%', backgroundColor: '#edeef1' }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              dbIndoorPlants.map((product) => {
                const hasDiscount = product.salePrice && product.salePrice < product.price;
                const originalPrice = hasDiscount ? product.price : null;
                const displayPrice = hasDiscount ? product.salePrice : product.price;
                const discountText = hasDiscount ? `-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%` : null;
                const rating = product.averageRating || 5;
                const productImage = product.images && product.images[0] ? product.images[0].url : snakePlantImg;

                return (
                  <div key={product._id} className="product-card-wrapper">
                    <div className="product-card" style={{ flexGrow: 1 }}>
                      {discountText && (
                        <span className="card-badge sale">{discountText}</span>
                      )}

                      <div className="product-card-image">
                        <img src={productImage} alt={product.name} />
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
                      onClick={() => addToCart({ id: product._id, name: product.name, price: displayPrice, image: productImage })}
                      className="btn btn-primary"
                      style={{ borderRadius: '3px' }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <BringLifeSection />

      {/* Bonsai Plants Section */}
      <section className="page-section alt-bg border-t border-[var(--color-border)]">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">BUY BONSAI PLANTS</h3>
          </div>

          <div className="product-grid">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="product-card-wrapper skeleton" style={{ minHeight: '350px' }}>
                  <div className="product-card" style={{ flexGrow: 1, backgroundColor: '#f6f7f8' }}>
                    <div className="product-card-image skeleton" style={{ height: '200px', backgroundColor: '#edeef1' }}></div>
                    <div className="product-card-content" style={{ padding: '15px' }}>
                      <div className="skeleton" style={{ height: '18px', width: '80%', backgroundColor: '#edeef1', marginBottom: '10px' }}></div>
                      <div className="skeleton" style={{ height: '14px', width: '50%', backgroundColor: '#edeef1' }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              dbBonsaiPlants.map((product) => {
                const hasDiscount = product.salePrice && product.salePrice < product.price;
                const originalPrice = hasDiscount ? product.price : null;
                const displayPrice = hasDiscount ? product.salePrice : product.price;
                const discountText = hasDiscount ? `-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%` : null;
                const rating = product.averageRating || 5;
                const productImage = product.images && product.images[0] 
                  ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) 
                  : haworthiaImg;

                return (
                  <div key={product._id} className="product-card-wrapper">
                    <div className="product-card" style={{ flexGrow: 1 }}>
                      {discountText && (
                        <span className="card-badge sale">{discountText}</span>
                      )}

                      <div className="product-card-image">
                        <img src={productImage} alt={product.name} />
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
                      onClick={() => addToCart({ id: product._id, name: product.name, price: displayPrice, image: productImage })}
                      className="btn btn-primary"
                      style={{ borderRadius: '3px' }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Buy Fruit Plants Section (Changed to White shade background) */}
      <section className="page-section border-t border-[var(--color-border)]">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">BUY FRUIT PLANTS</h3>
            <Link
              to="/plants"
              className="section-header-link"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="product-grid">
            {loading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="product-card-wrapper skeleton" style={{ minHeight: '350px' }}>
                  <div className="product-card" style={{ flexGrow: 1, backgroundColor: '#f6f7f8' }}>
                    <div className="product-card-image skeleton" style={{ height: '200px', backgroundColor: '#edeef1' }}></div>
                    <div className="product-card-content" style={{ padding: '15px' }}>
                      <div className="skeleton" style={{ height: '18px', width: '80%', backgroundColor: '#edeef1', marginBottom: '10px' }}></div>
                      <div className="skeleton" style={{ height: '14px', width: '50%', backgroundColor: '#edeef1' }}></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              dbFruitPlants.map((product) => {
                const hasDiscount = product.salePrice && product.salePrice < product.price;
                const originalPrice = hasDiscount ? product.price : null;
                const displayPrice = hasDiscount ? product.salePrice : product.price;
                const discountText = hasDiscount ? `-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%` : null;
                const rating = product.averageRating || 5;
                const productImage = product.images && product.images[0] ? product.images[0].url : kesarMangoImg;

                return (
                  <div key={product._id} className="product-card-wrapper">
                    <div className="product-card" style={{ flexGrow: 1 }}>
                      {discountText && (
                        <span className="card-badge sale">{discountText}</span>
                      )}

                      <div className="product-card-image">
                        <img src={productImage} alt={product.name} />
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
                      onClick={() => addToCart({ id: product._id, name: product.name, price: displayPrice, image: productImage })}
                      className="btn btn-primary"
                      style={{ borderRadius: '3px' }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="page-section soil-nourish-section">
        <div className="container">
          <div className="soil-content-wrapper">
            <span className="soil-tag">100% Organic</span>
            <h2 className="soil-title">NOURISH YOUR SOIL</h2>
            <h3 className="soil-subtitle">Grow Naturally</h3>
            <p className="soil-description">
              Give your plants the perfect foundation with our premium organic fertilizers.
              Rich in essential nutrients, they promote deep root development and help your
              garden thrive naturally without chemical additives.
            </p>
            <div className="soil-actions">
              <Link to="/plants" className="btn btn-primary">
                SHOP ORGANIC FERTILIZERS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section border-t border-[var(--color-border)]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="w-full flex justify-start">
              <img
                src={corporateGiftImg}
                alt="Corporate Plant Gifts"
                className="w-full max-w-[540px] h-auto object-cover rounded-[3px] shadow-sm"
              />
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="font-[var(--font-family-heading)] text-[var(--font-size-xs)] font-bold corporate-tag tracking-[2px] uppercase mb-2">
                GREEN GIFTS
              </span>
              <h2 className="font-[var(--font-family-heading)] text-3xl md:text-[40px] font-normal leading-tight text-[var(--color-primary-dark)] mb-4 uppercase corporate-title">
                CORPORATE PLANT GIFTS
              </h2>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed mb-6 w-full corporate-description">
                Make a lasting impression with our curated selection of premium corporate plant gifts, perfect for employees, clients, and corporate events. We offer fully customizable solutions, allowing you to showcase your brand by printing your logo on pots, customizing gift cards, and designing tailored eco-friendly packaging. Whether it is for onboarding, festivals, milestones, or appreciation, book now to bring the goodness of nature to your workspace and professional relationships.
              </p>
              <div className="w-full md:w-auto" style={{ marginTop: '20px' }}>
                <Link to="/contact" className="btn btn-primary w-full md:w-auto px-8">
                  SEND ENQUIRY
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section alt-bg flex items-center justify-center" style={{ minHeight: '440px' }}>
        <div className="container flex flex-col items-center justify-center text-center">
          <h2
            className="font-[var(--font-family-heading)] text-3xl md:text-4xl font-normal text-[var(--color-primary-dark)] uppercase why-planters-title"
            style={{ marginTop: '0px', marginBottom: '24px', paddingTop: '10px', paddingBottom: '10px' }}
          >
            WHY PLANTERS AGRO VALLEY?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-5xl justify-items-center justify-center mx-auto">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center px-4 w-full">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e8f2ec] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl mb-5 shadow-sm">
                <FaSeedling />
              </div>
              <h4 className="font-[var(--font-family-heading)] text-lg font-semibold feature-title mb-2">
                Unbeatable Quality
              </h4>
              <p className="font-[var(--font-family-base)] text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                We sell quality garden products at the very best prices.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e8f2ec] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl mb-5 shadow-sm">
                <FaTruck />
              </div>
              <h4 className="font-[var(--font-family-heading)] text-lg font-semibold feature-title mb-2">
                10 million+ plants delivered
              </h4>
              <p className="font-[var(--font-family-base)] text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                Greenery at your doorstep, everywhere in India.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e8f2ec] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl mb-5 shadow-sm">
                <FaUndo />
              </div>
              <h4 className="font-[var(--font-family-heading)] text-lg font-semibold feature-title mb-2">
                Free Replacements
              </h4>
              <p className="font-[var(--font-family-base)] text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs">
                In case of damage, we will provide a free replacement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home


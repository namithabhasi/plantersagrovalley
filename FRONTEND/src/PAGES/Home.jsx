import React from 'react'
import { Link } from 'react-router-dom'
import HeroCarousel from '../COMPONENTS/HeroCarousel'
import CategorySection from '../COMPONENTS/CategorySection'
import { FaStar, FaSeedling, FaTruck, FaUndo } from 'react-icons/fa'

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

const bestSellers = [
  {
    id: 1,
    name: 'Haworthia Attenuata Succulent Plant',
    image: haworthiaImg,
    price: 299,
    originalPrice: null,
    discount: null,
    rating: null
  },
  {
    id: 2,
    name: 'Crassula Ovata Plant',
    image: crassulaImg,
    price: 199,
    originalPrice: 399,
    discount: '-51%',
    rating: 4
  },
  {
    id: 3,
    name: 'Areca Palm Plant - Indoor Air Purifier Plant',
    image: palmImg,
    price: 299,
    originalPrice: 349,
    discount: '-15%',
    rating: 5
  },
  {
    id: 4,
    name: 'Peace Lily Plant - Spathiphyllum',
    image: peaceLilyImg,
    price: 299,
    originalPrice: 449,
    discount: '-34%',
    rating: 4
  }
]

const indoorPlants = [
  {
    id: 1,
    name: 'Anthurium Red Plant - Tailflower Plant | Laceleaf',
    image: anthuriumImg,
    price: 599,
    originalPrice: 1199,
    discount: '-51%',
    rating: 5
  },
  {
    id: 2,
    name: 'Bird of Paradise Plant - Crane Flower Plant',
    image: birdOfParadiseImg,
    price: 349,
    originalPrice: 599,
    discount: '-42%',
    rating: 4
  },
  {
    id: 3,
    name: 'Rubber Plant - Ficus Elastica',
    image: rubberPlantImg,
    price: 499,
    originalPrice: 599,
    discount: '-17%',
    rating: 5
  },
  {
    id: 4,
    name: 'Sansevieria Golden Long - Snake Plant',
    image: snakePlantImg,
    price: 449,
    originalPrice: 799,
    discount: '-44%',
    rating: 4
  }
]

const fruitPlants = [
  {
    id: 1,
    name: 'All Time Mango Plant - Grafted',
    image: allTimeMangoImg,
    price: 399,
    originalPrice: 599,
    discount: '-33%',
    rating: 5
  },
  {
    id: 2,
    name: 'Kesar Mango Plant - Grafted',
    image: kesarMangoImg,
    price: 299,
    originalPrice: 499,
    discount: '-40%',
    rating: 4
  },
  {
    id: 3,
    name: 'Avocado Plant - Organic',
    image: avocadoImg,
    price: 499,
    originalPrice: 899,
    discount: '-44%',
    rating: 5
  },
  {
    id: 4,
    name: 'Jackfruit Plant - Grafted',
    image: jackfruitImg,
    price: 299,
    originalPrice: 399,
    discount: '-25%',
    rating: 4
  }
]

function Home() {
  return (
    <div>
      <HeroCarousel />
      <CategorySection />

      <section className="best-selling-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">BUY BEST SELLING PLANTS</h3>
          </div>

          <div className="product-grid">
            {bestSellers.map((product) => (
              <div key={product.id} className="product-card-wrapper">
                <div className="product-card" style={{ flexGrow: 1 }}>
                  {product.discount && (
                    <span className="card-badge sale">{product.discount}</span>
                  )}

                  <div className="product-card-image">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="product-card-content">
                    <h4 className="product-title" title={product.name}>
                      {product.name}
                    </h4>

                    <div className="product-price-row" style={{ marginTop: 'auto', marginBottom: 'var(--space-2)' }}>
                      {product.originalPrice ? (
                        <>
                          <span className="price-original">Rs. {product.originalPrice}.00</span>
                          <span className="price-current sale">Rs. {product.price}.00</span>
                        </>
                      ) : (
                        <span className="price-current">Rs. {product.price}.00</span>
                      )}
                    </div>

                    {/* Rating Stars - render gold and grey stars to match mockup */}
                    <div className="product-rating" style={{ marginBottom: 0, minHeight: '18px' }}>
                      {product.rating ? (
                        [...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < product.rating ? 'var(--color-gold)' : '#e2e8f0'}
                            size={14}
                          />
                        ))
                      ) : (
                        // Empty placeholder to maintain uniform alignment
                        <div style={{ height: '14px' }}></div>
                      )}
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ borderRadius: '3px' }}>
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="best-selling-section alt-bg py-16 md:py-20 min-h-[480px] md:min-h-[520px] flex items-center">
        <div className="container w-full">
          <div className="section-header" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h3 className="section-title">BUY INDOOR PLANTS</h3>
            <Link
              to="/plants"
              className="navbar-link"
              style={{
                position: 'absolute',
                right: 0,
                fontSize: 'var(--font-size-sm)',
                letterSpacing: '1.5px',
                color: 'var(--color-primary-dark)',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--color-primary-dark)',
                paddingBottom: '2px'
              }}
            >
              View All &rarr;
            </Link>
          </div>

          <div className="product-grid">
            {indoorPlants.map((product) => (
              <div key={product.id} className="product-card-wrapper">
                <div className="product-card" style={{ flexGrow: 1 }}>
                  {product.discount && (
                    <span className="card-badge sale">{product.discount}</span>
                  )}

                  <div className="product-card-image">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="product-card-content">
                    <h4 className="product-title" title={product.name}>
                      {product.name}
                    </h4>

                    <div className="product-price-row" style={{ marginTop: 'auto', marginBottom: 'var(--space-2)' }}>
                      {product.originalPrice ? (
                        <>
                          <span className="price-original">Rs. {product.originalPrice}.00</span>
                          <span className="price-current sale">Rs. {product.price}.00</span>
                        </>
                      ) : (
                        <span className="price-current">Rs. {product.price}.00</span>
                      )}
                    </div>

                    {/* Rating Stars - render gold and grey stars to match mockup */}
                    <div className="product-rating" style={{ marginBottom: 0, minHeight: '18px' }}>
                      {product.rating ? (
                        [...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < product.rating ? 'var(--color-gold)' : '#e2e8f0'}
                            size={14}
                          />
                        ))
                      ) : (
                        // Empty placeholder to maintain uniform alignment
                        <div style={{ height: '14px' }}></div>
                      )}
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ borderRadius: '3px' }}>
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="best-selling-section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-10)' }}>
        <div className="container">
          <div className="section-header" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h3 className="section-title">BUY FRUIT PLANTS</h3>
            <Link
              to="/plants"
              className="navbar-link"
              style={{
                position: 'absolute',
                right: 0,
                fontSize: 'var(--font-size-sm)',
                letterSpacing: '1.5px',
                color: 'var(--color-primary-dark)',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--color-primary-dark)',
                paddingBottom: '2px'
              }}
            >
              View All &rarr;
            </Link>
          </div>

          <div className="product-grid">
            {fruitPlants.map((product) => (
              <div key={product.id} className="product-card-wrapper">
                <div className="product-card" style={{ flexGrow: 1 }}>
                  {product.discount && (
                    <span className="card-badge sale">{product.discount}</span>
                  )}

                  <div className="product-card-image">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <div className="product-card-content">
                    <h4 className="product-title" title={product.name}>
                      {product.name}
                    </h4>

                    <div className="product-price-row" style={{ marginTop: 'auto', marginBottom: 'var(--space-2)' }}>
                      {product.originalPrice ? (
                        <>
                          <span className="price-original">Rs. {product.originalPrice}.00</span>
                          <span className="price-current sale">Rs. {product.price}.00</span>
                        </>
                      ) : (
                        <span className="price-current">Rs. {product.price}.00</span>
                      )}
                    </div>

                    {/* Rating Stars - render gold and grey stars to match mockup */}
                    <div className="product-rating" style={{ marginBottom: 0, minHeight: '18px' }}>
                      {product.rating ? (
                        [...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < product.rating ? 'var(--color-gold)' : '#e2e8f0'}
                            size={14}
                          />
                        ))
                      ) : (
                        // Empty placeholder to maintain uniform alignment
                        <div style={{ height: '14px' }}></div>
                      )}
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ borderRadius: '3px' }}>
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="soil-nourish-section">
        <div className="container">
          <div className="soil-content-wrapper">
            <span className="soil-tag">100% Organic</span>
            <h2 className="soil-title">Nourish Your Soil</h2>
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

      <section className="py-16 md:py-20 min-h-[480px] md:min-h-[520px] flex items-center border-t border-[var(--color-border)] bg-[var(--color-bg-main)]">
        <div className="container w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="w-full flex justify-center">
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
              <h2 className="font-[var(--font-family-heading)] text-3xl md:text-[40px] font-normal leading-tight text-[var(--color-primary-dark)] mb-4">
                Corporate Plant Gifts
              </h2>
              <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed mb-6 max-w-lg">
                Stand out with corporate plant gifts for employees and clients.
                Customize gift plants with your logo on pots, cards, and packaging.
                Book now for meaningful green gifting!
              </p>
              <div className="w-full md:w-auto mt-8">
                <Link to="/contact" className="btn btn-primary w-full md:w-auto px-8">
                  SEND ENQUIRY
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 py-20 md:py-28 bg-[var(--color-primary-bg)]">
        <div className="container text-center">
          <h2 className="font-[var(--font-family-heading)] text-3xl md:text-4xl font-normal text-[var(--color-primary-dark)] mt-4 mb-16">
            Why Planters Agro Valley?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="w-16 h-16 rounded-full bg-[#f3f8f3] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl mb-4">
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
              <div className="w-16 h-16 rounded-full bg-[#f3f8f3] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl mb-4">
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
              <div className="w-16 h-16 rounded-full bg-[#f3f8f3] flex items-center justify-center text-[var(--color-primary-dark)] text-2xl mb-4">
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
  )
}

export default Home


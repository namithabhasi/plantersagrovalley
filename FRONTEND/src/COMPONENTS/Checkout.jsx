import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

// Import recommendation assets
import gardenToolImg from '../assets/garden_tool_set.png';
import luckyBamboo4Img from '../assets/lucky_bamboo_4_layer.png';
import luckyBamboo3Img from '../assets/lucky_bamboo_3_layer.png';
import luckyBamboo2Img from '../assets/lucky_bamboo_2_layer.png';

const RECOMMENDATIONS = [
  {
    id: 'rec-1',
    name: 'Garden Tool Set of 4',
    price: 549,
    originalPrice: null,
    image: gardenToolImg,
  },
  {
    id: 'rec-2',
    name: '4 Layer Lucky Bamboo in Transparent plastic Bowl',
    price: 949,
    originalPrice: 1299,
    image: luckyBamboo4Img,
  },
  {
    id: 'rec-3',
    name: '3 Layer Braided Lucky Bamboo',
    price: 1049,
    originalPrice: null,
    image: luckyBamboo3Img,
  },
  {
    id: 'rec-4',
    name: '2 Layer Lucky Bamboo plant',
    price: 249,
    originalPrice: null,
    image: luckyBamboo2Img,
  },
];

const FREE_SHIPPING_THRESHOLD = 350;

function Checkout() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
  } = useCart();

  const navigate = useNavigate();

  // Calculate amount remaining for free shipping
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Close when clicking the overlay backdrop
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('cart-drawer-overlay')) {
      closeCart();
    }
  };

  const renderRecommendations = (isMobile) => {
    return (
      <div className={isMobile ? "cart-recommendations-mobile" : "cart-recommendations-desktop"}>
        <h3 className="cart-section-title">You May Also Like</h3>
        
        <div className="recommendations-list">
          {RECOMMENDATIONS.map((product) => (
            <div key={product.id} className="recommend-item-card">
              <img
                src={product.image}
                alt={product.name}
                className="recommend-item-img"
              />
              <div className="recommend-item-info">
                <h4 className="recommend-item-title">{product.name}</h4>
                <div className="recommend-item-prices">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                      <span className="recommend-item-price-original">
                        Rs. {product.originalPrice.toFixed(2)}
                      </span>
                      <span className="recommend-item-price-current sale">
                        Rs. {product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="recommend-item-price-current">
                      Rs. {product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  className="recommend-add-link"
                  style={{ border: 'none', background: 'transparent', padding: 0 }}
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                    })
                  }
                >
                  Add to Cart <FiArrowRight size={12} style={{ display: 'inline' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="cart-drawer-panel">
        
        {/* Desktop Recommendations (Left Pane) */}
        {renderRecommendations(false)}

        {/* Right Column: CART SUMMARY */}
        <div className="cart-summary-section">
          
          {/* Header */}
          <div className="cart-summary-header">
            <h3 className="cart-section-title" style={{ marginBottom: 0 }}>Cart</h3>
            <button
              onClick={closeCart}
              className="cart-close-btn"
              aria-label="Close Cart"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Shipping notice & Progress bar */}
          <div className="cart-shipping-info">
            {amountToFreeShipping > 0 ? (
              <p className="cart-shipping-notice">
                Spend <strong>Rs. {amountToFreeShipping.toFixed(2)}</strong> more to reach free shipping
              </p>
            ) : (
              <p className="cart-shipping-notice" style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                Congratulations! You've unlocked free shipping.
              </p>
            )}
            <div className="cart-shipping-progress-bg">
              <div
                className={`cart-shipping-progress-fill ${amountToFreeShipping === 0 ? 'free' : ''}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Cart items list (scrollable container) */}
          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <div className="cart-empty-message">
                <FiShoppingBag size={40} />
                <p className="cart-empty-text">Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={`${item.id}-${item.name}`} className="cart-item-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name}</h4>
                    
                    {/* Quantity controls */}
                    <div className="cart-qty-selector">
                      <button
                        onClick={() => updateQuantity(item.id, item.name, item.quantity - 1)}
                        className="cart-qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.name, item.quantity + 1)}
                        className="cart-qty-btn"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <span className="cart-item-price">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id, item.name)}
                      className="cart-item-delete"
                      aria-label="Delete item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Mobile Recommendations (stacks inside the scrollable view on mobile) */}
            {renderRecommendations(true)}
          </div>

          {/* Cart Footer */}
          <div className="cart-footer-panel">
            <div className="cart-subtotal-row">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-price">Rs. {cartSubtotal.toFixed(2)}</span>
            </div>
            
            <p className="cart-tax-info">
              Taxes, discounts and shipping calculated at checkout
            </p>

            <div className="cart-action-buttons">
              <button
                onClick={() => {
                  closeCart();
                  navigate('/payment');
                }}
                className="btn btn-primary"
                style={{ flexGrow: 1, borderRadius: '3px' }}
              >
                CHECK OUT
              </button>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/');
                }}
                className="btn btn-outline-primary"
                style={{ flexGrow: 1, borderRadius: '3px' }}
              >
                VIEW CART
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;

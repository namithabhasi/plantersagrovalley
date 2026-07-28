import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import './Cart.css';

function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal 
  } = useCart();
  const navigate = useNavigate();

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="container cart-page-container empty-state">
          <div className="cart-empty-message-wrapper">
            <FiShoppingBag size={64} className="cart-empty-icon" />
            <h2 className="cart-page-title">Your cart is empty</h2>
            <p className="cart-empty-subtitle">Add some green friends to your space!</p>
            <button onClick={() => navigate('/')} className="btn btn-primary cart-empty-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <div className="container cart-page-container">
        
        {/* Header */}
        <div className="cart-page-header">
          <h1 className="cart-page-title">Cart</h1>
          <Link to="/" className="cart-return-shop-link">
            Return to shop
          </Link>
        </div>

        {/* Table Content */}
        <div className="cart-table-wrapper">
          {/* Desktop Table View */}
          <table className="cart-table-desktop">
            <thead>
              <tr>
                <th className="th-product">PRODUCT</th>
                <th className="th-price">PRICE</th>
                <th className="th-qty">QUANTITY</th>
                <th className="th-total">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={`${item.id}-${item.name}`}>
                  <td className="td-product">
                    <div className="cart-table-product-cell">
                      <img src={item.image} alt={item.name} className="cart-product-img" />
                      <span className="cart-product-name">{item.name}</span>
                    </div>
                  </td>
                  <td className="td-price">
                    <span className="cart-price-text">Rs. {item.price.toFixed(2)}</span>
                  </td>
                  <td className="td-qty">
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
                  </td>
                  <td className="td-total">
                    <div className="cart-total-cell-wrap">
                      <span className="cart-total-price">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id, item.name)}
                        className="cart-delete-item-btn"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Stacking List View */}
          <div className="cart-list-mobile">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.name}`} className="cart-mobile-row-card">
                <img src={item.image} alt={item.name} className="cart-mobile-product-img" />
                <div className="cart-mobile-info-wrap">
                  <div className="cart-mobile-title-row">
                    <span className="cart-mobile-product-name">{item.name}</span>
                    <button
                      onClick={() => removeFromCart(item.id, item.name)}
                      className="cart-delete-item-btn"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="cart-mobile-price-row">
                    <span className="cart-mobile-label">Price:</span>
                    <span>Rs. {item.price.toFixed(2)}</span>
                  </div>
                  <div className="cart-mobile-qty-row">
                    <span className="cart-mobile-label">Quantity:</span>
                    <div className="cart-qty-selector">
                      <button
                        onClick={() => updateQuantity(item.id, item.name, item.quantity - 1)}
                        className="cart-qty-btn"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="cart-qty-val">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.name, item.quantity + 1)}
                        className="cart-qty-btn"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-mobile-total-row">
                    <span className="cart-mobile-label">Total:</span>
                    <span className="cart-mobile-total-val">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Notes & Subtotal Checkout block */}
        <div className="cart-page-footer-summary">
          <div className="cart-summary-notes">
            <label htmlFor="cartNotes" className="cart-notes-label">Add a note to your order (optional)</label>
            <textarea 
              id="cartNotes" 
              placeholder="Special instructions for seller..." 
              rows="3" 
              className="checkout-input"
              style={{ resize: 'none' }}
            ></textarea>
          </div>
          
          <div className="cart-summary-checkout-block">
            <div className="cart-summary-subtotal-row">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-value">Rs. {cartSubtotal.toFixed(2)}</span>
            </div>
            <p className="cart-shipping-tax-notice">
              Taxes and shipping calculated at checkout
            </p>
            <button
              onClick={() => navigate('/payment')}
              className="btn btn-primary cart-checkout-action-btn"
            >
              Check Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;

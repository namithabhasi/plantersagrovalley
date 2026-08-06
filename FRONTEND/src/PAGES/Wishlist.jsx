import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { useSelector } from 'react-redux';
import haworthiaImg from '../assets/Haworthia.jpg';

function Wishlist() {
  const { user } = useSelector((state) => state.auth);
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/wishlist');
      if (data.success && data.wishlist) {
        setWishlistItems(data.wishlist.products || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      const { data } = await axios.delete(`/wishlist/${productId}`);
      if (data.success) {
        toast.success('Item removed from wishlist');
        setWishlistItems(data.wishlist.products || []);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item.');
    }
  };

  const handleAddToCart = (product) => {
    const productImage = product.images && product.images[0] ? product.images[0].url : haworthiaImg;
    const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

    addToCart({
      id: product._id,
      name: product.name,
      price: price,
      image: productImage
    });
    toast.success(`${product.name} added to cart!`);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <FiHeart size={30} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
        <p className="text-gray-500 mb-4 max-w-sm">Please log in to view your wishlist.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#06492D]"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fcfdfc] py-12 px-4 sm:px-6 lg:px-8 font-[var(--font-family-base)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#06492D] mb-8 font-[var(--font-family-heading)]">My Wishlist</h2>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-[#06492d05] text-[#06492D] rounded-full flex items-center justify-center mb-6">
              <FiHeart size={36} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              Save your favorite items here to purchase them later. Discover beautiful plants now!
            </p>
            <Link
              to="/plants"
              className="px-6 py-2.5 bg-[#06492D] text-white text-xs font-semibold rounded hover:bg-[#0b633e] transition-all flex items-center gap-2 border-none"
            >
              <span>Explore Plants</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => {
              const hasDiscount = product.salePrice && product.salePrice < product.price;
              const displayPrice = hasDiscount ? product.salePrice : product.price;
              const originalPrice = hasDiscount ? product.price : null;
              const discountText = hasDiscount ? `-${Math.round(((product.price - product.salePrice) / product.price) * 100)}%` : null;
              const rating = product.averageRating || 5;
              const productImage = product.images && product.images[0] ? product.images[0].url : haworthiaImg;

              return (
                <div key={product._id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow relative">
                  {discountText && (
                    <span className="absolute top-3 left-3 bg-[#06492D] text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                      {discountText}
                    </span>
                  )}

                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 p-1.5 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full border border-gray-100 shadow-sm z-10 transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={14} />
                  </button>

                  <Link to={`/product/${product._id}`} className="block h-48 overflow-hidden bg-gray-50">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <Link to={`/product/${product._id}`} className="text-sm font-semibold text-gray-800 hover:text-[#06492D] line-clamp-2 min-h-[40px] mb-2">
                      {product.name}
                    </Link>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          color={i < rating ? '#ECC94B' : '#E2E8F0'}
                          size={12}
                        />
                      ))}
                    </div>

                    <div className="flex items-baseline gap-2 mt-auto mb-4">
                      <span className="text-sm font-bold text-gray-900">Rs. {displayPrice}.00</span>
                      {originalPrice && (
                        <span className="text-xs text-gray-400 line-through">Rs. {originalPrice}.00</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full py-2 bg-[#06492D] text-white text-xs font-semibold rounded hover:bg-[#0b633e] transition-colors flex items-center justify-center gap-2 border-none cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <FiShoppingCart size={13} />
                      <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;

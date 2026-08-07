import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowRight, FiShare2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";
import haworthiaImg from "../assets/Haworthia.jpg";

function Wishlist() {
  const { user } = useSelector((state) => state.auth);
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/wishlist");
      if (data.success && data.wishlist) {
        setWishlistItems(data.wishlist.products || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist items.");
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
        toast.success("Item removed from wishlist");
        const updated = data.wishlist.products || [];
        setWishlistItems(updated);
        // Adjust pagination if page becomes empty
        const maxPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > maxPages && maxPages > 0) {
          setCurrentPage(maxPages);
        }
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove item.");
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

  const handleShareWhatsApp = (product) => {
    const productUrl = `${window.location.origin}/product/${product._id}`;
    const message = `Check out ${product.name} on Planters Agro Valley: ${productUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-bg)]">
        <section className="page-section !bg-[var(--color-primary-bg)]">
          <div className="container flex justify-center">
            <div className="w-full max-w-[800px] flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-none flex items-center justify-center text-gray-400 mb-4">
                <FiHeart size={30} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
              <p className="text-gray-500 mb-4 max-w-sm">Please log in to view your wishlist.</p>
              <Link
                to="/signin"
                className="btn btn-primary rounded-none"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center">
        <div className="animate-spin rounded-none h-10 w-10 border-b-2 border-[#06492D]"></div>
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWishlistItems = wishlistItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)]">
      <section className="page-section !bg-[var(--color-primary-bg)]">
        <div className="container flex justify-center">
          <div className="w-full max-w-[800px] flex flex-col gap-6">

            {/* Page Header (No Line Divider) */}
            {wishlistItems.length > 0 && (
              <div className="pb-2 text-left">
                <h2 className="text-3xl font-[var(--font-family-heading)] font-normal text-[var(--color-primary-dark)] uppercase tracking-wide">
                  My Wishlist
                </h2>
                <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] font-normal mt-1 tracking-wider">
                  {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved in your wishlist
                </p>
              </div>
            )}

            {/* Wishlist Content / Empty State */}
            {wishlistItems.length === 0 ? (
              <div style={{ padding: "20px" }} className="bg-white p-12 text-center flex flex-col items-center justify-center">
                <div className="w-30 h-20 bg-green-50 text-[#06492D] rounded-none flex items-center justify-center mb-4">
                  <img src="https://cdn.pixabay.com/animation/2023/08/21/15/08/15-08-12-734_512.gif" alt="Empty Wishlist" />
                </div>
                <h3 style={{ marginTop: "20px", marginBottom: "10px" }} className="text-lg font-bold text-gray-800 mb-2">
                  Your wishlist is empty
                </h3>
                <p style={{ marginTop: "5px", marginBottom: "5px" }} className="text-sm text-gray-700 max-w-sm mb-6">
                  Save your favorite plants and garden decor items here to purchase later.
                </p>
                <Link
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                  to="/plants"
                  className="btn btn-primary rounded-none"
                >
                  <span>Explore Plants</span>
                  <FiArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {currentWishlistItems.map((product) => {
                  const hasDiscount = product.salePrice && product.salePrice < product.price;
                  const displayPrice = hasDiscount ? product.salePrice : product.price;
                  const originalPrice = hasDiscount ? product.price : null;
                  const rating = product.averageRating || 5;
                  const productImage = product.images && product.images[0] ? product.images[0].url : haworthiaImg;
                  const addedDate = new Date(product.createdAt || Date.now()).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  });

                  // Dynamic Stock Evaluation
                  const isOutOfStock =
                    product.inStock === false ||
                    product.isOutOfStock === true ||
                    (product.countInStock !== undefined && product.countInStock <= 0) ||
                    (product.stock !== undefined && product.stock <= 0);

                  return (
                    <div
                      key={product._id}
                      className="bg-white hover:bg-white rounded-none border border-gray-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/product/${product._id}`}
                        className="w-32 h-32 sm:w-36 sm:h-36 rounded-none overflow-hidden bg-white p-2 border border-gray-100 shrink-0 flex items-center justify-center group"
                      >
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-none"
                        />
                      </Link>

                      {/* Product Details & Action Buttons */}
                      <div style={{ padding: "10px" }} className="flex-1 flex flex-col justify-start gap-1 w-full">
                        <div>
                          {/* Title */}
                          <Link
                            to={`/product/${product._id}`}
                            className="text-sm sm:text-base font-semibold text-[#06492D] hover:underline leading-snug line-clamp-2"
                          >
                            {product.name}
                          </Link>

                          {/* Category Subtitle */}
                          <p className="text-sm text-gray-900 mt-1">
                            by Planters Agro Valley ({product.category?.name || "Gardening"})
                          </p>

                          {/* Ratings */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  color={i < Math.floor(rating) ? "#f59e0b" : "#e5e7eb"}
                                  size={12}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500 font-medium">
                              {rating}.0
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-base font-bold text-gray-900">
                              Rs. {displayPrice}.00
                            </span>
                            {originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                Rs. {originalPrice}.00
                              </span>
                            )}
                          </div>

                          {/* Date Added */}
                          <p className="text-sm text-gray-900 mt-1">
                            Item added {addedDate}
                          </p>
                        </div>

                        {/* Action Buttons Row (No Top Border Line Divider) */}
                        <div style={{ marginTop: '10px', marginBottom: '10px' }} className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 pt-1">
                          {/* Dynamic Buy Now OR Out of Stock Button (Transparent BG, Larger Font) */}
                          {!isOutOfStock ? (
                            <Link
                              to={`/product/${product._id}`}
                              className="bg-transparent hover:bg-emerald-50 text-[#06492D] border-none rounded-none px-2 py-1 text-sm font-semibold flex items-center gap-1.5 transition-all text-decoration-none cursor-pointer"
                            >
                              <FiShoppingCart size={15} />
                              <span>Buy Now</span>
                            </Link>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 border border-gray-200 rounded-none px-3 py-1 text-sm font-medium flex items-center gap-1.5 select-none">
                              Out of Stock
                            </span>
                          )}

                          {/* Share on WhatsApp Button (No Border, Larger Font) */}
                          <button
                            onClick={() => handleShareWhatsApp(product)}
                            className="bg-transparent hover:bg-emerald-50 border-none text-[#06492D] rounded-none px-2 py-1 text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-none"
                            title="Share on WhatsApp"
                          >
                            <FiShare2 size={15} />
                            <span>Share</span>
                          </button>

                          {/* Delete Icon Button (No Border, Larger Icon Size) */}
                          <button
                            onClick={() => handleRemove(product._id)}
                            className="p-1 bg-transparent hover:bg-red-50 text-gray-400 hover:text-red-600 border-none rounded-none transition-colors cursor-pointer flex items-center justify-center"
                            title="Remove from wishlist"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-4">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-white border border-gray-300 rounded-none disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer text-gray-700"
                      title="Previous Page"
                    >
                      <FiChevronLeft size={16} />
                    </button>

                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-none border transition-all cursor-pointer ${isActive
                              ? "bg-[#06492D] text-white border-[#06492D]"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 bg-white border border-gray-300 rounded-none disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition cursor-pointer text-gray-700"
                      title="Next Page"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Wishlist;

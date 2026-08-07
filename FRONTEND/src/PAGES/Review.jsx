import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCamera, FiCheckCircle, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import haworthiaImg from '../assets/Haworthia.jpg';
import '../index.css';

function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.auth || {});

  const product = location.state?.product || {
    id: 'default',
    _id: 'default',
    name: "Wisteria Flowering Vine",
    image: haworthiaImg
  };

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // File Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size should be less than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        toast.success("Photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    const targetId = product._id || product.id || 'default';
    const userName = user?.name || 'Verified Customer';

    const newReviewObj = {
      id: Date.now(),
      productId: targetId,
      author: userName,
      avatar: userName.charAt(0).toUpperCase(),
      date: 'Today',
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
      photo: photo, // Data URL / Image URL
      size: 'Standard',
      color: 'Green',
      verified: true,
      likes: 0,
      helpfulText: null
    };

    // Save to LocalStorage so ProductDetails page displays it live
    try {
      const existingReviews = JSON.parse(localStorage.getItem('planters_custom_reviews') || '[]');
      const updatedReviews = [newReviewObj, ...existingReviews];
      localStorage.setItem('planters_custom_reviews', JSON.stringify(updatedReviews));
    } catch (err) {
      console.error("Error saving review to local storage:", err);
    }

    setSubmitted(true);
    toast.success('Thank you for submitting your review!');
    setTimeout(() => {
      navigate(-1);
    }, 1800);
  };

  const productImage = product.images && product.images[0] ? product.images[0].url : (product.image || haworthiaImg);

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <section className="page-section">
        <div className="container flex justify-center">
          <div className="w-full max-w-[800px] flex flex-col gap-8">
            
            {/* Back Navigation Button */}
            <div>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary-dark)] transition-colors cursor-pointer"
              >
                <FiArrowLeft size={18} />
                <span>Back to Product</span>
              </button>
            </div>

            {/* Page Header (Matching Shipping Policy Header style) */}
            <div className=" pb-5 flex items-center gap-5">
              <img
                src={productImage}
                alt={product.name}
                className="w-40 h-15 object-cover rounded-[3px] flex-shrink-0 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-xs"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-xl sm:text-2xl font-[var(--font-family-base)] font-bold text-[#06492D] uppercase tracking-wide">
                  HOW WAS THE ITEM?
                </h1>
                <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed font-medium tracking-wide">
                  {product.name}
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-16 px-6 bg-[var(--color-primary-bg)] rounded-[3px]  flex flex-col gap-4">
                <div className="w-16 h-16 bg-[#e8f5e9] text-[var(--color-primary-dark)] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <FiCheckCircle size={36} />
                </div>
                <h2 className="text-xl font-bold text-[var(--color-text-main)] uppercase tracking-wide">REVIEW SUBMITTED!</h2>
                <p className="font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-muted)] leading-relaxed">Your valuable feedback helps other plant lovers make informed choices.</p>
              </div>
            ) : (
              /* Content Body with Shipping Policy padding, gap, typography & dividers */
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed">

                {/* Overall Rating */}
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-[#06492D] font-[var(--font-family-base)] uppercase tracking-wide">
                    OVERALL RATING
                  </h3>
                  <div className="flex items-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="p-1 border-none bg-transparent cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                      >
                        <FaStar
                          size={32}
                          className={(hoverRating || rating) >= star ? 'text-[#f39c12]' : 'text-slate-200'}
                        />
                      </button>
                    ))}
                    <span className="ml-3 font-[var(--font-family-base)] text-[var(--font-size-md)] font-semibold text-[#f39c12]">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </section>

                <hr className="border-[var(--color-border)]" />

                {/* Write a review */}
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-[#06492D] font-[var(--font-family-base)] uppercase tracking-wide">
                    WRITE A REVIEW
                  </h3>
                  <textarea
                    required
                    rows={5}
                    placeholder="What should other customers know? Share your experience with quality, delivery, and care."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-[var(--color-border)] rounded-[3px] p-4 font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-light)] focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-1 focus:ring-[var(--color-primary-dark)] transition-colors leading-relaxed"
                  />
                </section>

                <hr className="border-[var(--color-border)]" />

                {/* Share a video or photo */}
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-[#06492D] font-[var(--font-family-base)] uppercase tracking-wide">
                    SHARE A VIDEO OR PHOTO
                  </h3>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {photo ? (
                    <div className="relative w-32 h-32 rounded-[3px] overflow-hidden border border-[var(--color-border)] group">
                      <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                        title="Remove photo"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary-dark)] rounded-[3px] p-6 text-center bg-[var(--color-primary-bg)] hover:bg-[#e8f5e9] transition-colors cursor-pointer flex flex-col items-center justify-center group"
                    >
                      <FiCamera size={32} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-dark)] mb-2 transition-colors" />
                      <span className="font-[var(--font-family-base)] text-[var(--font-size-md)] font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-primary-dark)] transition-colors">Click to upload photos or videos</span>
                      <span className="text-xs text-[var(--color-text-muted)] mt-1">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </section>

                <hr className="border-[var(--color-border)]" />

                {/* Title your review */}
                <section className="flex flex-col gap-3">
                  <h3 className="text-base font-bold text-[#06492D] font-[var(--font-family-base)] uppercase tracking-wide">
                    TITLE YOUR REVIEW (REQUIRED)
                  </h3>
                  <input
                    type="text"
                    required
                    placeholder="What's most important to know?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-[var(--color-border)] rounded-[3px] p-3.5 font-[var(--font-family-base)] text-[var(--font-size-md)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-light)] focus:outline-none focus:border-[var(--color-primary-dark)] focus:ring-1 focus:ring-[var(--color-primary-dark)] transition-colors"
                  />
                </section>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-8 py-3 text-sm uppercase tracking-wider font-bold cursor-pointer shadow-sm"
                  >
                    Submit Review
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}

export default Review;

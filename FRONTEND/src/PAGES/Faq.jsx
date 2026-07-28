import React, { useState } from 'react';
import faqHero from '../assets/Gardencare/FAQ_LEAVES.jpg';
import './Faq.css';

function Faq() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: 'payment',
      question: 'What are the payment options?',
      answer: 'We accept Online Payments by Debit Card, Credit Card, Net banking, UPI, and Bank Transfer. If you choose Bank Transfer as the Payment Options, Please call us on +91-8468888666 and confirm the same or send us an email on care@plantsguru.com with the payment details.'
    },
    {
      category: 'payment',
      question: 'How will I get my refund?',
      answer: 'If you have made an Online Payment the refund is made to your Credit Card, Debit Card or Net banking account. For other forms of Payment like Cash on Delivery or Bank Transfer we make the refund to your Bank Account.'
    },
    {
      category: 'payment',
      question: 'What details do you require for refund?',
      answer: "Your details which we require for refund process are Account Holder's Name, Bank Name, Branch Name, Account Number, IFSC Code. Refund of your amount would take 7-10 business days from the date of refund initiation and as per the transaction type."
    },
    {
      category: 'shipping',
      question: 'What if I get a damaged plant?',
      answer: 'Send us the photos of damaged plants through the registered email id to "care@plantsguru.com". Stickers with plant name, damaged parts of the plant, and stickers of Plantsguru must be clearly visible in a single photo. Please note that we deal in perishable items so torn leaves, dead flowers, and withered leaves will not fall in the condition of replacement. It is mandatory to share the images within 24 hrs after the delivery. In case of a damaged product, a replacement will be provided without returning the plant.'
    },
    {
      category: 'shipping',
      question: 'Can I cancel my order?',
      answer: 'Customer can cancel their order before dispatch, by writing a mail to "care@plantsguru.com" or he/she can call @8468888666 from 10:00 am to 6:00 PM (excluding Sundays and Holidays).'
    },
    {
      category: 'shipping',
      question: 'What if the plant dies in transit?',
      answer: 'We take all the precautions to make the plants deliver in safe and healthy condition. However, if the plants dry or damage in transit, we provide replacement without returning the plant.'
    },
    {
      category: 'shipping',
      question: 'How does replacement work?',
      answer: 'In such cases the customer has to inform us by writing a mail on care@plantsguru.com with pictures of the plants received. The replacement plant will be dispatched within the next three days.'
    },
    {
      category: 'care',
      question: 'Is flowering of the plant guaranteed?',
      answer: 'No, flowering of the plants depends on many factors like flowering season, weather, water etc. But the customer can inform us so that we can provide better treatment tips for blooming the flowers. For treatment tips, the customer has to write to us at care@plantsguru.com with pictures of the plant attached to the mail.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'payment', name: 'Payments & Refunds' },
    { id: 'shipping', name: 'Shipping & Damage' },
    { id: 'care', name: 'Plant Care' }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleAccordion = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="faq-page-wrapper">
      
      {/* FAQ HERO SECTION WITH LEAF BACKGROUND */}
      <section 
        className="faq-hero-section"
        style={{ backgroundImage: `url(${faqHero})` }}
      >
        <div className="faq-hero-content">
          <div className="faq-hero-title-badge">
            <h1 className="faq-hero-title">FAQ</h1>
          </div>
        </div>
      </section>

      {/* MAIN FAQ CONTENT (WRAPPED IN CONTAINER) */}
      <section className="faq-content-section">
        <div className="container faq-layout-container">
          
          {/* Left Side: Sidebar navigation filter tabs */}
          <div className="faq-sidebar">
            <h3 className="faq-sidebar-title">Categories</h3>
            <div className="faq-category-list">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenIndex(null);
                  }}
                  className={`faq-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Accordion Lists */}
          <div className="faq-accordion-container">
            <h2 className="faq-list-title">
              {categories.find(c => c.id === activeCategory)?.name}
            </h2>
            
            <div className="faq-accordion-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div 
                      key={index} 
                      className={`faq-accordion-item ${isOpen ? 'open' : ''}`}
                    >
                      <button 
                        onClick={() => toggleAccordion(index)}
                        className="faq-accordion-header"
                        aria-expanded={isOpen}
                      >
                        <span className="faq-question-text">{faq.question}</span>
                        <span className="faq-chevron-icon"></span>
                      </button>
                      
                      <div className="faq-accordion-content-wrapper">
                        <div className="faq-accordion-content">
                          <p className="faq-answer-text">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="faq-no-results">No questions found in this category.</p>
              )}
            </div>

            {/* Bottom Support Callout Card */}
            <div className="faq-support-card">
              <h3 className="faq-support-title">Can't find what you're looking for?</h3>
              <p className="faq-support-text">
                Send us an email to tell us what's up and someone from our Customer Service team will get back to you as soon as possible. Be sure to include your order number if you have one.
              </p>
              <a 
                href="mailto:care@plantsguru.com" 
                className="btn btn-primary faq-email-btn"
              >
                Email care@plantsguru.com
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Faq;

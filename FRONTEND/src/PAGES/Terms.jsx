import React, { useEffect } from 'react';

function Terms() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white py-12 font-[var(--font-family-base)] select-none">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        
        {/* Header Section - Centered */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[3px] text-[var(--color-primary)] font-semibold mb-2 block">
            Planters Agro Valley
          </span>
          <h1 className="text-4xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-tight">
            Terms & Conditions
          </h1>
          {/* Centered green divider line */}
          <span className="inline-block w-16 h-1 bg-[var(--color-primary)] mt-4 rounded-full"></span>
        </div>

        {/* Content Wrapper - Plain text layout, no background boxes, borders, or shadows */}
        <div className="space-y-8 select-text">
          
          <p className="text-lg text-gray-700 leading-relaxed font-light">
            Please read the following terms of service very carefully. www.plantersagrovalley.com is a product of Planters Agro Valley.
          </p>

          <hr className="border-gray-100" />

          {/* Section 1: User Agreement */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              1. Acceptance of Terms
            </h2>
            <ul className="space-y-4 text-gray-600 leading-relaxed font-light">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  You must read and agree to be bound by the Terms of Service, before using the Site or subscribing to any products or service made available through or on the Site, including the sale, supply, payment, delivery, return or rejection of the products or services made available on, through or in connection with this Site.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  If you placed an order and a plant is not available in stock, then we can hold your order until the plant is available in stock. Alternatively, you may choose to substitute the product with another item of the same price, or you can wait until the product is back in stock.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  By subscribing to or using the Site or the Services, you acknowledge that you have read, understood, and are bound by the Terms of Service, together with all related policies and guidelines of this Site that are incorporated by reference. If you do not agree to be bound by the Terms of Service, do not use or subscribe to the Site or the Products / Services.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  We, at our sole discretion, reserve the right to change, amend, or modify the Terms of Service at any time, without notifying you or assigning any reasons. You are responsible for regularly reviewing the Terms of Service.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  If you do not agree to any changes or updates to the Terms of Service, your remedy is to cease using the Site and cancel any accounts or Services you have signed up for. Your continued use of the Site or the Services after a change or update has been made to the Terms of Service will constitute your acceptance of such change or update.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  If you violate any Terms of Service, we may issue a warning about the violation, or we may choose, at our sole discretion, to immediately terminate or suspend any and all accounts that you have established, without assigning any reasons.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  You acknowledge that we are not required to provide you notice before terminating or suspending our Services, but may choose to do so. We reserve the right to deny, in our sole discretion, any user access to the Site or Services without notice and for any reason (including, without limitation, for violation of these Terms of Service).
                </span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Transaction Updates Policy */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              2. Transactional Communication & SMS Policy
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              Planters Agro Valley will send you transaction SMS updates on the mobile number you provided for order confirmation, shipping tracking, and order updates. By agreeing to these terms and conditions, you consent to receive transactional updates regarding your order, shipping, cancellations, and payment details.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              Planters Agro Valley will not send you promotional SMS. If you wish to receive promotional offers or wishlist updates, you can sign up for our newsletter on the homepage, and you will receive these details by email.
            </p>
            <p className="text-gray-700 font-medium text-sm mt-4">
              We only send SMS updates for the following transactional events:
            </p>
            <ul className="space-y-4 text-gray-600 leading-relaxed font-light mt-4">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>When you register on Planters Agro Valley.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>When you successfully purchase a product.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>When you cancel your order.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>When your order is shipped for delivery.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>When your payment is refunded.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Terms;

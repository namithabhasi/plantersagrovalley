import React, { useEffect } from 'react';

function Cancelandrefund() {
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
            Cancellation & Refund Policy
          </h1>
          {/* Centered green divider line */}
          <span className="inline-block w-16 h-1 bg-[var(--color-primary)] mt-4 rounded-full"></span>
        </div>

        {/* Content Wrapper - Plain text layout, no background boxes, borders, or shadows */}
        <div className="space-y-8 select-text">
          
          <p className="text-lg text-gray-700 leading-relaxed font-light">
            At Planters Agro Valley, we care about your satisfaction and always aim to deliver fresh, healthy, and high-quality products. However, we understand that there might be situations where you need a refund, replacement, or want to return a product. Below is our simple and clear policy:
          </p>

          <hr className="border-gray-100" />

          {/* Section 1: Eligible for Refund With Return */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              1. Eligible for Refund With Return
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              If the product is delivered and you:
            </p>
            <ul className="space-y-3 text-gray-600 leading-relaxed font-light pl-4">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>Do not like the product,</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>No longer want it, or</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>Ordered it by mistake.</span>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed font-light pt-2">
              You are still allowed to return it under the following conditions:
            </p>
            <ul className="space-y-4 text-gray-600 leading-relaxed font-light">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>The return request must be made within 7 days of delivery.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>The product must be unused and in the same condition as delivered.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>You must arrange and bear the return shipping charges yourself.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>You must share photos or a short video of the product and the packaging at the time of booking the return shipment, as proof of its unused and good condition.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  Send the product to: <strong className="font-normal text-gray-800">Planters Agro Valley - GAT No 589, Tamhane Vasti, Solapur - Pune Hwy, Theur Phata, Infront of Jijau Garden, Pune, Maharashtra, 412201</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>After we receive the product in acceptable and unused condition, we will initiate the refund.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>The refund may take up to 5 working days to reflect in your account.</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Eligible for Refund or Replacement Without Return */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              2. Eligible for Refund or Replacement Without Return
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              You qualify for a refund or a replacement without returning the product if:
            </p>
            <ul className="space-y-4 text-gray-600 leading-relaxed font-light">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>The product arrives damaged or defective.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>The product is not in usable condition due to transit damage.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>The wrong product is delivered. (Note: Slight variations in color, natural plant shape, or plants delivered without flowers are normal and are not considered wrong products.)</span>
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed font-light">
              Since our plants are perishable items, we do not ask for returns in such cases.
            </p>

            <h4 className="text-sm font-semibold text-gray-800 tracking-wide uppercase pt-4">
              Procedure for Replacement or Refund:
            </h4>
            <ul className="space-y-4 text-gray-600 leading-relaxed font-light">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  Send us photos of the damaged plants through your registered email ID to <a href="mailto:care@plantersagrovalley.com" className="text-[var(--color-primary)] hover:underline font-normal">care@plantersagrovalley.com</a>.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  Stickers with the plant name, damaged parts of the plant, and packaging labels of Planters Agro Valley must be clearly visible in a single photo. Please note that we deal in perishable items, so torn leaves, dead flowers, and withered leaves do not qualify for replacement. It is mandatory to share the images within 24 hours of delivery.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  In case you are unable to capture all details in a single photo, you must send us a short video capturing all the details (not more than 20 seconds).
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  After reviewing the relevant videos and photos, the Planters Agro Valley support team will decide whether the case qualifies for a refund or replacement. Our priority is to provide a replacement first. If the replacement is delivered damaged or dried again, we will initiate a full refund.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  Refunds take up to 5 working days to reflect back in the customer's payment account. In case the payment was completed via UPI, the refund will be credited to the default account linked to your UPI ID.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>The replacement process takes 10 working days, and replaced articles are delivered in 7-8 working days.</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: Order Cancellation */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              3. Order Cancellation
            </h2>
            <ul className="space-y-4 text-gray-600 leading-relaxed font-light">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  Customers can cancel their order before dispatch by writing an email to <a href="mailto:care@plantersagrovalley.com" className="text-[var(--color-primary)] hover:underline font-normal">care@plantersagrovalley.com</a>.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  You can call customer support at @8468888666 from 10:00 AM to 6:00 PM (excluding Sundays and Holidays).
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cancelandrefund;

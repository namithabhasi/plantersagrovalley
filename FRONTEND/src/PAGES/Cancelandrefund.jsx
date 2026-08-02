import React, { useEffect } from 'react';

function Cancelandrefund() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <section className="page-section">
        <div className="container flex justify-center">
          <div className="w-full max-w-[800px] flex flex-col gap-8">
            
            {/* Header Section - Centered */}
            <div className="border-b border-[var(--color-border)] pb-6 text-center">
              <h1 className="text-3xl font-[var(--font-family-heading)] font-normal text-[var(--color-primary-dark)] uppercase tracking-wide">
                Cancellation &amp; Refund Policy
              </h1>
              <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] font-normal mt-2 tracking-wider">
                Last Updated: July 2026
              </p>
            </div>

            {/* Content Wrapper */}
            <div className="flex flex-col gap-6 text-sm leading-relaxed text-[var(--color-text-main)] font-[var(--font-family-base)]">
              
              <p className="text-base text-[var(--color-text-main)] leading-relaxed">
                At Planters Agro Valley, we care about your satisfaction and always aim to deliver fresh, healthy, and high-quality products. However, we understand that there might be situations where you need a refund, replacement, or want to return a product. Below is our simple and clear policy:
              </p>

              <hr className="border-[var(--color-border)]" />

              {/* Section 1: Eligible for Refund With Return */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  1. Eligible for Refund With Return
                </h2>
                <p>
                  If the product is delivered and you:
                </p>
                <ul className="space-y-2 pl-5 list-disc marker:text-[var(--color-primary)]">
                  <li>Do not like the product,</li>
                  <li>No longer want it, or</li>
                  <li>Ordered it by mistake.</li>
                </ul>
                <p className="pt-2">
                  You are still allowed to return it under the following conditions:
                </p>
                <ul className="space-y-3 pl-5 list-disc marker:text-[var(--color-primary)]">
                  <li>The return request must be made within 7 days of delivery.</li>
                  <li>The product must be unused and in the same condition as delivered.</li>
                  <li>You must arrange and bear the return shipping charges yourself.</li>
                  <li>You must share photos or a short video of the product and the packaging at the time of booking the return shipment, as proof of its unused and good condition.</li>
                  <li>
                    Send the product to: <span className="font-medium text-[var(--color-text-main)]">Planters Agro Valley - GAT No 589, Tamhane Vasti, Solapur - Pune Hwy, Theur Phata, Infront of Jijau Garden, Pune, Maharashtra, 412201</span>
                  </li>
                  <li>After we receive the product in acceptable and unused condition, we will initiate the refund.</li>
                  <li>The refund may take up to 5 working days to reflect in your account.</li>
                </ul>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Section 2: Eligible for Refund or Replacement Without Return */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  2. Eligible for Refund or Replacement Without Return
                </h2>
                <p>
                  You qualify for a refund or a replacement without returning the product if:
                </p>
                <ul className="space-y-2 pl-5 list-disc marker:text-[var(--color-primary)]">
                  <li>The product arrives damaged or defective.</li>
                  <li>The product is not in usable condition due to transit damage.</li>
                  <li>The wrong product is delivered. (Note: Slight variations in color, natural plant shape, or plants delivered without flowers are normal and are not considered wrong products.)</li>
                </ul>
                <p>
                  Since our plants are perishable items, we do not ask for returns in such cases.
                </p>

                <h3 className="text-sm font-semibold text-[var(--color-text-main)] tracking-wide uppercase pt-2">
                  Procedure for Replacement or Refund:
                </h3>
                <ul className="space-y-3 pl-5 list-disc marker:text-[var(--color-primary)]">
                  <li>
                    Send us photos of the damaged plants through your registered email ID to <a href="mailto:care@plantersagrovalley.com" className="text-[var(--color-primary-dark)] hover:underline font-mono font-medium">care@plantersagrovalley.com</a>.
                  </li>
                  <li>
                    Stickers with the plant name, damaged parts of the plant, and packaging labels of Planters Agro Valley must be clearly visible in a single photo. Please note that we deal in perishable items, so torn leaves, dead flowers, and withered leaves do not qualify for replacement. It is mandatory to share the images within 24 hours of delivery.
                  </li>
                  <li>
                    In case you are unable to capture all details in a single photo, you must send us a short video capturing all the details (not more than 20 seconds).
                  </li>
                  <li>
                    After reviewing the relevant videos and photos, the Planters Agro Valley support team will decide whether the case qualifies for a refund or replacement. Our priority is to provide a replacement first. If the replacement is delivered damaged or dried again, we will initiate a full refund.
                  </li>
                  <li>
                    Refunds take up to 5 working days to reflect back in the customer's payment account. In case the payment was completed via UPI, the refund will be credited to the default account linked to your UPI ID.
                  </li>
                  <li>The replacement process takes 10 working days, and replaced articles are delivered in 7-8 working days.</li>
                </ul>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Section 3: Order Cancellation */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  3. Order Cancellation
                </h2>
                <ul className="space-y-3 pl-5 list-disc marker:text-[var(--color-primary)]">
                  <li>
                    Customers can cancel their order before dispatch by writing an email to <a href="mailto:care@plantersagrovalley.com" className="text-[var(--color-primary-dark)] hover:underline font-mono font-medium">care@plantersagrovalley.com</a>.
                  </li>
                  <li>
                    You can call customer support at <span className="text-[var(--color-primary-dark)] font-mono font-medium">+91 8468888666</span> from 10:00 AM to 6:00 PM (excluding Sundays and Holidays).
                  </li>
                </ul>
              </section>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cancelandrefund;

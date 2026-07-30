import React, { useEffect } from 'react';

function Terms() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-[var(--font-family-base)] py-12 md:py-16">
      <div className="container mx-auto flex justify-center">
        <div className="w-full max-w-[680px] flex flex-col gap-8">
          
          {/* Header Section - Centered */}
          <div className="border-b border-gray-100 pb-5 text-center">
            <h1 className="text-[28px] font-[var(--font-family-heading)] font-normal text-gray-900 tracking-wide">
              Terms &amp; Conditions
            </h1>
            <p className="text-[11px] text-gray-400 font-light mt-1.5 tracking-wider">
              Last Updated: July 2026
            </p>
          </div>

          {/* Content Wrapper */}
          <div className="flex flex-col gap-6 text-[13px] leading-relaxed text-gray-500 font-light select-text">
            
            <p className="text-[14px] text-gray-600 leading-relaxed font-light">
              Please read the following terms of service very carefully. www.plantersagrovalley.com is a product of Planters Agro Valley.
            </p>

            <hr className="border-gray-100" />

            {/* Section 1: User Agreement */}
            <section className="flex flex-col gap-2">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                1. Acceptance of Terms
              </h4>
              <ul className="space-y-2.5 pl-4 list-disc marker:text-[#06492D]">
                <li>
                  You must read and agree to be bound by the Terms of Service, before using the Site or subscribing to any products or service made available through or on the Site, including the sale, supply, payment, delivery, return or rejection of the products or services made available on, through or in connection with this Site.
                </li>
                <li>
                  If you placed an order and a plant is not available in stock, then we can hold your order until the plant is available in stock. Alternatively, you may choose to substitute the product with another item of the same price, or you can wait until the product is back in stock.
                </li>
                <li>
                  By subscribing to or using the Site or the Services, you acknowledge that you have read, understood, and are bound by the Terms of Service, together with all related policies and guidelines of this Site that are incorporated by reference. If you do not agree to be bound by the Terms of Service, do not use or subscribe to the Site or the Products / Services.
                </li>
                <li>
                  We, at our sole discretion, reserve the right to change, amend, or modify the Terms of Service at any time, without notifying you or assigning any reasons. You are responsible for regularly reviewing the Terms of Service.
                </li>
                <li>
                  If you do not agree to any changes or updates to the Terms of Service, your remedy is to cease using the Site and cancel any accounts or Services you have signed up for. Your continued use of the Site or the Services after a change or update has been made to the Terms of Service will constitute your acceptance of such change or update.
                </li>
                <li>
                  If you violate any Terms of Service, we may issue a warning about the violation, or we may choose, at our sole discretion, to immediately terminate or suspend any and all accounts that you have established, without assigning any reasons.
                </li>
                <li>
                  You acknowledge that we are not required to provide you notice before terminating or suspending our Services, but may choose to do so. We reserve the right to deny, in our sole discretion, any user access to the Site or Services without notice and for any reason (including, without limitation, for violation of these Terms of Service).
                </li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            {/* Section 2: Transaction Updates Policy */}
            <section className="flex flex-col gap-2">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                2. Transactional Communication &amp; SMS Policy
              </h4>
              <p>
                Planters Agro Valley will send you transaction SMS updates on the mobile number you provided for order confirmation, shipping tracking, and order updates. By agreeing to these terms and conditions, you consent to receive transactional updates regarding your order, shipping, cancellations, and payment details.
              </p>
              <p>
                Planters Agro Valley will not send you promotional SMS. If you wish to receive promotional offers or wishlist updates, you can sign up for our newsletter on the homepage, and you will receive these details by email.
              </p>
              <h5 className="!text-[13px] !font-medium text-gray-800 tracking-wide uppercase pt-2">
                We only send SMS updates for the following transactional events:
              </h5>
              <ul className="space-y-2 pl-4 list-disc marker:text-[#06492D]">
                <li>When you register on Planters Agro Valley.</li>
                <li>When you successfully purchase a product.</li>
                <li>When you cancel your order.</li>
                <li>When your order is shipped for delivery.</li>
                <li>When your payment is refunded.</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;

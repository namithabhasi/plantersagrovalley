import React, { useEffect } from 'react';

function Terms() {
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
                Terms &amp; Conditions
              </h1>
              <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] font-normal mt-2 tracking-wider">
                Last Updated: July 2026
              </p>
            </div>

            {/* Content Wrapper */}
            <div 
              className="flex flex-col gap-6 text-[var(--font-size-md)] leading-relaxed text-[var(--color-text-main)] font-[var(--font-family-base)]"
              style={{ textAlign: 'justify', textJustify: 'inter-word', textAlignLast: 'left' }}
            >
              
              <p className="text-[var(--font-size-md)] text-[var(--color-text-main)] leading-relaxed">
                Please read the following terms of service very carefully. www.plantersagrovalley.com is a product of Planters Agro Valley.
              </p>

              <hr className="border-[var(--color-border)]" />

              {/* Section 1: User Agreement */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  1. Acceptance of Terms
                </h2>
                <ul className="space-y-3 pl-5 list-disc marker:text-[var(--color-primary)]">
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

              <hr className="border-[var(--color-border)]" />

              {/* Section 2: Transaction Updates Policy */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  2. Transactional Communication &amp; SMS Policy
                </h2>
                <p>
                  Planters Agro Valley will send you transaction SMS updates on the mobile number you provided for order confirmation, shipping tracking, and order updates. By agreeing to these terms and conditions, you consent to receive transactional updates regarding your order, shipping, cancellations, and payment details.
                </p>
                <p>
                  Planters Agro Valley will not send you promotional SMS. If you wish to receive promotional offers or wishlist updates, you can sign up for our newsletter on the homepage, and you will receive these details by email.
                </p>
                <h3 className="text-sm font-semibold text-[var(--color-text-main)] tracking-wide uppercase pt-2">
                  We only send SMS updates for the following transactional events:
                </h3>
                <ul className="space-y-2.5 pl-5 list-disc marker:text-[var(--color-primary)]">
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
      </section>
    </div>
  );
}

export default Terms;

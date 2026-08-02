import React from 'react';

function Shippingpolicy() {
  const deliveryPartners = [
    'Delhivery',
    'Expressbees',
    'Shri Maruti Couriers',
    'DTDC Courier',
    'Ecom Express',
    'FedEx Logistics'
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <section className="page-section">
        <div className="container flex justify-center">
          <div className="w-full max-w-[800px] flex flex-col gap-8">
            
            {/* Page Title */}
            <div className="border-b border-[var(--color-border)] pb-6 text-center">
              <h1 className="text-3xl font-[var(--font-family-heading)] font-normal text-[var(--color-primary-dark)] uppercase tracking-wide">
                Shipping &amp; Delivery Policy
              </h1>
              <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] font-normal mt-2 tracking-wider">
                Last Updated: July 2026
              </p>
            </div>

            {/* Content Body */}
            <div className="flex flex-col gap-6 text-sm leading-relaxed text-[var(--color-text-main)] font-[var(--font-family-base)]">
              
              {/* General Dispatch */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  General Shipping Policy
                </h2>
                <p>
                  Orders are shipped within 10 working days or as per the delivery date agreed at the time of order confirmation. 
                  We use registered domestic courier companies and/or speed post services only to ensure secure transit. 
                  Delivery of all orders will be made to the delivery address entered by the buyer at the time of order confirmation. 
                  Please note that the delivery address cannot be changed once the order has been dispatched from our facility.
                </p>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Cancellation */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  Order Cancellation
                </h2>
                <p>
                  Customers can cancel their order before dispatch by writing an email to{' '}
                  <span className="text-[var(--color-primary-dark)] font-mono font-medium">care@plantersagrovalley.com</span> or calling our customer support helpline at{' '}
                  <span className="text-[var(--color-primary-dark)] font-mono font-medium">+91 8468888666</span>. Customer support is available from 10:00 AM to 6:00 PM, excluding Sundays and public holidays.
                </p>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Delivery Timeline Details */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  Delivery Timelines
                </h2>
                <p>
                  Usually, it takes around 10 to 15 business days for an order to be delivered (excluding public holidays and Sundays). 
                  When you place an order containing live plants, we change plants into the pots and wait for the root systems to stabilize inside the pot before dispatching. 
                  This preparation step protects the plants from transit damage, shock, or dying during travel.
                </p>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Delivery Partners - Responsive Grid of Cards with 3px border-radius */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  Our Delivery Partners
                </h2>
                <p>
                  We partner with leading logistics companies in India to ensure your plants are handled with care and delivered swiftly:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                  {deliveryPartners.map((partner, idx) => (
                    <div
                      key={idx}
                      style={{ borderRadius: '3px' }}
                      className="border border-[var(--color-border)] bg-[var(--color-primary-bg)] p-4 text-center text-xs text-[var(--color-text-main)] font-[var(--font-family-base)] font-medium hover:border-[var(--color-primary)] transition-colors select-none"
                    >
                      {partner}
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Transit Damage & Returns */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  Transit Damage &amp; Return Policy
                </h2>
                <p>
                  There is no need to return physical plant products. In case a plant gets damaged in transit, do not worry. 
                  Keep the damaged plant, take a clear photo of it, and notify us within 24 hours of delivery. 
                  We will gladly send you a new replacement plant or process a full refund.
                </p>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Hidden Charges */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  Taxes and Hidden Charges
                </h2>
                <p>
                  There are no hidden charges. All prices mentioned on our website are inclusive of all applicable taxes and VAT. 
                  Delivery and shipping charges may be extra depending on the number of products purchased or your order value, which will be visible during checkout.
                </p>
              </section>

              <hr className="border-[var(--color-border)]" />

              {/* Order Tracking */}
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-medium text-[var(--color-primary-dark)] font-[var(--font-family-heading)] leading-snug">
                  Tracking Your Consignment
                </h2>
                <p>
                  We send updates via email to keep you informed of your shipment status. 
                  Additionally, you will receive an SMS upon dispatch containing the consignment number and a direct tracking link to check the live transit status.
                </p>
              </section>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Shippingpolicy;

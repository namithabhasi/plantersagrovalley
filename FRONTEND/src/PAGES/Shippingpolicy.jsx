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
    <div className="min-h-screen bg-white text-gray-800 font-[var(--font-family-base)] py-12 md:py-16">
      <div className="container mx-auto flex justify-center">
        <div className="w-full max-w-[680px] flex flex-col gap-8">
          
          {/* Page Title */}
          <div className="border-b border-gray-100 pb-5 text-center">
            <h1 className="text-[28px] font-[var(--font-family-heading)] font-normal text-gray-900 tracking-wide">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-[11px] text-gray-400 font-light mt-1.5 tracking-wider">
              Last Updated: July 2026
            </p>
          </div>

          {/* Content Body */}
          <div className="flex flex-col gap-6 text-[13px] leading-relaxed text-gray-500 font-light">
            
            {/* General Dispatch */}
            <section className="flex flex-col gap-1.5">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                General Shipping Policy
              </h4>
              <p>
                Orders are shipped within 10 working days or as per the delivery date agreed at the time of order confirmation. 
                We use registered domestic courier companies and/or speed post services only to ensure secure transit. 
                Delivery of all orders will be made to the delivery address entered by the buyer at the time of order confirmation. 
                Please note that the delivery address cannot be changed once the order has been dispatched from our facility.
              </p>
            </section>

            {/* Cancellation */}
            <section className="flex flex-col gap-1.5">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                Order Cancellation
              </h4>
              <p>
                Customers can cancel their order before dispatch by writing an email to{' '}
                <span className="text-[#06492D] font-mono">care@plantersagrovalley.com</span> or calling our customer support helpline at{' '}
                <span className="text-[#06492D] font-mono">+91 8468888666</span>. Customer support is available from 10:00 AM to 6:00 PM, excluding Sundays and public holidays.
              </p>
            </section>

            {/* Delivery Timeline Details */}
            <section className="flex flex-col gap-1.5">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                Delivery Timelines
              </h4>
              <p>
                Usually, it takes around 10 to 15 business days for an order to be delivered (excluding public holidays and Sundays). 
                When you place an order containing live plants, we change plants into the pots and wait for the root systems to stabilize inside the pot before dispatching. 
                This preparation step protects the plants from transit damage, shock, or dying during travel.
              </p>
            </section>

            {/* Delivery Partners - Responsive Grid of Cards with 3px border-radius */}
            <section className="flex flex-col gap-3">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                Our Delivery Partners
              </h4>
              <p>
                We partner with leading logistics companies in India to ensure your plants are handled with care and delivered swiftly:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {deliveryPartners.map((partner, idx) => (
                  <div
                    key={idx}
                    style={{ borderRadius: '3px' }}
                    className="border border-gray-200 bg-[#fbfdfb] p-3 text-center text-xs text-gray-600 font-light hover:border-[#06492D] transition-colors select-none"
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </section>

            {/* Transit Damage & Returns */}
            <section className="flex flex-col gap-1.5">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                Transit Damage &amp; Return Policy
              </h4>
              <p>
                There is no need to return physical plant products. In case a plant gets damaged in transit, do not worry. 
                Keep the damaged plant, take a clear photo of it, and notify us within 24 hours of delivery. 
                We will gladly send you a new replacement plant or process a full refund.
              </p>
            </section>

            {/* Hidden Charges */}
            <section className="flex flex-col gap-1.5">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                Taxes and Hidden Charges
              </h4>
              <p>
                There are no hidden charges. All prices mentioned on our website are inclusive of all applicable taxes and VAT. 
                Delivery and shipping charges may be extra depending on the number of products purchased or your order value, which will be visible during checkout.
              </p>
            </section>

            {/* Order Tracking */}
            <section className="flex flex-col gap-1.5">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                Tracking Your Consignment
              </h4>
              <p>
                We send updates via email to keep you informed of your shipment status. 
                Additionally, you will receive an SMS upon dispatch containing the consignment number and a direct tracking link to check the live transit status.
              </p>
            </section>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Shippingpolicy;

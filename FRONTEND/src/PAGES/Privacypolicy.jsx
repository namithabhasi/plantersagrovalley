import React, { useEffect } from 'react';

function Privacypolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-[11px] text-gray-400 font-light mt-1.5 tracking-wider">
              Last Updated: July 2026
            </p>
          </div>

          {/* Content Wrapper */}
          <div className="flex flex-col gap-6 text-[13px] leading-relaxed text-gray-500 font-light select-text">
            
            <p className="text-[14px] text-gray-600 leading-relaxed font-light">
              Thanks for reviewing our privacy policy. Below is a detailed description of how we collect, store, and protect your information.
            </p>

            <hr className="border-gray-100" />

            {/* Section 1: Account Terms */}
            <section className="flex flex-col gap-2">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                1. User Registration &amp; Information
              </h4>
              <ul className="space-y-2.5 pl-4 list-disc marker:text-[#06492D]">
                <li>
                  If any Service requires you to open an account ("My Account"), you must complete the registration process by providing us with current, complete and accurate information as prompted by the applicable registration form.
                </li>
                <li>
                  You represent and warrant that all information provided by you in connection with your User Account, including any payment, contact or shipment details generally or in connection with an order, are true, complete and accurate. You agree and undertake to indemnify us against all damages, costs or losses incurred by us due to wrong, false, inaccurate or incomplete information provided by you.
                </li>
                <li>
                  All communication to you will be carried out through the contact details provided by you while opening an account. You are responsible to report any change in your User Account details by writing to us at <a href="mailto:care@plantersagrovalley.com" className="text-[#06492D] hover:underline font-mono">care@plantersagrovalley.com</a>. The site is not responsible for any changes in User Account details once an order is placed.
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of your User Account password and other account details and are entirely responsible for any and all activities that occur under your User Account. In case you suspect or identify any abuse of your User Account or any transaction through your User Account that is not carried out by you, you should notify us in writing immediately at <a href="mailto:care@plantersagrovalley.com" className="text-[#06492D] hover:underline font-mono">care@plantersagrovalley.com</a>.
                </li>
                <li>
                  Where any Service utilizes the account management of any other social networking site (e.g., Facebook, LinkedIn, Twitter or Tumblr), you are responsible for maintaining the confidentiality of your password and account on such social networking site, and are fully responsible for all activities that occur under such account.
                </li>
                <li>
                  All information shared by you while creating your User Account or accessing the Site shall be protected in accordance with our Privacy Policy.
                </li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            {/* Section 2: Integrity & Third Parties */}
            <section className="flex flex-col gap-2">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                2. Confidentiality &amp; Security Commitment
              </h4>
              <p>
                We are committed to protect all information that you share with us. We have accordingly developed this privacy policy to protect your personal information and keep it confidential. We follow stringent procedures to help protect the confidentiality, security, and integrity of data stored on our systems.
              </p>
              <p>
                We seek to protect your rights of privacy on systems and the Site (<a href="https://www.plantersagrovalley.com" target="_blank" rel="noopener noreferrer" className="text-[#06492D] hover:underline font-mono">www.plantersagrovalley.com</a>) controlled by us, but we are not liable for any unauthorized or unlawful disclosures of your personal and confidential information made by third parties who are not subject to our control, for example advertisers and websites that have links to our Site.
              </p>
              <p className="text-gray-400 font-normal italic text-[11px]">
                Note: The information and privacy practices of our business partners, advertisers, sponsors or other sites to which we provide hyperlinks, may be different from ours. We may change this privacy policy at any time without notice by updating this page. Please check this page from time to time to ensure that you are happy with any changes.
              </p>
            </section>

            <hr className="border-gray-100" />

            {/* Section 3: SMS Updates policy */}
            <section className="flex flex-col gap-2">
              <h4 className="!text-base !font-normal text-[#06492D] font-[var(--font-family-heading)] leading-snug">
                3. Communication &amp; SMS Policies
              </h4>
              <p>
                Planters Agro Valley will send you transaction SMS updates on the mobile number you provided for order confirmation and shipping updates. By agreeing to these terms and conditions, you opt in to receive order status updates, shipping timelines, cancellations, and payment refund details.
              </p>
              <p>
                We respect your inbox: Planters Agro Valley does not send promotional text messages. If you wish to receive our promotional newsletters, discounts, or stock alerts, you may voluntarily sign up for our email newsletter on our homepage.
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

export default Privacypolicy;

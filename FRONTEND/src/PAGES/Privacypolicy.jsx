import React, { useEffect } from 'react';

function Privacypolicy() {
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
            Privacy Policy
          </h1>
          {/* Centered green divider line */}
          <span className="inline-block w-16 h-1 bg-[var(--color-primary)] mt-4 rounded-full"></span>
        </div>

        {/* Content Wrapper - Plain text layout, no background boxes, borders, or shadows */}
        <div className="space-y-8 select-text">
          
          <p className="text-lg text-gray-700 leading-relaxed font-light">
            Thanks for reviewing our privacy policy. Below is a detailed description of how we collect, store, and protect your information.
          </p>

          <hr className="border-gray-100" />

          {/* Section 1: Account Terms */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              1. User Registration & Information
            </h2>
            <ul className="space-y-4 text-gray-600 leading-relaxed font-light">
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  If any Service requires you to open an account ("My Account"), you must complete the registration process by providing us with current, complete and accurate information as prompted by the applicable registration form.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  You represent and warrant that all information provided by you in connection with your User Account, including any payment, contact or shipment details generally or in connection with an order, are true, complete and accurate. You agree and undertake to indemnify us against all damages, costs or losses incurred by us due to wrong, false, inaccurate or incomplete information provided by you.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  All communication to you will be carried out through the contact details provided by you while opening an account. You are responsible to report any change in your User Account details by writing to us at <a href="mailto:care@plantersagrovalley.com" className="text-[var(--color-primary)] hover:underline font-normal">care@plantersagrovalley.com</a>. The site is not responsible for any changes in User Account details once an order is placed.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  You are responsible for maintaining the confidentiality of your User Account password and other account details and are entirely responsible for any and all activities that occur under your User Account. In case you suspect or identify any abuse of your User Account or any transaction through your User Account that is not carried out by you, you should notify us in writing immediately at <a href="mailto:care@plantersagrovalley.com" className="text-[var(--color-primary)] hover:underline font-normal">care@plantersagrovalley.com</a>.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  Where any Service utilizes the account management of any other social networking site (e.g., Facebook, LinkedIn, Twitter or Tumblr), you are responsible for maintaining the confidentiality of your password and account on such social networking site, and are fully responsible for all activities that occur under such account.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[var(--color-primary)] mr-3 font-semibold">•</span>
                <span>
                  All information shared by you while creating your User Account or accessing the Site shall be protected in accordance with our Privacy Policy.
                </span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Integrity & Third Parties */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              2. Confidentiality & Security Commitment
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              We am committed to protect all information that you share with us. We have accordingly developed this privacy policy to protect your personal information and keep it confidential. We follow stringent procedures to help protect the confidentiality, security, and integrity of data stored on our systems.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              We seek to protect your rights of privacy on systems and the Site (<a href="https://www.plantersagrovalley.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline font-normal">www.plantersagrovalley.com</a>) controlled by us, but we are not liable for any unauthorized or unlawful disclosures of your personal and confidential information made by third parties who are not subject to our control, for example advertisers and websites that have links to our Site.
            </p>
            <p className="text-gray-500 leading-relaxed font-light italic text-xs">
              Note: The information and privacy practices of our business partners, advertisers, sponsors or other sites to which we provide hyperlinks, may be different from ours. We may change this privacy policy at any time without notice by updating this page. Please check this page from time to time to ensure that you are happy with any changes.
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Section 3: SMS Updates policy */}
          <div className="space-y-4">
            <h2 className="text-xl font-[var(--font-family-heading)] font-semibold text-gray-900 tracking-wide">
              3. Communication & SMS Policies
            </h2>
            <p className="text-gray-600 leading-relaxed font-light">
              Planters Agro Valley will send you transaction SMS updates on the mobile number you provided for order confirmation and shipping updates. By agreeing to these terms and conditions, you opt in to receive order status updates, shipping timelines, cancellations, and payment refund details.
            </p>
            <p className="text-gray-600 leading-relaxed font-light">
              We respect your inbox: Planters Agro Valley does not send promotional text messages. If you wish to receive our promotional newsletters, discounts, or stock alerts, you may voluntarily sign up for our email newsletter on our homepage.
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

export default Privacypolicy;

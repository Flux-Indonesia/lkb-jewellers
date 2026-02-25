import { Scale } from "lucide-react";

const sections = [
  {
    title: "1. Introduction",
    content:
      "These terms and conditions govern your use of the LKB Jewellers website and the purchase of products from us. By accessing our website or placing an order, you agree to be bound by these terms. Please read them carefully before using our services.",
  },
  {
    title: "2. Company Information",
    content:
      "LKB Jewellers is a registered business operating from Hatton Garden, London, EC1N 8NX, United Kingdom. We specialise in luxury watches, fine jewellery, and bespoke design services.",
  },
  {
    title: "3. Products & Pricing",
    content:
      "All products displayed on our website are subject to availability. Prices are quoted in British Pounds (GBP) and include VAT where applicable. We reserve the right to change prices without prior notice. In the event of a pricing error, we will notify you before processing your order.",
  },
  {
    title: "4. Orders & Payment",
    content:
      "When you place an order, you are making an offer to purchase. We reserve the right to accept or decline any order. Payment must be made in full at the time of purchase. We accept major credit cards, bank transfers, and other payment methods as displayed at checkout. All transactions are processed securely.",
  },
  {
    title: "5. Delivery",
    content:
      "We offer fully insured delivery on all orders. Delivery times may vary depending on the item and your location. Standard UK delivery is typically 2-5 working days. International delivery times vary by destination. For high-value items, we may require a signature upon delivery.",
  },
  {
    title: "6. Returns & Refunds",
    content:
      "We offer a 14-day return policy on most items, provided they are returned in their original condition and packaging. Bespoke and custom-made items are non-returnable unless faulty. Refunds will be processed within 14 days of receiving the returned item. Please refer to our Returns Policy page for full details.",
  },
  {
    title: "7. Warranty",
    content:
      "All new products come with a manufacturer's warranty. Pre-owned watches are sold with a 12-month LKB warranty covering mechanical defects. This warranty does not cover damage caused by misuse, accidents, or unauthorised modifications.",
  },
  {
    title: "8. Intellectual Property",
    content:
      "All content on this website, including images, text, logos, and designs, is the property of LKB Jewellers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content without our prior written consent.",
  },
  {
    title: "9. Privacy",
    content:
      "We are committed to protecting your personal information. Please refer to our Privacy Policy for details on how we collect, use, and protect your data. By using our website, you consent to our data practices as described in the Privacy Policy.",
  },
  {
    title: "10. Limitation of Liability",
    content:
      "To the fullest extent permitted by law, LKB Jewellers shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the purchase price of the item in question.",
  },
  {
    title: "11. Governing Law",
    content:
      "These terms and conditions are governed by the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
  },
  {
    title: "12. Changes to Terms",
    content:
      "We reserve the right to update these terms and conditions at any time. Changes will be effective immediately upon posting to our website. Your continued use of the website after changes are posted constitutes acceptance of the revised terms.",
  },
];

export default function LegalPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Scale className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h1
            className="text-4xl md:text-6xl text-white mb-6 font-normal font-heading"
          >
            Terms &amp; Conditions
          </h1>
          <p className="text-gray-400 font-display">
            Last updated: January 2025
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2
                className="text-xl text-white mb-4 font-normal font-heading"
              >
                {section.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-16 bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">
            If you have any questions about these terms, please contact us at{" "}
            <a
              href="mailto:info@lkbjewellers.com"
              className="text-[#D4AF37] hover:underline"
            >
              info@lkbjewellers.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

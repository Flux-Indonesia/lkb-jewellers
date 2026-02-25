import {
  Truck,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  Download,
  Droplets,
  MapPin,
  Globe,
  Shield,
  ShieldCheck,
  CircleAlert,
} from "lucide-react";
import ShowroomSection from "@/components/showroom-section";

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-black pt-36 pb-20">
      <div className="mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Truck size={64} className="mx-auto mb-6 text-green-400" />
          <h1
            className="text-5xl md:text-6xl text-white mb-4 font-bold font-heading"
          >
            Delivery Information
          </h1>
          <div className="h-1 w-32 bg-linear-to-r from-green-500 to-blue-500 mx-auto mb-6" />
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 font-display">
            Fast, secure, and reliable delivery worldwide with signature
            confirmation
          </p>
          <a
            href="/DeliveryInformation-LKB.pdf"
            download
            className="inline-flex items-center gap-3 bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 active:scale-95"
          >
            <Download size={20} />
            Download Delivery Information
          </a>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-linear-to-br from-green-500/10 to-green-900/10 border border-green-500/30 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">🇬🇧</div>
            <h2
              className="text-xl text-white mb-2 font-bold font-heading"
            >
              UK Delivery
            </h2>
            <p className="text-gray-300 text-sm mb-3">
              Royal Mail Special Delivery™
            </p>
            <div className="flex items-center gap-2">
              <Clock size={20} className="inline text-green-400" />
              <span className="text-sm text-gray-300">
                Confirmation by dispatch team
              </span>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-500/10 to-blue-900/10 border border-blue-500/30 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">🌍</div>
            <h2
              className="text-xl text-white mb-2 font-bold font-heading"
            >
              International
            </h2>
            <p className="text-gray-300 text-sm mb-3">DHL or FedEx</p>
            <div className="flex items-center gap-2">
              <Globe size={20} className="inline text-blue-400" />
              <span className="text-sm text-gray-300">
                Up to 2 months delivery
              </span>
            </div>
          </div>

          <div className="bg-linear-to-br from-gold/10 to-yellow-900/10 border border-gold/30 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">🏢</div>
            <h2
              className="text-xl text-white mb-2 font-bold font-heading"
            >
              Collect
            </h2>
            <p className="text-gray-300 text-sm mb-3">From our offices</p>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="inline text-gold" />
              <span className="text-sm text-gray-300">
                By appointment only
              </span>
            </div>
          </div>
        </div>

        {/* Detail Sections */}
        <div className="space-y-8">
          {/* Delivery Timeframes */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Clock size={32} className="text-green-400" />
              <h2 className="text-3xl text-white font-bold font-heading">
                Delivery Timeframes
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/50 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🇬🇧</span>
                  <h3 className="text-white font-semibold">Mainland UK</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Orders placed Monday to Friday will receive a confirmation
                  email or message for when the product shall be dispatched for
                  delivery. Subject to confirmation contact from our Dispatch
                  Team.
                </p>
              </div>
              <div className="bg-black/50 border border-blue-500/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🌍</span>
                  <h3 className="text-white font-semibold">Outside UK</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We will contact you with an estimated delivery date. Dates are
                  given in good faith as estimates only. In exceptional
                  circumstances, delivery may take up to 2 months from
                  acceptance of your order.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Requirements */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <ShieldCheck size={32} className="text-purple-400" />
              <h2 className="text-3xl text-white font-bold font-heading">
                Delivery Requirements
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <CircleAlert size={24} className="text-purple-400" />
                  <h3 className="text-white font-semibold">
                    Signature Required
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  A signature is needed for receipt of the Goods by an adult
                  (aged 18 years or over) at the delivery address. If no-one is
                  available when the carrier attempts delivery, the carrier may
                  leave a calling card for you to re-arrange delivery.
                </p>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-4 mt-4">
                  <p className="text-white text-sm leading-relaxed">
                    <AlertTriangle size={16} className="inline mr-2 -mt-0.5 text-yellow-400" />
                    Any parcel that has been damaged or tampered with should not
                    be signed for and delivery should be refused.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Card payments must be dispatched to the billing address of
                    the card holder (work address may be accommodated). Finance
                    purchases must go to the address in the finance agreement.
                  </p>
                </div>

                <div className="bg-black/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-2">Collection</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Goods may be collected from our offices by appointment only
                    for security reasons. Weekend appointments must be confirmed
                    by 5 pm on the previous working day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customs & International */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Globe size={32} className="text-blue-400" />
              <h2 className="text-3xl text-white font-bold font-heading">
                Customs &amp; International Shipping
              </h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              If you are based outside the UK, you may have to pay import duty
              or other taxes, fees, or charges applied by customs or other
              authorities in the country of receipt.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">
                  Your Responsibility
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-blue-400 mt-1">•</span>
                    Comply with all laws and regulations
                  </li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-blue-400 mt-1">•</span>
                    Pay customs clearance charges
                  </li>
                  <li className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-blue-400 mt-1">•</span>
                    Handle import duties and taxes
                  </li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">Our Position</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We have no control over customs charges and cannot predict what
                  they may be. All additional charges must be borne by you.
                </p>
              </div>
            </div>
          </div>

          {/* Warranty Cards - 2-column grid, NOT in a gray section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-gold/10 to-yellow-900/10 border border-gold/30 rounded-lg p-6">
              <Shield size={32} className="text-gold mb-4" />
              <h2 className="text-xl font-serif text-white mb-3">
                Manufacturer Warranty
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Some goods come with a manufacturer&apos;s warranty. Refer to
                the paperwork provided with the goods or the
                manufacturer&apos;s website for details. This is in addition to
                your legal rights.
              </p>
            </div>
            <div className="bg-linear-to-br from-green-500/10 to-green-900/10 border border-green-500/30 rounded-lg p-6">
              <Shield size={32} className="text-green-400 mb-4" />
              <h2 className="text-xl font-serif text-white mb-3">
                LKB Warranty
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                We provide either a full or limited warranty with our pre-owned
                goods for 12 months from delivery date. Our warranty
                doesn&apos;t apply to new goods covered by manufacturer&apos;s
                warranty.
              </p>
            </div>
          </div>

          {/* Water Resistance */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Droplets size={32} className="text-blue-400" />
              <h2 className="text-3xl text-white font-bold font-heading">
                Water Resistance
              </h2>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                <span className="text-white font-semibold">Important: </span>
                Water resistant watches are not waterproof. For example, watches
                advertised as water resistant to 30 metres (100 feet/3 ATM) can
                only withstand splashes.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                All our watches are tested prior to sale to ensure advertised
                water resistance is accurate. The indication of water resistance
                in metres is a technical norm which does not correspond to an
                exact depth.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-linear-to-r from-gold/10 to-yellow-900/10 border border-gold/30 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-serif text-white mb-6">
            Delivery Questions?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            If you have any questions about our Delivery Policy, our team is
            here to help
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/50 rounded-lg p-6 text-center">
              <Phone size={32} className="mx-auto mb-3 text-gold" />
              <h3 className="text-gold font-semibold mb-2">Call Us</h3>
              <p className="text-gray-300 text-sm">020 3336 5303</p>
            </div>
            <div className="bg-black/50 rounded-lg p-6 text-center">
              <Mail size={32} className="mx-auto mb-3 text-gold" />
              <h3 className="text-gold font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300 text-sm">
                info@localkettlebrothersuk.com
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-6 text-center">
              <MapPin size={32} className="mx-auto mb-3 text-gold" />
              <h3 className="text-gold font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300 text-sm">
                67-68 Hatton Garden
                <br />
                London, EC1N 8JY
              </p>
            </div>
          </div>
        </div>
      </div>

      <ShowroomSection />
    </div>
  );
}

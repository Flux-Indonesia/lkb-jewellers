import {
  Shield,
  Lock,
  Eye,
  CircleCheckBig,
  Mail,
  Download,
  Users,
  Share2,
  MapPin,
} from "lucide-react";
import ShowroomSection from "@/components/showroom-section";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-36 pb-20">
      <div className="mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="relative mb-20 text-center">
          <div className="absolute inset-0 opacity-10 blur-3xl">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full" />
          </div>
          <div className="relative">
            <Shield size={64} className="mx-auto mb-6 text-blue-400" />
            <h1
              className="text-5xl md:text-6xl font-serif text-white mb-4"
                         >
              Privacy Policy
            </h1>
            <div className="h-1 w-32 bg-linear-to-r from-blue-500 to-purple-500 mx-auto mb-6" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 font-display">
              Your privacy and data security are our top priorities. Learn how we
              protect your information.
            </p>
            <a
              href="/PrivacyPolicy-LKB.pdf"
              download
              className="inline-flex items-center gap-3 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/50 active:scale-95"
            >
              <Download size={20} />
              Download Privacy Policy
            </a>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-linear-to-br from-blue-500/10 to-blue-900/10 border border-blue-500/30 rounded-lg p-6 hover:scale-105 transition-transform">
            <Lock size={32} className="text-blue-400 mb-4" />
            <h2 className="text-xl font-serif text-white mb-2">
              Secure
            </h2>
            <p className="text-gray-300 text-sm">
              Industry-leading encryption and security protocols
            </p>
          </div>
          <div className="bg-linear-to-br from-purple-500/10 to-purple-900/10 border border-purple-500/30 rounded-lg p-6 hover:scale-105 transition-transform">
            <Eye size={32} className="text-purple-400 mb-4" />
            <h2 className="text-xl font-serif text-white mb-2">
              Transparent
            </h2>
            <p className="text-gray-300 text-sm">
              Clear information about how we use your data
            </p>
          </div>
          <div className="bg-linear-to-br from-green-500/10 to-green-900/10 border border-green-500/30 rounded-lg p-6 hover:scale-105 transition-transform">
            <CircleCheckBig size={32} className="text-green-400 mb-4" />
            <h2 className="text-xl font-serif text-white mb-2">
              Compliant
            </h2>
            <p className="text-gray-300 text-sm">
              Full UK GDPR compliance and data protection
            </p>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8 text-gray-300 leading-relaxed">
          {/* About Local Kettle Brothers UK */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Users size={32} className="text-gold" />
              <h2 className="text-3xl font-serif text-white">
                About Local Kettle Brothers UK
              </h2>
            </div>
            <p className="mb-4">
              Luxury Kettle Brothers UK has its registered offices at Suite 37
              88-90 Hatton Garden, London, EC1N 8PN. In this Privacy Policy, we
              use the term Local Kettle Brothers UK (and &quot;we&quot;,
              &quot;us&quot; and &quot;our&quot;) to refer to the head office of
              Luxury Kettle Brothers UK at the registered address above, our
              affiliates and our boutiques.
            </p>
            <p>
              Please take a moment to read the following policy that explains how
              we collect, use, disclose and transfer the personal information
              that you provide to us on our websites, mobile applications and
              other digital platforms (together referred to as the
              &quot;Platforms&quot;), when you visit our Local Kettle Brothers UK
              offices, contact us by telephone, or when you interact with us
              over social media platforms.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Eye size={32} className="text-blue-400" />
              <h2 className="text-3xl font-serif text-white">
                Information We Collect
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/50 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">👤</span> Account Registration
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CircleCheckBig
                      size={16}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <span>Name and address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig
                      size={16}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <span>Date of birth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig
                      size={16}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <span>Email and telephone number</span>
                  </li>
                </ul>
              </div>
              <div className="bg-black/50 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛒</span> Purchase Information
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CircleCheckBig
                      size={16}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <span>Purchase details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig
                      size={16}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <span>Payment information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CircleCheckBig
                      size={16}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <span>Correspondence history</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Share2 size={32} className="text-purple-400" />
              <h2 className="text-3xl font-serif text-white">
                How We Use Your Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Manage and fulfil purchase orders",
                "Facilitate delivery and after-sales services",
                "Manage accounts and records",
                "Handle enquiries and requests",
                "Send order confirmations",
                "Identify relevant products for you",
                "Send marketing communications",
                "Conduct market research",
                "Prevent fraud and illegal activities",
                "Improve our platform and services",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-black/30 p-4 rounded-lg"
                >
                  <CircleCheckBig
                    size={20}
                    className="text-purple-400 mt-0.5 shrink-0"
                  />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Information Sharing */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Share2 size={32} className="text-orange-400" />
              <h2 className="text-3xl font-serif text-white">
                Information Sharing
              </h2>
            </div>
            <p className="mb-6">
              We only share personal information under specific circumstances:
            </p>
            <div className="space-y-4">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">
                  Payment &amp; Security
                </h3>
                <p className="text-sm">
                  We disclose information to third party payment providers for
                  online payments, credit checks, and fraud prevention.
                </p>
              </div>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">
                  Legal Compliance
                </h3>
                <p className="text-sm">
                  We may share information with law enforcement, courts, or
                  regulators to comply with legal obligations.
                </p>
              </div>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-2">
                  Business Transfers
                </h3>
                <p className="text-sm">
                  Information may be transferred if we sell or transfer all or
                  substantially all of our assets and business.
                </p>
              </div>
            </div>
          </div>

          {/* Protecting Your Information + Your Rights — 2-col gradient cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-green-500/10 to-green-900/10 border border-green-500/30 rounded-lg p-6">
              <Lock size={32} className="text-green-400 mb-4" />
              <h2 className="text-xl font-serif text-white mb-3">
                Protecting Your Information
              </h2>
              <p className="text-sm">
                We use appropriate technical and organizational safeguards to
                protect your personal information against unauthorized access,
                loss, damage, or destruction. Access is limited to employees who
                need it.
              </p>
            </div>
            <div className="bg-linear-to-br from-blue-500/10 to-blue-900/10 border border-blue-500/30 rounded-lg p-6">
              <Shield size={32} className="text-blue-400 mb-4" />
              <h2 className="text-xl font-serif text-white mb-3">
                Your Rights
              </h2>
              <p className="text-sm">
                You have the right to access, correct, update, or request
                erasure of your personal information. You can unsubscribe from
                marketing emails at any time by clicking &quot;unsubscribe&quot;
                in any email.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-linear-to-r from-gold/10 to-yellow-900/10 border border-gold/30 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-serif text-white mb-6">
            Questions About Privacy?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            If you have any questions or comments about this Privacy Policy,
            please contact us
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-black/50 rounded-lg p-6 text-center">
              <Mail size={32} className="mx-auto mb-3 text-gold" />
              <h3 className="text-gold font-semibold mb-2">Email Us</h3>
              <p className="text-gray-300 text-sm">info@lkbjewellers.com</p>
            </div>
            <div className="bg-black/50 rounded-lg p-6 text-center">
              <MapPin size={32} className="mx-auto mb-3 text-gold" />
              <h3 className="text-gold font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-300 text-sm">
                Suite 37 88-90 Hatton Garden
                <br />
                London, EC1N 8PN
              </p>
            </div>
          </div>
        </div>
      </div>

      <ShowroomSection />
    </div>
  );
}

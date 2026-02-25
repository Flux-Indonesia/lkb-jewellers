import { RefreshCw, Package, ShieldCheck, Clock, CircleAlert, CircleCheckBig, Download } from "lucide-react";
import ShowroomSection from "@/components/showroom-section";

const summaryCards = [
	{
		icon: Package,
		title: "In-Store Purchases",
		color: "from-blue-500/20 to-blue-900/20",
		borderColor: "border-blue-500/30",
		iconColor: "text-blue-400",
		content:
			"Purchases made in store can be exchanged but not refunded when returned within 14 days of purchase in unused condition. If no exchange can be made on the day, a credit note will be issued for the original purchase price.",
	},
	{
		icon: ShieldCheck,
		title: "Online Purchases",
		color: "from-gold/20 to-yellow-900/20",
		borderColor: "border-gold/30",
		iconColor: "text-gold",
		content:
			"Purchases made online may only be exchanged or refunded within 14 days of purchase if they are in an unused condition. Goods purchased online will come with a tamper-proof returns sticker which allows for the Goods to be tried on and examined for any faults. Returns will not be accepted if this sticker has been damaged or removed, so please examine the Goods thoroughly to ensure you are completely satisfied with the product before removing this.",
	},
];

export default function ReturnsPolicyPage() {
	return (
		<div className="min-h-screen bg-black pt-36 pb-20">
			{/* Hero Section */}
			<div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black py-16 mb-12">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold rounded-full blur-3xl" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
				</div>
				<div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
					<RefreshCw size={64} className="mx-auto mb-6 text-gold" />
					<h1 className="text-5xl md:text-6xl text-white mb-4 font-bold font-heading">
						Returns Policy
					</h1>
					<div className="w-32 h-1 bg-gold mx-auto mb-6" />
					<p className="text-gray-400 text-lg mb-8 font-display">
						Your satisfaction is our priority
					</p>
					<a
						href="/ReturnPolicy-LKB.pdf"
						download
						className="inline-flex items-center gap-3 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-500 hover:to-gold text-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-gold/50 active:scale-95"
					>
						<Download size={20} />
						Download Returns Policy
					</a>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="container mx-auto px-6 max-w-6xl">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
					{summaryCards.map((card) => (
						<div
							key={card.title}
							className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-lg p-8 hover:scale-105 transition-transform duration-300`}
						>
							<card.icon size={40} className={`${card.iconColor} mb-4`} />
							<h2 className="text-2xl text-white mb-4 font-heading">
								{card.title}
							</h2>
							<p className="text-gray-300 leading-relaxed">{card.content}</p>
						</div>
					))}
				</div>

				{/* Detail Sections */}
				<div className="space-y-8">
					{/* Return Process */}
					<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
						<div className="flex items-center gap-4 mb-6">
							<Clock size={32} className="text-purple-400" />
							<h2 className="text-3xl text-white font-heading">
								Return Process
							</h2>
						</div>
						<p className="text-gray-300 leading-relaxed mb-6">
							In the event that Goods are returned to you following a refused
							sale, packaging and insurance will be your responsibility. Local
							Kettle Brothers UK relinquishes all responsibility for the safe
							delivery of Goods in this instance. You shall send the goods back
							or hand them over to us without undue delay and in any event not
							later than 14 days from the day on which you communicate your
							cancellation from this contract to us.
						</p>
						<div className="bg-black/50 border-l-4 border-purple-500 p-6 rounded">
							<h3 className="text-white font-semibold mb-4">
								Important Requirements:
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start gap-3 text-gray-300 text-sm">
									<CircleCheckBig size={20} className="text-purple-400 mt-0.5 shrink-0" />
									<span>Use a tracked mail system and retain proof of postage</span>
								</li>
								<li className="flex items-start gap-3 text-gray-300 text-sm">
									<CircleCheckBig size={20} className="text-purple-400 mt-0.5 shrink-0" />
									<span>Insure the Goods to their full value</span>
								</li>
								<li className="flex items-start gap-3 text-gray-300 text-sm">
									<CircleCheckBig size={20} className="text-purple-400 mt-0.5 shrink-0" />
									<span>Pack the Goods appropriately to prevent damage during transit</span>
								</li>
							</ul>
						</div>
					</div>

					{/* Faulty Goods */}
					<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
						<div className="flex items-center gap-4 mb-6">
							<CircleAlert size={32} className="text-red-400" />
							<h2 className="text-3xl text-white font-heading">Faulty Goods</h2>
						</div>
						<p className="text-gray-300 leading-relaxed mb-6">
							You must return any Goods that are Faulty (including Paperwork,
							links, user manual, service papers and box as applicable) promptly
							and within 14 days of advising us of the relevant Faulty Good.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
							<div className="bg-black/50 border border-red-500/30 p-6 rounded">
								<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
									<span className="text-2xl">🇬🇧</span> UK Returns
								</h3>
								<p className="text-gray-300 text-sm leading-relaxed">
									We will refund your reasonably incurred return postage costs
									provided you comply with our reasonable return instructions and
									you provide us with a copy receipt.
								</p>
							</div>
							<div className="bg-black/50 border border-red-500/30 p-6 rounded">
								<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
									<span className="text-2xl">🌍</span> International Returns
								</h3>
								<p className="text-gray-300 text-sm leading-relaxed">
									We will refund your return postage costs to a maximum of £12
									(although this may be reviewed on a case by case basis)
									provided you comply with our reasonable return instructions and
									provide us with a copy receipt.
								</p>
							</div>
						</div>
					</div>

					{/* Service Returns & Warranty Claims - Side by side */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-gradient-to-br from-green-500/10 to-green-900/10 border border-green-500/30 rounded-lg p-6">
							<ShieldCheck size={32} className="text-green-400 mb-4" />
							<h2 className="text-xl text-white mb-3 font-heading">
								Service Returns
							</h2>
							<p className="text-gray-300 text-sm leading-relaxed">
								If you are sending your watch in for a service at Time Services and
								are based within the UK, we will return your watch to you once the
								work is completed by Royal Mail&apos;s Special Delivery and postage
								will be at your cost (£12.00 unless advised differently).
							</p>
						</div>
						<div className="bg-gradient-to-br from-gold/10 to-yellow-900/10 border border-gold/30 rounded-lg p-6">
							<ShieldCheck size={32} className="text-gold mb-4" />
							<h2 className="text-xl text-white mb-3 font-heading">
								Warranty Claims
							</h2>
							<p className="text-gray-300 text-sm leading-relaxed">
								If you are based in the UK and have a valid claim against your
								warranty, we will provide you with a pre-paid envelope to return
								your watch to us and we will not make a charge for the postage and
								packaging costs of returning the watch to you.
							</p>
						</div>
					</div>

					{/* Part-Exchanges */}
					<div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
						<div className="flex items-center gap-4 mb-6">
							<RefreshCw size={32} className="text-gold" />
							<h2 className="text-3xl text-white font-heading">
								Part-Exchanges
							</h2>
						</div>
						<p className="text-gray-300 leading-relaxed mb-6">
							A part-exchange allowance will be agreed between us in writing,
							which will be used as part payment towards your purchase order. If
							an order is cancelled in which a part-exchange is involved, whether
							with us or with our Purchasing Agent, we may at our sole discretion
							offer either a return of your watch or payment of the part exchange
							allowance.
						</p>
						<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mt-6">
							<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
								<CircleAlert size={24} className="text-red-400" />
								Important Notice
							</h3>
							<p className="text-gray-300 text-sm leading-relaxed">
								In the event that we discover that the watch you are selling us
								in part-exchange is counterfeit, lost, stolen or damaged or is
								not fully owned by you, we have the option to rescind the
								contract. If we choose to exercise this right, we will notify you
								by telephone and/or by e-mail as soon as possible. You must
								refund us all sums paid by us to you within 7 days of receipt of
								notice from us.
							</p>
						</div>
					</div>
				</div>

				{/* Contact Section */}
				<div className="mt-16 bg-gradient-to-r from-gold/10 to-yellow-900/10 border border-gold/30 rounded-lg p-8 text-center">
					<h2 className="text-3xl text-white mb-6 font-heading">
						Need Assistance?
					</h2>
					<p className="text-gray-300 mb-8 max-w-2xl mx-auto">
						If you have any questions or comments about our Returns Policy,
						please don&apos;t hesitate to contact us
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
						<div className="bg-black/50 rounded-lg p-6 text-center">
							<div className="text-4xl mb-3">✉️</div>
							<h3 className="text-gold font-semibold mb-2">Email Us</h3>
							<p className="text-gray-300 text-sm">info@lkbjewellers.com</p>
						</div>
						<div className="bg-black/50 rounded-lg p-6 text-center">
							<div className="text-4xl mb-3">📍</div>
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

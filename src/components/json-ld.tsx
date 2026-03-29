export function LocalBusinessJsonLd() {
	const schema = {
		"@context": "https://schema.org",
		"@type": "JewelryStore",
		name: "LKB Jewellers",
		alternateName: "Local Kettle Brothers UK Jewellers",
		url: "https://www.lkbjewellers.com",
		logo: "https://www.lkbjewellers.com/white-logo.png",
		image: "https://www.lkbjewellers.com/white-logo.png",
		telephone: "+442033365303",
		email: "info@lkbjewellers.com",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Hatton Garden",
			addressLocality: "London",
			addressCountry: "GB",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: 51.5204,
			longitude: -0.1083,
		},
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				opens: "00:00",
				closes: "23:59",
			},
		],
		priceRange: "$$$$",
		currenciesAccepted: "GBP",
		paymentAccepted: "Cash, Credit Card, Bank Transfer",
		sameAs: [
			"https://www.instagram.com/localkettlebrothersuk/",
			"https://www.facebook.com/lkbjewellers",
			"https://www.tiktok.com/@localkettlebrothersuk",
			"https://www.youtube.com/@lkbjewellers",
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

export function ProductJsonLd({
	name,
	description,
	image,
	price,
	currency = "GBP",
	availability,
	url,
	brand,
	sku,
	category,
}: {
	name: string;
	description: string;
	image: string;
	price: number;
	currency?: string;
	availability: "InStock" | "OutOfStock";
	url: string;
	brand?: string;
	sku?: string;
	category?: string;
}) {
	const schema: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Product",
		name,
		description,
		image,
		url,
		brand: brand
			? { "@type": "Brand", name: brand }
			: { "@type": "Brand", name: "LKB Jewellers" },
		offers: {
			"@type": "Offer",
			price,
			priceCurrency: currency,
			availability: `https://schema.org/${availability}`,
			url,
			seller: {
				"@type": "Organization",
				name: "LKB Jewellers",
			},
		},
	};

	if (sku) schema.sku = sku;
	if (category) schema.category = category;

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
	const schema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: item.name,
			item: item.url,
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
	if (items.length === 0) return null;

	const schema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

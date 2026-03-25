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
}: {
	name: string;
	description: string;
	image: string;
	price: number;
	currency?: string;
	availability: "InStock" | "OutOfStock";
	url: string;
	brand?: string;
}) {
	const schema = {
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
			seller: {
				"@type": "Organization",
				name: "LKB Jewellers",
			},
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
}

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://www.lkbjewellers.com";

	return [
		{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
		{ url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
		{ url: `${baseUrl}/watches`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
		{ url: `${baseUrl}/jewellery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
		{ url: `${baseUrl}/accessories`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
		{ url: `${baseUrl}/engagement-rings`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
		{ url: `${baseUrl}/we-buy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
		{ url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
		{ url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/servicing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/bespoke`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
		{ url: `${baseUrl}/hall-of-fame`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
	];
}

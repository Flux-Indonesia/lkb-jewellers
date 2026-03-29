import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/dashboard", "/api/", "/login", "/signup", "/profile", "/checkout", "/cart"],
		},
		sitemap: "https://www.lkbjewellers.com/sitemap.xml",
	};
}

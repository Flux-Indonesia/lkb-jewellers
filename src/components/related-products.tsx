"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getProductsByCategory } from "@/lib/products";

const PLACEHOLDER_IMG =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

function formatCategory(cat: string) {
	return cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RelatedProducts({
	currentProductId,
	category,
	brand,
}: {
	currentProductId: string;
	category: string;
	brand?: string;
}) {
	const [related, setRelated] = useState<Product[]>([]);

	useEffect(() => {
		if (!category?.trim()) return;

		getProductsByCategory(category, { limit: 12, excludeId: currentProductId })
			.then((products) => {
				const scored = products
					.filter((p) => p.image?.trim())
					.map((p) => {
						let score = 1;
						if (brand && p.brand === brand) score += 2;
						return { product: p, score };
					})
					.sort((a, b) => b.score - a.score)
					.slice(0, 4);

				setRelated(scored.map((s) => s.product));
			})
			.catch(() => {});
	}, [currentProductId, category, brand]);

	if (related.length === 0) return null;

	return (
		<section className="container mx-auto px-6 py-16 border-t border-gray-100">
			<h2 className="text-2xl font-bold text-black mb-8 font-heading">
				You May Also Like
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{related.map((product) => (
					<Link
						key={product.id}
						href={`/product/${product.id}`}
						className="group"
					>
						<div className="aspect-square bg-gray-50 border border-gray-200 overflow-hidden mb-3 relative">
							<Image
								src={product.image || PLACEHOLDER_IMG}
								alt={product.seo?.imageAltText ?? product.name}
								fill
								className="object-cover group-hover:scale-105 transition-transform duration-500"
								sizes="(max-width: 768px) 50vw, 25vw"
								onError={(e) => {
									(e.target as HTMLImageElement).srcset = "";
									(e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
								}}
							/>
						</div>
						<p className="text-xs text-[#D4AF37] uppercase tracking-wider mb-1">
							{formatCategory(product.category)}
						</p>
						<h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
							{product.name}
						</h3>
						{product.price > 0 ? (
							<p className="text-sm font-bold text-black mt-1">
								£{product.price.toLocaleString()}
							</p>
						) : (
							<p className="text-sm font-bold text-[#D4AF37] mt-1">
								Price on Request
							</p>
						)}
					</Link>
				))}
			</div>
		</section>
	);
}

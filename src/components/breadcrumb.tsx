import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
	return (
		<nav aria-label="Breadcrumb" className="mb-6">
			<ol className="flex items-center gap-1.5 text-sm text-gray-500">
				{items.map((item, i) => (
					<li key={i} className="flex items-center gap-1.5">
						{i > 0 && <ChevronRight size={14} className="text-gray-400" />}
						{item.href ? (
							<Link
								href={item.href}
								className="hover:text-[#D4AF37] transition-colors"
							>
								{item.label}
							</Link>
						) : (
							<span className="text-gray-900 font-medium">{item.label}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
}

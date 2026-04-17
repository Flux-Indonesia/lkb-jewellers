import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAuthenticated } from "@/lib/admin-auth";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function serviceClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!
	);
}

function str(v: unknown): string {
	if (v == null) return "";
	if (typeof v === "object") return JSON.stringify(v);
	return String(v);
}

function formatDate(v: unknown): string {
	if (!v) return "";
	try { return new Date(String(v)).toLocaleString("en-GB"); } catch { return str(v); }
}

// ── Data fetchers ─────────────────────────────────────────────────────────────

async function fetchOrders() {
	const { data, error } = await serviceClient()
		.from("orders")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}

async function fetchContacts(filter?: string) {
	const { data, error } = await serviceClient()
		.from("contacts")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) throw error;
	const rows = data ?? [];
	if (!filter || filter === "all") return rows;
	if (filter === "general") return rows.filter((c: Record<string, unknown>) => !c.product_name);
	if (filter === "product") return rows.filter((c: Record<string, unknown>) => !!c.product_name);
	return rows.filter((c: Record<string, unknown>) => c.status === filter);
}

async function fetchNewsletter() {
	const { data, error } = await serviceClient()
		.from("newsletter_subscribers")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}

async function fetchSell(filter?: string) {
	const { data, error } = await serviceClient()
		.from("sell_submissions")
		.select("*")
		.order("created_at", { ascending: false });
	if (error) throw error;
	const rows = data ?? [];
	if (!filter || filter === "all") return rows;
	return rows.filter((s: Record<string, unknown>) => s.status === filter);
}

// ── Schema definitions ────────────────────────────────────────────────────────
// Each type has:
//   fullHeaders / fullRow  → used for CSV & XLSX (all fields)
//   pdfHeaders / pdfRow    → used for PDF (slim, readable columns)

type Row = Record<string, unknown>;

interface Schema {
	fullHeaders: string[];
	fullRow: (r: Row) => unknown[];
	pdfHeaders: string[];
	pdfRow: (r: Row) => string[];
}

const SCHEMAS: Record<string, Schema> = {
	orders: {
		fullHeaders: [
			"id", "payment_intent_id",
			"first_name", "last_name", "email", "phone",
			"items", "amount", "currency", "status",
			"address_line1", "address_line2", "city", "state", "postal_code", "country",
			"delivery_type", "delivery_notes", "notes", "created_at",
		],
		fullRow: (o) => [
			o.id, o.payment_intent_id,
			o.customer_first_name, o.customer_last_name, o.customer_email, o.customer_phone,
			Array.isArray(o.items)
				? (o.items as Array<{ name: string; quantity: number }>).map((i) => `${i.name} x${i.quantity}`).join("; ")
				: "",
			o.amount, o.currency, o.status,
			o.address_line1, o.address_line2, o.city, o.state, o.postal_code, o.country,
			o.delivery_type, o.delivery_notes,
			typeof o.notes === "object" && o.notes !== null ? JSON.stringify(o.notes) : o.notes,
			o.created_at,
		],
		pdfHeaders: ["Date", "Customer", "Email", "Items", "Amount", "Status", "City", "Delivery"],
		pdfRow: (o) => [
			formatDate(o.created_at),
			`${str(o.customer_first_name)} ${str(o.customer_last_name)}`.trim(),
			str(o.customer_email),
			Array.isArray(o.items)
				? (o.items as Array<{ name: string; quantity: number }>).map((i) => `${i.name} x${i.quantity}`).join("\n")
				: "",
			`${str(o.amount)} ${str(o.currency).toUpperCase()}`,
			str(o.status),
			str(o.city),
			str(o.delivery_type),
		],
	},

	contacts: {
		fullHeaders: [
			"id", "first_name", "last_name", "email", "phone",
			"interest", "message", "preferred_contact_method",
			"product_id", "product_name", "product_price", "product_category",
			"status", "created_at",
		],
		fullRow: (c) => [
			c.id, c.first_name, c.last_name, c.email, c.phone,
			c.interest, c.message, c.preferred_contact_method,
			c.product_id, c.product_name, c.product_price, c.product_category,
			c.status, c.created_at,
		],
		pdfHeaders: ["Date", "Name", "Email", "Phone", "Interest", "Message", "Status"],
		pdfRow: (c) => [
			formatDate(c.created_at),
			`${str(c.first_name)} ${str(c.last_name)}`.trim(),
			str(c.email),
			str(c.phone),
			str(c.interest),
			str(c.message).slice(0, 120),
			str(c.status),
		],
	},

	newsletter: {
		fullHeaders: ["id", "email", "name", "subscribed", "created_at"],
		fullRow: (n) => [n.id, n.email, n.name, n.subscribed, n.created_at],
		pdfHeaders: ["Date", "Email", "Name", "Subscribed"],
		pdfRow: (n) => [
			formatDate(n.created_at),
			str(n.email),
			str(n.name),
			n.subscribed ? "Yes" : "No",
		],
	},

	sell: {
		fullHeaders: [
			"id", "full_name", "email", "phone", "country",
			"brand", "model", "reference_number", "year_of_manufacture", "condition",
			"has_box", "has_papers", "best_offer", "offer_amount", "jeweller_name",
			"additional_info", "notes", "status", "created_at",
		],
		fullRow: (s) => [
			s.id, s.full_name, s.email, s.phone, s.country,
			s.brand, s.model, s.reference_number, s.year_of_manufacture, s.condition,
			s.has_box, s.has_papers, s.best_offer, s.offer_amount, s.jeweller_name,
			s.additional_info, s.notes, s.status, s.created_at,
		],
		pdfHeaders: ["Date", "Name", "Email", "Brand", "Model", "Condition", "Best Offer", "Status"],
		pdfRow: (s) => [
			formatDate(s.created_at),
			str(s.full_name),
			str(s.email),
			str(s.brand),
			str(s.model),
			str(s.condition),
			str(s.best_offer),
			str(s.status),
		],
	},
};

const TITLES: Record<string, string> = {
	orders: "LKB Jewellers — Orders",
	contacts: "LKB Jewellers — Contact Leads",
	newsletter: "LKB Jewellers — Newsletter Subscribers",
	sell: "LKB Jewellers — Sell Submissions",
};

// ── Renderers ─────────────────────────────────────────────────────────────────

function renderCsv(headers: string[], rows: unknown[][]): Buffer {
	const escape = (v: unknown) => {
		const t = v == null ? "" : String(v).replace(/\r?\n|\r/g, " ");
		return `"${t.replace(/"/g, '""')}"`;
	};
	const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
	return Buffer.from(`\uFEFF${csv}`, "utf-8");
}

function renderXlsx(headers: string[], rows: unknown[][]): Buffer {
	const ws = XLSX.utils.aoa_to_sheet([headers, ...rows.map((r) => r.map((v) => v ?? ""))]);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Data");
	return Buffer.from(XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));
}

function renderPdf(title: string, headers: string[], rows: string[][]): Buffer {
	const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

	// Title block
	doc.setFillColor(15, 15, 15);
	doc.rect(0, 0, doc.internal.pageSize.getWidth(), 52, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(16);
	doc.text(title, 30, 28);
	doc.setFontSize(8);
	doc.setTextColor(180, 180, 180);
	doc.text(`Exported: ${new Date().toLocaleString("en-GB")}  ·  ${rows.length} record${rows.length !== 1 ? "s" : ""}`, 30, 44);

	autoTable(doc, {
		head: [headers],
		body: rows,
		startY: 62,
		margin: { left: 20, right: 20 },
		styles: {
			fontSize: 8,
			cellPadding: { top: 5, right: 6, bottom: 5, left: 6 },
			overflow: "linebreak",
			lineColor: [220, 220, 220],
			lineWidth: 0.3,
		},
		headStyles: {
			fillColor: [20, 20, 20],
			textColor: [255, 255, 255],
			fontStyle: "bold",
			fontSize: 8,
		},
		alternateRowStyles: { fillColor: [248, 248, 248] },
		columnStyles: {
			// Give message / items columns more room
			...(headers.includes("Message") ? { 5: { cellWidth: 120 } } : {}),
			...(headers.includes("Items") ? { 3: { cellWidth: 120 } } : {}),
		},
		didDrawPage: (data: { pageNumber: number }) => {
			// Footer with page number
			const pageSize = doc.internal.pageSize;
			doc.setFontSize(7);
			doc.setTextColor(150);
			doc.text(
				`Page ${data.pageNumber}`,
				pageSize.getWidth() - 30,
				pageSize.getHeight() - 10,
				{ align: "right" }
			);
		},
	});

	return Buffer.from(doc.output("arraybuffer"));
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
	if (!isAuthenticated(request)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = request.nextUrl;
	const type = searchParams.get("type") ?? "";
	const format = searchParams.get("format") ?? "csv";
	const filter = searchParams.get("filter") ?? "all";

	if (!["orders", "contacts", "newsletter", "sell"].includes(type)) {
		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	}
	if (!["csv", "xlsx", "pdf"].includes(format)) {
		return NextResponse.json({ error: "Invalid format" }, { status: 400 });
	}

	const schema = SCHEMAS[type];
	const title = TITLES[type];
	const date = new Date().toISOString().slice(0, 10);

	let rawRows: Row[];
	if (type === "orders") rawRows = await fetchOrders();
	else if (type === "contacts") rawRows = await fetchContacts(filter);
	else if (type === "newsletter") rawRows = await fetchNewsletter();
	else rawRows = await fetchSell(filter);

	let body: Buffer;
	let contentType: string;
	let filename: string;

	if (format === "csv") {
		const rows = rawRows.map(schema.fullRow);
		body = renderCsv(schema.fullHeaders, rows);
		contentType = "text/csv; charset=utf-8";
		filename = `${type}-${date}.csv`;
	} else if (format === "xlsx") {
		const rows = rawRows.map(schema.fullRow);
		body = renderXlsx(schema.fullHeaders, rows);
		contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
		filename = `${type}-${date}.xlsx`;
	} else {
		const rows = rawRows.map(schema.pdfRow);
		body = renderPdf(title, schema.pdfHeaders, rows);
		contentType = "application/pdf";
		filename = `${type}-${date}.pdf`;
	}

	return new NextResponse(new Uint8Array(body), {
		headers: {
			"Content-Type": contentType,
			"Content-Disposition": `attachment; filename="${filename}"`,
			"Cache-Control": "no-store",
		},
	});
}

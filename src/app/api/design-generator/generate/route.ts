import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are a luxury jewellery design AI for LKB Jewellers, a prestigious Hatton Garden London jeweller.

STRICT RULES:
- You MUST ONLY generate images of jewellery pieces (rings, necklaces, bracelets, earrings, pendants, chains, watches, brooches, cufflinks, etc.)
- REFUSE any request that is not related to jewellery design. If the user asks for anything non-jewellery, respond with a polite refusal.
- The generated jewellery should look realistic, high-end, and luxurious
- Focus on fine details: gemstones, metal textures, craftsmanship
- Style should be professional product photography on a dark/black background
- Never generate images of people, animals, weapons, or anything inappropriate

Generate a photorealistic image of the following jewellery piece:`;

export async function POST(request: NextRequest) {
	try {
		if (!GEMINI_API_KEY) {
			return NextResponse.json(
				{ error: "Gemini API key not configured" },
				{ status: 500 }
			);
		}

		const body = await request.json();
		const { prompt, metal, stone, style } = body;

		if (!prompt && !metal && !stone && !style) {
			return NextResponse.json(
				{ error: "Please provide a description for your jewellery design" },
				{ status: 400 }
			);
		}

		// Build the full prompt
		const parts: string[] = [];
		if (prompt) parts.push(prompt.trim());
		if (metal) parts.push(`Metal: ${metal}`);
		if (stone) parts.push(`Primary stone: ${stone}`);
		if (style) parts.push(`Design style: ${style}`);

		const fullPrompt = `${SYSTEM_PROMPT}\n\n${parts.join(". ")}.\n\nPhotorealistic product shot on dark background, high-end luxury jewellery photography, detailed craftsmanship, 8K quality.`;

		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [
						{
							parts: [{ text: fullPrompt }],
						},
					],
					generationConfig: {
						responseModalities: ["TEXT", "IMAGE"],
					},
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.text();
			console.error("Gemini API error:", errorData);
			return NextResponse.json(
				{ error: "Failed to generate design. Please try again." },
				{ status: 500 }
			);
		}

		const data = await response.json();

		// Extract image and text from response
		let imageBase64: string | null = null;
		let mimeType: string | null = null;
		let description: string | null = null;

		const candidates = data.candidates;
		if (candidates && candidates[0]?.content?.parts) {
			for (const part of candidates[0].content.parts) {
				if (part.inlineData) {
					imageBase64 = part.inlineData.data;
					mimeType = part.inlineData.mimeType;
				}
				if (part.text) {
					description = part.text;
				}
			}
		}

		if (!imageBase64) {
			// Check if Gemini refused the request
			if (description) {
				return NextResponse.json({
					success: true,
					image: null,
					description,
					refused: true,
				});
			}
			return NextResponse.json(
				{ error: "No image was generated. Please try a different description." },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			image: `data:${mimeType};base64,${imageBase64}`,
			description,
		});
	} catch (err) {
		console.error("Design generation error:", err);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

"use client";

import { useState } from "react";
import Link from "next/link";

interface LeadData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  form?: string;
}

type Metal = "Gold" | "Rose Gold" | "Silver" | "Platinum";
type Stone = "Diamond" | "Ruby" | "Emerald" | "Sapphire";
type DesignStyle = "Classic" | "Modern" | "Vintage" | "Minimalist";

function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps: { num: 1 | 2 | 3; label: string }[] = [
    { num: 1, label: "Your Details" },
    { num: 2, label: "Design Vision" },
    { num: 3, label: "Preview" },
  ];

  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                currentStep >= step.num
                  ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                  : "border-gray-700 text-gray-600 bg-transparent"
              }`}
            >
              {step.num}
            </div>
            <span
              className={`text-xs mt-1.5 tracking-wider transition-colors duration-300 ${
                currentStep >= step.num ? "text-[#D4AF37]" : "text-gray-600"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 h-px mx-3 mb-5 transition-colors duration-500 ${
                currentStep > step.num ? "bg-[#D4AF37]" : "bg-gray-800"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ShimmerLoader() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-7 w-52 rounded bg-gray-800" />
      <div className="w-full h-64 rounded-lg relative overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.07) 50%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="text-gray-700 text-5xl">✦</span>
          <p
            className="text-gray-600 text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily:
                '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
            }}
          >
            Generating your design...
          </p>
        </div>
      </div>
      <div className="h-4 w-full rounded bg-gray-800" />
      <div className="h-4 w-3/4 rounded bg-gray-800" />
      <div className="h-4 w-1/2 rounded bg-gray-800" />
    </div>
  );
}

export default function BespokeDesignPage() {
  const [leadData, setLeadData] = useState<LeadData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [selectedMetal, setSelectedMetal] = useState<Metal | null>(null);
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultPrompt, setResultPrompt] = useState("");
  const [resultTags, setResultTags] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const metals: Metal[] = ["Gold", "Rose Gold", "Silver", "Platinum"];
  const stones: Stone[] = ["Diamond", "Ruby", "Emerald", "Sapphire"];
  const styles: DesignStyle[] = ["Classic", "Modern", "Vintage", "Minimalist"];

  const validateLead = (): boolean => {
    const newErrors: FormErrors = {};
    if (!leadData.name.trim()) newErrors.name = "Full name is required";
    if (!leadData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!leadData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateLead()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/design-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadData.name.trim(),
          email: leadData.email.trim(),
          phone: leadData.phone.trim(),
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        id?: string;
        error?: string;
      };

      if (!res.ok || data.error) {
        setErrors({
          form: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setStep(2);
    } catch {
      setErrors({
        form: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    const tags: string[] = [];
    if (selectedMetal) tags.push(selectedMetal);
    if (selectedStone) tags.push(selectedStone);
    if (selectedStyle) tags.push(selectedStyle);

    const userPrompt = prompt.trim() || "A beautiful bespoke jewellery piece crafted to perfection";
    setResultPrompt(userPrompt);
    setResultTags(tags);
    setIsGenerating(true);
    setShowResult(false);
    setGeneratedImage(null);
    setGenerateError(null);
    setStep(3);

    try {
      const res = await fetch("/api/design-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          metal: selectedMetal,
          stone: selectedStone,
          style: selectedStyle,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setGenerateError(data.error || "Failed to generate design");
        setIsGenerating(false);
        setShowResult(true);
        return;
      }

      if (data.refused) {
        setGenerateError(data.description || "This request is not related to jewellery design.");
        setIsGenerating(false);
        setShowResult(true);
        return;
      }

      setGeneratedImage(data.image);
      setIsGenerating(false);
      setShowResult(true);
    } catch {
      setGenerateError("Network error. Please try again.");
      setIsGenerating(false);
      setShowResult(true);
    }
  };

  const handleGenerateAnother = () => {
    setPrompt("");
    setSelectedMetal(null);
    setSelectedStone(null);
    setSelectedStyle(null);
    setShowResult(false);
    setIsGenerating(false);
    setStep(2);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <section className="relative pt-32 pb-8 md:pt-40 md:pb-10 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex items-center gap-4 mb-5 justify-center">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span
              className="text-[#D4AF37] text-xs tracking-[0.5em] uppercase"
              style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
            >
              AI Jewellery Design
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-normal text-white mb-4 tracking-tight leading-tight">
            Design Your Dream
            <br />
            <span className="text-[#D4AF37]">Jewellery</span>
          </h1>

          <div className="w-16 md:w-24 h-px bg-[#D4AF37]/40 mx-auto mb-5" />

          <p
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
            style={{
              fontFamily:
                '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
            }}
          >
            Describe your vision and our AI will generate a preview of your
            bespoke piece — then our master craftsmen will bring it to life.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        <StepIndicator currentStep={step} />
      </div>

      {step === 1 && (
        <section className="container mx-auto px-4 md:px-6 pb-24 max-w-lg">
          <div className="border border-gray-800 rounded-2xl p-6 md:p-8 bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

            <h2 className="text-2xl font-heading text-white mb-1.5">
              Tell us about yourself
            </h2>
            <p
              className="text-gray-500 text-sm mb-6"
              style={{
                fontFamily:
                  '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
              }}
            >
              We&apos;ll keep your details to help bring your vision to life.
            </p>

            <form
              onSubmit={handleLeadSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div>
                <label
                  className="text-gray-400 text-xs uppercase tracking-widest block mb-1.5"
                  style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={leadData.name}
                  onChange={(e) =>
                    setLeadData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full bg-black border rounded text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37] transition-colors ${
                    errors.name ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  className="text-gray-400 text-xs uppercase tracking-widest block mb-1.5"
                  style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={leadData.email}
                  onChange={(e) =>
                    setLeadData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`w-full bg-black border rounded text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37] transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="your@email.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  className="text-gray-400 text-xs uppercase tracking-widest block mb-1.5"
                  style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={leadData.phone}
                  onChange={(e) =>
                    setLeadData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={`w-full bg-black border rounded text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37] transition-colors ${
                    errors.phone ? "border-red-500" : "border-gray-700"
                  }`}
                  placeholder="+44 7xxx xxx xxx"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {errors.form && (
                <p className="text-red-400 text-sm border border-red-500/30 rounded bg-red-500/10 py-2.5 px-4">
                  {errors.form}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 bg-[#D4AF37] text-black font-bold tracking-widest text-sm py-3.5 px-8 hover:bg-[#c4a030] active:bg-[#b39028] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SAVING..." : "GET STARTED →"}
              </button>
            </form>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="container mx-auto px-4 md:px-6 pb-24 max-w-2xl">
          <div className="border border-gray-800 rounded-2xl p-6 md:p-8 bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

            <h2 className="text-2xl font-heading text-white mb-1.5">
              Describe Your Vision
            </h2>
            <p
              className="text-gray-500 text-sm mb-6"
              style={{
                fontFamily:
                  '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
              }}
            >
              The more detail, the better. What does your dream piece look like?
            </p>

            <div className="flex flex-col gap-5">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full bg-black border border-gray-700 rounded text-white placeholder-gray-700 focus:outline-none focus:border-[#D4AF37] transition-colors resize-none leading-relaxed"
                placeholder="A delicate rose gold necklace with a pear-shaped diamond pendant, engraved with initials on the back..."
                style={{
                  fontFamily:
                    '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
                }}
              />

              <div className="border border-gray-800 rounded-xl p-4 flex flex-col gap-4 bg-black/50">
                <p
                  className="text-gray-500 text-xs uppercase tracking-widest"
                  style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                >
                  Refine Your Style (Optional)
                </p>

                <div>
                  <p
                    className="text-gray-600 text-xs mb-2"
                    style={{
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    Metal
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {metals.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          setSelectedMetal(selectedMetal === m ? null : m)
                        }
                        className={`px-3 py-1 rounded-full text-xs border transition-all duration-200 ${
                          selectedMetal === m
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold"
                            : "border-gray-700 text-gray-400 hover:border-[#D4AF37]/50 hover:text-gray-200"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p
                    className="text-gray-600 text-xs mb-2"
                    style={{
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    Stone
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stones.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setSelectedStone(selectedStone === s ? null : s)
                        }
                        className={`px-3 py-1 rounded-full text-xs border transition-all duration-200 ${
                          selectedStone === s
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold"
                            : "border-gray-700 text-gray-400 hover:border-[#D4AF37]/50 hover:text-gray-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p
                    className="text-gray-600 text-xs mb-2"
                    style={{
                      fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                  >
                    Style
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {styles.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() =>
                          setSelectedStyle(selectedStyle === st ? null : st)
                        }
                        className={`px-3 py-1 rounded-full text-xs border transition-all duration-200 ${
                          selectedStyle === st
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black font-bold"
                            : "border-gray-700 text-gray-400 hover:border-[#D4AF37]/50 hover:text-gray-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                className="bg-[#D4AF37] text-black font-bold tracking-widest text-sm py-3.5 px-8 hover:bg-[#c4a030] active:bg-[#b39028] transition-colors flex items-center justify-center gap-2"
              >
                <span>GENERATE MY DESIGN</span>
                <span className="text-base">✦</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="container mx-auto px-4 md:px-6 pb-24 max-w-2xl">
          <div className="border border-gray-800 rounded-2xl p-6 md:p-8 bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

            {isGenerating ? (
              <ShimmerLoader />
            ) : showResult ? (
              <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-heading text-white">
                  Your AI Design Preview
                </h2>

                <div
                  className="w-full h-64 rounded-lg flex flex-col items-center justify-center relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, #100c00 0%, #2e2000 25%, #6b4c00 50%, #D4AF37 65%, #8b6914 80%, #2e2000 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 60% 40%, rgba(212,175,55,0.4) 0%, transparent 65%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 relative z-10">
                    <span
                      className="text-6xl md:text-8xl text-[#D4AF37]"
                      style={{
                        textShadow:
                          "0 0 30px rgba(212,175,55,0.9), 0 0 60px rgba(212,175,55,0.5)",
                        filter: "drop-shadow(0 0 12px rgba(212,175,55,0.8))",
                      }}
                    >
                      ✦
                    </span>
                    <p
                      className="text-[#D4AF37]/70 text-xs tracking-[0.4em] uppercase"
                      style={{
                        fontFamily:
                          "ui-sans-serif, system-ui, sans-serif",
                      }}
                    >
                      AI Design Preview
                    </p>
                  </div>
                </div>

                <div className="border-l-2 border-[#D4AF37]/60 pl-4">
                  <p
                    className="text-gray-300 text-sm leading-relaxed italic"
                    style={{
                      fontFamily:
                        '"Mona Sans", "Mona Sans Fallback", ui-sans-serif, system-ui, sans-serif',
                    }}
                  >
                    &ldquo;{resultPrompt}&rdquo;
                  </p>
                </div>

                {resultTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {resultTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs border border-[#D4AF37]/30 text-[#D4AF37]/80 bg-[#D4AF37]/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/contact"
                    className="flex-1 text-center bg-[#D4AF37] text-black font-bold tracking-widest text-xs py-3.5 px-4 hover:bg-[#c4a030] transition-colors"
                  >
                    BOOK A CONSULTATION TO BRING THIS TO LIFE →
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAnother}
                  className="w-full border border-gray-700 text-gray-400 text-xs py-3 px-4 hover:border-[#D4AF37]/40 hover:text-gray-200 transition-colors tracking-widest"
                >
                  GENERATE ANOTHER DESIGN
                </button>

                <p
                  className="text-gray-700 text-xs text-center"
                  style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
                >
                  Powered by Gemini AI • Results shown are illustrative
                </p>
              </div>
            ) : null}
          </div>
        </section>
      )}
    </div>
  );
}

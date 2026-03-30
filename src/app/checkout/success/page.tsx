"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "paid" | "failed">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "paid") {
          setStatus("paid");
          setEmail(data.customerEmail);
          clearCart();
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [sessionId, clearCart]);

  if (status === "loading") {
    return (
      <div className="bg-black min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-6 animate-spin" />
          <p className="text-gray-400 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-black min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-8" />
          <h1 className="text-4xl text-white mb-4 font-heading">
            Payment Not Verified
          </h1>
          <p className="text-gray-400 mb-10">
            We couldn&apos;t verify your payment. If you were charged, please
            contact us and we&apos;ll resolve this immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-black hover:bg-gray-200 tracking-widest text-sm px-8 py-3 h-auto">
              <Link href="/contact">CONTACT US</Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-700 text-white hover:bg-gray-900 tracking-widest text-sm px-8 py-3 h-auto">
              <Link href="/">GO HOME</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
      <div className="text-center max-w-lg">
        <CheckCircle className="w-20 h-20 text-[#D4AF37] mx-auto mb-8" />
        <h1 className="text-4xl md:text-5xl text-white mb-4 font-heading">
          Thank You
        </h1>
        <p className="text-gray-400 mb-2 text-lg">
          Your order has been placed successfully.
        </p>
        {email && (
          <p className="text-gray-500 mb-10 text-sm">
            A confirmation email will be sent to {email}.
          </p>
        )}
        {!email && (
          <p className="text-gray-500 mb-10 text-sm">
            A confirmation email will be sent to you shortly.
          </p>
        )}
        <Button asChild className="bg-white text-black hover:bg-gray-200 tracking-widest text-sm px-8 py-3 h-auto">
          <Link href="/">CONTINUE SHOPPING</Link>
        </Button>
      </div>
    </div>
  );
}

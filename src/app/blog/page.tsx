"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
  {
    id: 1,
    title: "The Art of Choosing the Perfect Engagement Ring",
    date: "15 January 2025",
    excerpt:
      "Discover the essential factors to consider when selecting an engagement ring that will be treasured for a lifetime. From diamond cuts to metal choices, our experts guide you through every decision.",
    image:
      "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2023/10/DAVIDO-42-scaled.jpg?resize=1229%2C1536&ssl=1",
    category: "Jewellery Guide",
  },
  {
    id: 2,
    title: "Luxury Watch Maintenance: A Complete Guide",
    date: "28 December 2024",
    excerpt:
      "Your luxury timepiece is an investment worth protecting. Learn the essential maintenance tips to keep your watch running perfectly and looking its best for years to come.",
    image:
      "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2023/10/WE-BUY-WATCHES-scaled.jpg?fit=1638%2C2048&ssl=1",
    category: "Watch Care",
  },
  {
    id: 3,
    title: "Behind the Scenes: Crafting a Bespoke Pendant",
    date: "10 November 2024",
    excerpt:
      "Follow the journey of a custom LKB pendant from initial sketch to final polish. See how our master jewellers transform raw materials into wearable art.",
    image:
      "https://i0.wp.com/lkbjewellers.com/wp-content/uploads/2025/02/LKB-GRM-CROWN-JEWELS-BTS-64-scaled.jpeg?resize=1400%2C788&ssl=1",
    category: "Behind The Scenes",
  },
];

export default function BlogPage() {
  return (
    <div className="bg-black min-h-screen pt-32 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white" />
            <span className="text-white text-xs tracking-[0.5em] uppercase">
              Stories &amp; Insights
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white" />
          </div>
          <h1
            className="text-5xl md:text-7xl text-white mb-6 font-normal font-heading"
          >
            Blog
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-display">
            Explore our latest articles on luxury jewellery, watch care, and the
            art of fine craftsmanship.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-gray-900/30 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#D4AF37] text-black text-xs font-bold tracking-wider px-3 py-1 rounded-full uppercase hover:bg-[#D4AF37]">
                    {post.category}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <h2
                  className="text-xl text-white mb-3 font-normal group-hover:text-[#D4AF37] transition-colors font-heading"
                >
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-[#D4AF37] text-xs tracking-widest uppercase group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Decorative */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/30" />
        </div>
      </div>
    </div>
  );
}

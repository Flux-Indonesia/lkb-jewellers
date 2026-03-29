import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl md:text-9xl text-white font-heading mb-4">404</h1>
        <div className="w-16 h-px bg-white/30 mx-auto mb-6" />
        <p className="text-gray-400 text-lg mb-2">Page Not Found</p>
        <p className="text-gray-600 text-sm mb-10">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-white text-black font-bold tracking-widest text-sm hover:bg-gray-200 transition-colors"
          >
            GO HOME
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 border border-gray-700 text-white font-bold tracking-widest text-sm hover:bg-gray-900 transition-colors"
          >
            BROWSE SHOP
          </Link>
        </div>
      </div>
    </div>
  );
}

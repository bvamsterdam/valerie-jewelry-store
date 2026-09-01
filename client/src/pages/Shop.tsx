import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { trpc } from "@/lib/trpc";
import { PREVIEW_PRODUCTS, filterProductsByCategory } from "@shared/catalog";
import { useMemo } from "react";
import { Link, useLocation } from "wouter";

const filters = [
  { label: "All Jewelry", value: "all" },
  { label: "Rings", value: "rings" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Bracelets", value: "bracelets" },
  { label: "Earrings", value: "earrings" },
];

export default function Shop() {
  const [location] = useLocation();
  const selectedCategory = useMemo(() => {
    const search = location.includes("?") ? location.split("?")[1] : window.location.search.slice(1);
    return new URLSearchParams(search).get("category") || "all";
  }, [location]);
  const catalog = trpc.storefront.catalog.useQuery(undefined, {
    staleTime: 60_000,
    placeholderData: { products: PREVIEW_PRODUCTS, source: "preview" },
  });
  const products = filterProductsByCategory(catalog.data?.products ?? [], selectedCategory);
  const selectedLabel = filters.find(filter => filter.value === selectedCategory)?.label || "All Jewelry";

  return (
    <>
      <Seo
        title={`${selectedLabel} | Valerie Jewelry`}
        description="Shop Valerie Jewelry rings, necklaces, bracelets, and earrings—premium gold-plated pieces with modern style and timeless elegance."
        path={selectedCategory === "all" ? "/shop" : `/shop?category=${selectedCategory}`}
      />

      <header className="relative overflow-hidden bg-[#2b241f] px-6 py-20 text-center text-[#f8f1e6] sm:py-24">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,#c99a52_0,transparent_22%),radial-gradient(circle_at_80%_70%,#9d7138_0,transparent_20%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="eyebrow text-[#d6b16d]">The collection</p>
          <h1 className="mt-4 font-display text-5xl font-light sm:text-6xl">Jewelry with presence</h1>
          <p className="mx-auto mt-5 max-w-xl font-body text-xs leading-6 tracking-wide text-[#d1c6b7]">
            Discover luminous pieces shaped for layering, gifting, and bringing quiet confidence to every day.
          </p>
        </div>
      </header>

      <section className="section-space bg-[#fbf7ef]">
        <div className="container">
          <nav
            className="no-scrollbar flex overflow-x-auto border-b border-[#d8cbb8]"
            aria-label="Filter jewelry by category"
          >
            {filters.map(filter => {
              const active = selectedCategory === filter.value;
              return (
                <Link
                  key={filter.value}
                  href={filter.value === "all" ? "/shop" : `/shop?category=${filter.value}`}
                  aria-current={active ? "page" : undefined}
                  className={`relative shrink-0 px-5 py-4 font-body text-[0.6rem] font-medium uppercase tracking-[0.17em] transition-colors first:pl-0 sm:px-7 ${
                    active ? "text-[#9a6b26]" : "text-[#655b52] hover:text-[#9a6b26]"
                  }`}
                >
                  {filter.label}
                  {active && <span className="absolute inset-x-5 bottom-0 h-px bg-[#a87932] first:left-0" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Curated pieces</p>
              <h2 className="mt-2 font-display text-4xl text-[#241e1a]">{selectedLabel}</h2>
            </div>
            <p className="font-body text-[0.58rem] uppercase tracking-[0.16em] text-[#766b61]">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {catalog.data?.source === "preview" && (
            <div className="mt-7 border-l-2 border-[#b8863b] bg-[#f3eadc] px-5 py-4 font-body text-xs leading-6 text-[#5f554c]">
              The approved Valerie catalog preview is shown now. Live Shopify inventory and pricing will replace it automatically when Shopify completes the new client-store permission fix.
            </div>
          )}

          {catalog.isLoading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map(item => (
                <div key={item}>
                  <div className="aspect-[4/5] animate-pulse bg-[#e7ddcf]" />
                  <div className="mt-4 h-4 w-2/3 animate-pulse bg-[#e7ddcf]" />
                </div>
              ))}
            </div>
          ) : catalog.isError ? (
            <div className="mt-12 border-y border-[#d8cbb8] py-16 text-center">
              <h2 className="font-display text-3xl">The collection could not be loaded.</h2>
              <p className="mt-3 font-body text-xs text-[#6c6258]">Please refresh the page or contact Valerie Jewelry for assistance.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-12 border-y border-[#d8cbb8] py-16 text-center">
              <p className="eyebrow">Coming soon</p>
              <h2 className="mt-3 font-display text-4xl">New {selectedLabel.toLowerCase()} are being curated.</h2>
              <p className="mx-auto mt-4 max-w-md font-body text-xs leading-6 text-[#6c6258]">
                Explore the complete Valerie edit while this collection is prepared.
              </p>
              <Link href="/shop" className="luxury-button mt-7">View all jewelry</Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

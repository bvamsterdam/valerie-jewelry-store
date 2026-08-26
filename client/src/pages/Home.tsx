import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { trpc } from "@/lib/trpc";
import { ASSETS, BRAND, COLLECTIONS, PREVIEW_PRODUCTS } from "@shared/catalog";
import { ArrowDown, ArrowRight, Gem, Sparkles, Star } from "lucide-react";
import { Link } from "wouter";

const values = [
  {
    number: "01",
    title: "Modern Designs",
    body: "Clean silhouettes and luminous details designed to move naturally from everyday moments to meaningful occasions.",
  },
  {
    number: "02",
    title: "Premium Gold-Plated Quality",
    body: "Considered materials, polished finishes, and careful construction give every piece its distinctive Valerie glow.",
  },
  {
    number: "03",
    title: "Made to Empower",
    body: "Jewelry that celebrates confidence, individuality, femininity, and the freedom to define your own style.",
  },
];

export default function Home() {
  const catalog = trpc.storefront.catalog.useQuery(undefined, {
    staleTime: 60_000,
    placeholderData: { products: PREVIEW_PRODUCTS, source: "preview" },
  });
  const products = catalog.data?.products ?? [];

  return (
    <>
      <Seo
        title="Valerie Jewelry — Timeless Jewelry, Modern Soul"
        description="Discover Valerie Jewelry: premium gold-plated rings, necklaces, bracelets, and earrings designed with timeless elegance and a modern spirit."
      />

      <section className="relative min-h-[720px] overflow-hidden bg-[#342b25] lg:min-h-[760px]">
        <img
          src={ASSETS.hero}
          alt="Valerie Jewelry editorial campaign"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,16,13,0.70)_0%,rgba(21,16,13,0.34)_48%,rgba(21,16,13,0.08)_100%)]" />
        <div className="container relative z-10 flex min-h-[720px] items-center py-24 lg:min-h-[760px]">
          <div className="max-w-xl text-white">
            <p className="eyebrow text-[#e2bf7d]">{BRAND.eyebrow}</p>
            <h1 className="mt-6 font-display text-6xl font-light leading-[0.94] tracking-[0.01em] sm:text-7xl lg:text-[5.6rem]">
              Crafted for
              <span className="block font-normal italic text-[#f0d49b]">You</span>
            </h1>
            <p className="mt-7 max-w-md font-body text-sm font-light leading-7 tracking-wide text-white/82">
              {BRAND.description}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="luxury-button luxury-button-gold">
                Explore collections <ArrowRight className="h-4 w-4 stroke-[1.4]" />
              </Link>
              <Link href="/about" className="luxury-button luxury-button-light">
                Our story
              </Link>
            </div>
          </div>
        </div>
        <a
          href="#collections"
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-body text-[0.52rem] uppercase tracking-[0.22em] text-white/70 md:flex"
        >
          Discover <ArrowDown className="h-4 w-4 animate-bounce stroke-[1.2]" />
        </a>
      </section>

      <div className="ticker-shell" aria-label="Valerie Jewelry qualities">
        <div className="ticker-track">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} className="ticker-item">
              <Star className="h-2.5 w-2.5" /> Premium Gold-Plated Jewelry
              <Sparkles className="h-2.5 w-2.5" /> Modern Style · Timeless Elegance
            </span>
          ))}
        </div>
      </div>

      <section id="collections" className="section-space bg-[#fbf7ef]">
        <div className="container">
          <div className="section-intro">
            <div>
              <p className="eyebrow">The collections</p>
              <h2 className="section-title">Find your signature</h2>
            </div>
            <p className="section-copy">
              Curated forms, warm finishes, and versatile pieces made to be layered, gifted, and lived in.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((collection, index) => (
              <Link
                key={collection.slug}
                href={`/shop?category=${collection.slug}`}
                className={`collection-card group ${index % 2 === 1 ? "lg:mt-12" : ""}`}
              >
                <img
                  src={collection.image}
                  alt={`${collection.name} collection`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="font-body text-[0.54rem] uppercase tracking-[0.18em] text-[#e4c68e]">
                    Collection 0{index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-light">{collection.name}</h3>
                  <p className="mt-1 font-body text-[11px] tracking-wide text-white/75">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-[#f2eadf]">
        <div className="container">
          <div className="section-intro">
            <div>
              <p className="eyebrow">New arrivals</p>
              <h2 className="section-title">The Valerie edit</h2>
            </div>
            <Link href="/shop" className="text-link">
              View all jewelry <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {catalog.isLoading ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map(item => (
                <div key={item} className="aspect-[4/5] animate-pulse bg-[#e6dccd]" />
              ))}
            </div>
          ) : catalog.isError ? (
            <div className="mt-12 border border-[#cbbda8] p-8 text-center">
              <p className="font-display text-2xl">The collection is being prepared.</p>
              <p className="mt-2 font-body text-xs text-[#6b6157]">
                Please refresh shortly or contact us for assistance.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 3).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#2b241f] text-[#f8f1e6]">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[520px] overflow-hidden lg:min-h-[680px]">
            <img
              src={ASSETS.story}
              alt="The Valerie Jewelry story"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:px-24">
            <div className="max-w-xl">
              <p className="eyebrow text-[#d6b16d]">Our story</p>
              <h2 className="mt-5 font-display text-5xl font-light leading-[1.03] sm:text-6xl">
                Jewelry for the woman who chooses her own light.
              </h2>
              <p className="mt-7 font-body text-sm font-light leading-7 tracking-wide text-[#d7cdc0]">
                Valerie was created for women who embrace individuality and express their style with confidence. Each collection pairs modern design with timeless elegance, bringing a refined finishing touch to the moments that make a life.
              </p>
              <div className="mt-9 flex items-center gap-6 border-t border-white/15 pt-7">
                <Gem className="h-8 w-8 stroke-[1.1] text-[#d6b16d]" />
                <p className="font-display text-2xl italic text-[#f0dfc5]">
                  Made to empower. Crafted for you.
                </p>
              </div>
              <Link href="/about" className="luxury-button luxury-button-gold mt-10">
                Discover Valerie <ArrowRight className="h-4 w-4 stroke-[1.4]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-[#fbf7ef]">
        <div className="container">
          <p className="eyebrow text-center">The Valerie promise</p>
          <h2 className="section-title mx-auto mt-3 max-w-2xl text-center">
            Considered in every detail
          </h2>
          <div className="mt-14 grid border-y border-[#d8cbb8] md:grid-cols-3">
            {values.map((value, index) => (
              <article
                key={value.number}
                className={`px-2 py-9 md:px-9 ${index > 0 ? "border-t border-[#d8cbb8] md:border-l md:border-t-0" : ""}`}
              >
                <span className="font-body text-[0.56rem] tracking-[0.18em] text-[#a87932]">
                  {value.number}
                </span>
                <h3 className="mt-5 font-display text-3xl text-[#241e1a]">{value.title}</h3>
                <p className="mt-3 font-body text-xs leading-6 tracking-wide text-[#6a6057]">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

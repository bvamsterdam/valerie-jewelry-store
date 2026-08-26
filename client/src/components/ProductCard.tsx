import { formatMoney, type StorefrontProduct } from "@shared/catalog";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

export default function ProductCard({ product }: { product: StorefrontProduct }) {
  return (
    <article className="group">
      <Link
        href={`/products/${product.handle}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[#efe6d8]"
      >
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
        <span className="absolute bottom-4 right-4 grid h-10 w-10 translate-y-2 place-items-center bg-[#fbf7ef] text-[#201a17] opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4 stroke-[1.4]" />
        </span>
      </Link>
      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="font-body text-[0.55rem] font-medium uppercase tracking-[0.18em] text-[#9a6b26]">
            {product.productType || "Fine Jewelry"}
          </p>
          <h3 className="mt-1 font-display text-xl leading-tight text-[#241e1a] md:text-2xl">
            <Link href={`/products/${product.handle}`} className="hover:text-[#9a6b26]">
              {product.title}
            </Link>
          </h3>
        </div>
        <p className="shrink-0 font-body text-xs text-[#51483f]">
          {formatMoney(product.priceRange.minVariantPrice)}
        </p>
      </div>
    </article>
  );
}

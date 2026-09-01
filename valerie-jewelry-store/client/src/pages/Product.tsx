import Seo from "@/components/Seo";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { formatMoney, PREVIEW_PRODUCTS, TRUST_LABELS } from "@shared/catalog";
import { Gift, Loader2, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";

const trustIcons = [Truck, Gift, RotateCcw, ShieldCheck];

export default function Product() {
  const [, params] = useRoute("/products/:handle");
  const handle = params?.handle || "";
  const previewProduct = PREVIEW_PRODUCTS.find(product => product.handle === handle);
  const productQuery = trpc.storefront.product.useQuery(
    { handle },
    {
      enabled: Boolean(handle),
      staleTime: 60_000,
      placeholderData: previewProduct ? { product: previewProduct, source: "preview" } : undefined,
    },
  );
  const { addToBag, isPending } = useCart();
  const product = productQuery.data?.product;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState("");

  useEffect(() => {
    if (product?.variants[0]) setSelectedVariantId(product.variants[0].id);
    setSelectedImage(0);
  }, [product]);

  if (productQuery.isLoading) {
    return (
      <div className="container grid min-h-[640px] place-items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#a87932]" />
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <section className="container py-24 text-center">
        <Seo
          title="Product Not Found | Valerie Jewelry"
          description="This Valerie Jewelry product is no longer available."
          path={`/products/${handle}`}
        />
        <p className="eyebrow">Product unavailable</p>
        <h1 className="mt-4 font-display text-5xl">This piece could not be found.</h1>
        <p className="mx-auto mt-4 max-w-md font-body text-xs leading-6 text-[#695f55]">
          Explore the full Valerie edit to discover another piece for your collection.
        </p>
        <Link href="/shop" className="luxury-button mt-8">Return to the collection</Link>
      </section>
    );
  }

  const selectedVariant =
    product.variants.find(variant => variant.id === selectedVariantId) || product.variants[0];
  const mainImage = product.images[selectedImage] || product.featuredImage;

  return (
    <>
      <Seo
        title={`${product.title} | Valerie Jewelry`}
        description={product.description}
        path={`/products/${product.handle}`}
        image={product.featuredImage.url}
        type="product"
      />

      <section className="bg-[#fbf7ef] py-10 sm:py-14 lg:py-20">
        <div className="container">
          <nav className="mb-7 font-body text-[0.58rem] uppercase tracking-[0.15em] text-[#7b7065]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#9a6b26]">Home</Link>
            <span className="mx-3">/</span>
            <Link href="/shop" className="hover:text-[#9a6b26]">Jewelry</Link>
            <span className="mx-3">/</span>
            <span className="text-[#9a6b26]">{product.productType}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <div>
              <div className="aspect-square overflow-hidden bg-[#efe6d9]">
                <img
                  src={mainImage.url}
                  alt={mainImage.altText || product.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3" aria-label="Product gallery thumbnails">
                  {product.images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image.url}-${index}`}
                      aria-label={`View image ${index + 1} of ${product.images.length}`}
                      aria-pressed={selectedImage === index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square overflow-hidden border bg-[#efe6d9] transition-colors ${
                        selectedImage === index ? "border-[#a87932]" : "border-transparent hover:border-[#c8b89f]"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `${product.title} view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow">{product.productType}</p>
              <h1 className="mt-4 font-display text-5xl font-light leading-[1.02] text-[#241e1a] sm:text-6xl">
                {product.title}
              </h1>
              <p className="mt-5 font-display text-2xl text-[#9a6b26]">
                {formatMoney(selectedVariant?.price || product.priceRange.minVariantPrice)}
              </p>
              <p className="mt-6 font-body text-sm leading-7 tracking-wide text-[#61574e]">
                {product.description}
              </p>

              {product.variants.length > 1 && (
                <label className="mt-8 block">
                  <span className="font-body text-[0.58rem] font-medium uppercase tracking-[0.18em] text-[#5e554d]">
                    Select option
                  </span>
                  <select
                    value={selectedVariantId}
                    onChange={event => setSelectedVariantId(event.target.value)}
                    className="mt-3 h-12 w-full border border-[#cbbda8] bg-transparent px-4 font-body text-xs focus:border-[#a87932] focus:outline-none"
                  >
                    {product.variants.map(variant => (
                      <option key={variant.id} value={variant.id} disabled={!variant.availableForSale}>
                        {variant.title}{!variant.availableForSale ? " — Sold out" : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <button
                type="button"
                disabled={isPending || !selectedVariant?.availableForSale}
                onClick={() =>
                  selectedVariant &&
                  addToBag({
                    product,
                    variant: selectedVariant,
                    quantity: 1,
                    source: productQuery.data?.source || "preview",
                  })
                }
                className="luxury-button mt-8 w-full justify-center py-4 disabled:opacity-45"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : selectedVariant?.availableForSale ? (
                  "Add to Bag"
                ) : (
                  "Sold out"
                )}
              </button>

              <div className="mt-8 grid grid-cols-2 border-y border-[#d8cbb8] sm:grid-cols-4">
                {TRUST_LABELS.map((label, index) => {
                  const Icon = trustIcons[index];
                  return (
                    <div
                      key={label}
                      className={`flex min-h-28 flex-col items-center justify-center gap-3 px-2 py-4 text-center ${
                        index > 0 ? "border-l border-[#d8cbb8]" : ""
                      } ${index === 2 ? "border-t sm:border-t-0" : ""} ${index === 3 ? "border-t sm:border-t-0" : ""}`}
                    >
                      <Icon className="h-5 w-5 stroke-[1.2] text-[#a87932]" />
                      <span className="font-body text-[0.5rem] font-medium uppercase leading-4 tracking-[0.13em] text-[#5d544c]">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-9 divide-y divide-[#ddd1c0] border-y border-[#ddd1c0]">
                {[
                  ["Materials", product.details.materials],
                  ["Sizing", product.details.sizing],
                  ["Finish", product.details.finish],
                  ["Care", product.details.care],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-4 sm:grid-cols-[120px_1fr]">
                    <h2 className="font-body text-[0.58rem] font-medium uppercase tracking-[0.17em] text-[#9a6b26]">
                      {label}
                    </h2>
                    <p className="font-body text-xs leading-6 text-[#62584f]">{value}</p>
                  </div>
                ))}
              </div>

              {productQuery.data?.source === "preview" && (
                <p className="mt-6 font-body text-[10px] leading-5 tracking-wide text-[#887d72]">
                  Catalog preview. Live inventory, checkout, and final policy conditions will synchronize from the new Shopify client store after Shopify resolves the Partner permission issue.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  PREVIEW_PRODUCTS,
  TRUST_LABELS,
  addPreviewCartLine,
  filterProductsByCategory,
} from "../shared/catalog";
import {
  getCatalog,
  normalizeShopifyProduct,
} from "./shopify";

const root = fileURLToPath(new URL("..", import.meta.url));

describe("Valerie storefront catalog", () => {
  it("preserves the exact required trust labels", () => {
    expect(TRUST_LABELS).toEqual([
      "free insured shipping",
      "gift box",
      "30-day returns",
      "lifetime warranty",
    ]);
  });

  it("filters the preview catalog by jewelry category", () => {
    expect(filterProductsByCategory(PREVIEW_PRODUCTS, "all")).toHaveLength(1);
    expect(filterProductsByCategory(PREVIEW_PRODUCTS, "bracelets")).toHaveLength(1);
    expect(filterProductsByCategory(PREVIEW_PRODUCTS, "rings")).toHaveLength(0);
  });

  it("returns the approved preview catalog while Shopify credentials are unavailable", async () => {
    const previousDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const previousToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    delete process.env.SHOPIFY_STORE_DOMAIN;
    delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    const catalog = await getCatalog();
    expect(catalog.source).toBe("preview");
    expect(catalog.products[0]?.handle).toBe("valerie-ball-bead-chain-bracelet");

    process.env.SHOPIFY_STORE_DOMAIN = previousDomain;
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = previousToken;
  });

  it("normalizes Shopify product nodes into the shared storefront contract", () => {
    const product = normalizeShopifyProduct({
      id: "gid://shopify/Product/42",
      handle: "gold-ring",
      title: "Gold Ring",
      description: "A sculptural gold ring.",
      productType: "Rings",
      tags: ["rings", "gold"],
      featuredImage: { url: "https://cdn.example/ring.jpg", altText: "Gold ring" },
      images: { nodes: [{ url: "https://cdn.example/ring.jpg", altText: "Gold ring" }] },
      priceRange: { minVariantPrice: { amount: "120.00", currencyCode: "USD" } },
      variants: {
        nodes: [{
          id: "gid://shopify/ProductVariant/42",
          title: "Size 7",
          availableForSale: true,
          price: { amount: "120.00", currencyCode: "USD" },
          selectedOptions: [{ name: "Size", value: "7" }],
        }],
      },
      materials: { value: "Gold-plated brass" },
      sizing: { value: "US size 7" },
      finish: { value: "Polished gold" },
      care: { value: "Keep dry" },
    });

    expect(product).toMatchObject({
      handle: "gold-ring",
      productType: "Rings",
      details: {
        materials: "Gold-plated brass",
        sizing: "US size 7",
        finish: "Polished gold",
        care: "Keep dry",
      },
    });
    expect(product.variants[0]?.selectedOptions).toEqual([{ name: "Size", value: "7" }]);
  });

  it("creates a functional local preview bag with totals", () => {
    const product = PREVIEW_PRODUCTS[0];
    const cart = addPreviewCartLine(null, product, product.variants[0], 2);

    expect(cart.totalQuantity).toBe(2);
    expect(cart.lines[0]?.quantity).toBe(2);
    expect(cart.cost.subtotalAmount.amount).toBe("80.00");
    expect(cart.checkoutUrl).toBeNull();
  });
});

describe("SEO foundation", () => {
  it("lists all required public information pages in the sitemap", () => {
    const sitemap = readFileSync(`${root}/client/public/sitemap.xml`, "utf8");
    for (const path of [
      "/shop",
      "/about",
      "/shipping-returns",
      "/ring-sizing",
      "/care",
      "/contact",
      "/privacy",
      "/terms",
    ]) {
      expect(sitemap).toContain(`https://www.valerie-jewelry.com${path}`);
    }
  });

  it("provides crawler rules, canonical handling, and Open Graph handling", () => {
    const robots = readFileSync(`${root}/client/public/robots.txt`, "utf8");
    const seo = readFileSync(`${root}/client/src/components/Seo.tsx`, "utf8");
    expect(robots).toContain("Sitemap: https://www.valerie-jewelry.com/sitemap.xml");
    expect(seo).toContain('link[rel="canonical"]');
    expect(seo).toContain('upsertMeta("og:title"');
    expect(seo).toContain('upsertMeta("og:description"');
  });
});

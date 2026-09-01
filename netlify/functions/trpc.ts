import type { Config } from "@netlify/functions";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";

// --- Preview fallback (used only if Shopify env vars are missing) ---
const PREVIEW_PRODUCT = {
  id: "preview-1",
  handle: "preview-necklace",
  title: "Sample Necklace",
  description: "Preview product — connect Shopify to see your real catalog.",
  descriptionHtml: "<p>Preview product — connect Shopify to see your real catalog.</p>",
  productType: "Necklace",
  vendor: "Valerie Jewelry",
  availableForSale: true,
  featuredImage: { url: "", altText: "Preview", width: 800, height: 800 },
  images: [{ url: "", altText: "Preview", width: 800, height: 800 }],
  priceRange: {
    minVariantPrice: { amount: "100.00", currencyCode: "AED" },
    maxVariantPrice: { amount: "100.00", currencyCode: "AED" },
  },
  variants: [] as any[],
  details: { materials: "—", sizing: "—", finish: "—", care: "—" },
};
const PREVIEW_PRODUCTS = [PREVIEW_PRODUCT];

const PRODUCTS_QUERY = `#graphql
  query ValerieProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id handle title description descriptionHtml productType vendor availableForSale
        featuredImage { url altText width height }
        images(first: 12) { nodes { url altText width height } }
        priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
        variants(first: 30) { nodes { id title availableForSale quantityAvailable price { amount currencyCode } selectedOptions { name value } } }
        materials: metafield(namespace: "custom", key: "materials") { value }
        sizing: metafield(namespace: "custom", key: "sizing") { value }
        finish: metafield(namespace: "custom", key: "finish") { value }
        care: metafield(namespace: "custom", key: "care") { value }
      }
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query ValerieProduct($handle: String!) {
    product(handle: $handle) {
      id handle title description descriptionHtml productType vendor availableForSale
      featuredImage { url altText width height }
      images(first: 12) { nodes { url altText width height } }
      priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
      variants(first: 30) { nodes { id title availableForSale quantityAvailable price { amount currencyCode } selectedOptions { name value } } }
      materials: metafield(namespace: "custom", key: "materials") { value }
      sizing: metafield(namespace: "custom", key: "sizing") { value }
      finish: metafield(namespace: "custom", key: "finish") { value }
      care: metafield(namespace: "custom", key: "care") { value }
    }
  }
`;

const CART_FRAGMENT = `#graphql
  fragment ValerieCart on Cart {
    id checkoutUrl totalQuantity
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    lines(first: 50) {
      nodes {
        id quantity
        merchandise {
          ... on ProductVariant {
            id title availableForSale quantityAvailable price { amount currencyCode }
            product { handle title featuredImage { url altText width height } }
          }
        }
      }
    }
  }
`;
const CART_CREATE = `#graphql
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) { cart { ...ValerieCart } userErrors { field message code } }
  } ${CART_FRAGMENT}`;
const CART_LINES_ADD = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...ValerieCart } userErrors { field message code } }
  } ${CART_FRAGMENT}`;
const CART_LINES_UPDATE = `#graphql
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...ValerieCart } userErrors { field message code } }
  } ${CART_FRAGMENT}`;
const CART_LINES_REMOVE = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...ValerieCart } userErrors { field message code } }
  } ${CART_FRAGMENT}`;

function storefrontConfig() {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (!rawDomain || !accessToken) return null;
  const domain = rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const apiVersion = process.env.SHOPIFY_API_VERSION?.trim() || "2026-07";
  return { domain, accessToken, apiVersion };
}

async function storefrontRequest<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const config = storefrontConfig();
  if (!config) throw new Error("SHOPIFY_NOT_CONFIGURED");
  const response = await fetch(`https://${config.domain}/api/${config.apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": config.accessToken },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Shopify Storefront API returned ${response.status}`);
  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length) throw new Error(payload.errors.map(e => e.message).join("; "));
  if (!payload.data) throw new Error("Shopify Storefront API returned no data");
  return payload.data;
}

function normalizeProduct(node: any) {
  const featuredImage = node.featuredImage ?? node.images?.nodes?.[0] ?? PREVIEW_PRODUCT.featuredImage;
  return {
    ...node,
    featuredImage,
    images: node.images?.nodes?.length ? node.images.nodes : [featuredImage],
    variants: node.variants?.nodes ?? [],
    details: {
      materials: node.materials?.value || "—",
      sizing: node.sizing?.value || "—",
      finish: node.finish?.value || "—",
      care: node.care?.value || "—",
    },
  };
}
function normalizeCart(cart: any) {
  return { ...cart, lines: cart.lines?.nodes ?? [] };
}
function assertCartResult(result: { cart?: any; userErrors?: Array<{ message: string }> }) {
  if (result.userErrors?.length) throw new Error(result.userErrors.map((e: any) => e.message).join("; "));
  if (!result.cart) throw new Error("Shopify did not return a cart");
  return normalizeCart(result.cart);
}

async function getCatalog() {
  if (!storefrontConfig()) return { products: PREVIEW_PRODUCTS, source: "preview" as const };
  const data = await storefrontRequest<{ products: { nodes: any[] } }>(PRODUCTS_QUERY, { first: 50 });
  return { products: data.products.nodes.map(normalizeProduct), source: "shopify" as const };
}
async function getProduct(handle: string) {
  if (!storefrontConfig()) {
    return { product: handle === PREVIEW_PRODUCT.handle ? PREVIEW_PRODUCT : null, source: "preview" as const };
  }
  const data = await storefrontRequest<{ product: any | null }>(PRODUCT_QUERY, { handle });
  return { product: data.product ? normalizeProduct(data.product) : null, source: "shopify" as const };
}

const t = initTRPC.create({ transformer: superjson });
const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  auth: router({
    me: publicProcedure.query(() => null),
    logout: publicProcedure.mutation(() => ({ success: true }) as const),
  }),
  storefront: router({
    status: publicProcedure.query(() => ({ configured: Boolean(storefrontConfig()) })),
    catalog: publicProcedure.query(() => getCatalog()),
    product: publicProcedure
      .input(z.object({ handle: z.string().min(1).max(255) }))
      .query(({ input }) => getProduct(input.handle)),
    cartCreate: publicProcedure
      .input(z.object({ merchandiseId: z.string().min(1), quantity: z.number().int().min(1).max(20).default(1) }))
      .mutation(async ({ input }) => {
        const data = await storefrontRequest<{ cartCreate: any }>(CART_CREATE, {
          lines: [{ merchandiseId: input.merchandiseId, quantity: input.quantity }],
        });
        return assertCartResult(data.cartCreate);
      }),
    cartLinesAdd: publicProcedure
      .input(
        z.object({
          cartId: z.string().min(1),
          merchandiseId: z.string().min(1),
          quantity: z.number().int().min(1).max(20).default(1),
        }),
      )
      .mutation(async ({ input }) => {
        const data = await storefrontRequest<{ cartLinesAdd: any }>(CART_LINES_ADD, {
          cartId: input.cartId,
          lines: [{ merchandiseId: input.merchandiseId, quantity: input.quantity }],
        });
        return assertCartResult(data.cartLinesAdd);
      }),
    cartLineUpdate: publicProcedure
      .input(z.object({ cartId: z.string().min(1), lineId: z.string().min(1), quantity: z.number().int().min(1).max(20) }))
      .mutation(async ({ input }) => {
        const data = await storefrontRequest<{ cartLinesUpdate: any }>(CART_LINES_UPDATE, {
          cartId: input.cartId,
          lines: [{ id: input.lineId, quantity: input.quantity }],
        });
        return assertCartResult(data.cartLinesUpdate);
      }),
    cartLineRemove: publicProcedure
      .input(z.object({ cartId: z.string().min(1), lineId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const data = await storefrontRequest<{ cartLinesRemove: any }>(CART_LINES_REMOVE, {
          cartId: input.cartId,
          lineIds: [input.lineId],
        });
        return assertCartResult(data.cartLinesRemove);
      }),
  }),
});

export default (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export const config: Config = { path: "/api/trpc/*" };

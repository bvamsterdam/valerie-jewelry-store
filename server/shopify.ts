import {
  PREVIEW_PRODUCT,
  PREVIEW_PRODUCTS,
  type StorefrontCart,
  type StorefrontProduct,
} from "../shared/catalog";

const PRODUCTS_QUERY = `#graphql
  query ValerieProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        description
        descriptionHtml
        productType
        vendor
        availableForSale
        featuredImage { url altText width height }
        images(first: 12) { nodes { url altText width height } }
        priceRange {
          minVariantPrice { amount currencyCode }
          maxVariantPrice { amount currencyCode }
        }
        variants(first: 30) {
          nodes { id title availableForSale quantityAvailable price { amount currencyCode } selectedOptions { name value } }
        }
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
      id
      handle
      title
      description
      descriptionHtml
      productType
      vendor
      availableForSale
      featuredImage { url altText width height }
      images(first: 12) { nodes { url altText width height } }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      variants(first: 30) {
        nodes { id title availableForSale quantityAvailable price { amount currencyCode } selectedOptions { name value } }
      }
      materials: metafield(namespace: "custom", key: "materials") { value }
      sizing: metafield(namespace: "custom", key: "sizing") { value }
      finish: metafield(namespace: "custom", key: "finish") { value }
      care: metafield(namespace: "custom", key: "care") { value }
    }
  }
`;

const CART_FRAGMENT = `#graphql
  fragment ValerieCart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            quantityAvailable
            price { amount currencyCode }
            product {
              handle
              title
              featuredImage { url altText width height }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE = `#graphql
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...ValerieCart }
      userErrors { field message code }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_ADD = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...ValerieCart }
      userErrors { field message code }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_UPDATE = `#graphql
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...ValerieCart }
      userErrors { field message code }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_REMOVE = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...ValerieCart }
      userErrors { field message code }
    }
  }
  ${CART_FRAGMENT}
`;

type ShopifyProductNode = Omit<StorefrontProduct, "images" | "variants" | "details"> & {
  images: { nodes: StorefrontProduct["images"] };
  variants: { nodes: StorefrontProduct["variants"] };
  materials?: { value?: string } | null;
  sizing?: { value?: string } | null;
  finish?: { value?: string } | null;
  care?: { value?: string } | null;
};

type ShopifyCartNode = Omit<StorefrontCart, "lines"> & {
  lines: { nodes: StorefrontCart["lines"] };
};

function storefrontConfig() {
  const rawDomain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  if (!rawDomain || !accessToken) return null;

  const domain = rawDomain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const apiVersion = process.env.SHOPIFY_API_VERSION?.trim() || "2026-07";
  return { domain, accessToken, apiVersion };
}

async function storefrontRequest<T>(query: string, variables: Record<string, unknown>) {
  const config = storefrontConfig();
  if (!config) throw new Error("SHOPIFY_NOT_CONFIGURED");

  const response = await fetch(
    `https://${config.domain}/api/${config.apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!response.ok) {
    throw new Error(`Shopify Storefront API returned ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map(error => error.message).join("; "));
  }
  if (!payload.data) throw new Error("Shopify Storefront API returned no data");
  return payload.data;
}

export function normalizeShopifyProduct(node: ShopifyProductNode): StorefrontProduct {
  const featuredImage = node.featuredImage ?? node.images.nodes[0] ?? PREVIEW_PRODUCT.featuredImage;
  return {
    ...node,
    featuredImage,
    images: node.images.nodes.length ? node.images.nodes : [featuredImage],
    variants: node.variants.nodes,
    details: {
      materials: node.materials?.value || PREVIEW_PRODUCT.details.materials,
      sizing: node.sizing?.value || PREVIEW_PRODUCT.details.sizing,
      finish: node.finish?.value || PREVIEW_PRODUCT.details.finish,
      care: node.care?.value || PREVIEW_PRODUCT.details.care,
    },
  };
}

function normalizeCart(cart: ShopifyCartNode): StorefrontCart {
  return { ...cart, lines: cart.lines.nodes };
}

function assertCartResult(
  result: { cart?: ShopifyCartNode | null; userErrors?: Array<{ message: string }> },
): StorefrontCart {
  if (result.userErrors?.length) {
    throw new Error(result.userErrors.map(error => error.message).join("; "));
  }
  if (!result.cart) throw new Error("Shopify did not return a cart");
  return normalizeCart(result.cart);
}

export async function getCatalog(): Promise<{
  products: StorefrontProduct[];
  source: "shopify" | "preview";
}> {
  if (!storefrontConfig()) return { products: PREVIEW_PRODUCTS, source: "preview" };
  const data = await storefrontRequest<{ products: { nodes: ShopifyProductNode[] } }>(
    PRODUCTS_QUERY,
    { first: 50 },
  );
  return { products: data.products.nodes.map(normalizeShopifyProduct), source: "shopify" };
}

export async function getProduct(handle: string): Promise<{
  product: StorefrontProduct | null;
  source: "shopify" | "preview";
}> {
  if (!storefrontConfig()) {
    return {
      product: handle === PREVIEW_PRODUCT.handle ? PREVIEW_PRODUCT : null,
      source: "preview",
    };
  }
  const data = await storefrontRequest<{ product: ShopifyProductNode | null }>(
    PRODUCT_QUERY,
    { handle },
  );
  return {
    product: data.product ? normalizeShopifyProduct(data.product) : null,
    source: "shopify",
  };
}

export async function createCart(merchandiseId: string, quantity: number) {
  const data = await storefrontRequest<{
    cartCreate: { cart?: ShopifyCartNode | null; userErrors?: Array<{ message: string }> };
  }>(CART_CREATE, { lines: [{ merchandiseId, quantity }] });
  return assertCartResult(data.cartCreate);
}

export async function addCartLines(cartId: string, merchandiseId: string, quantity: number) {
  const data = await storefrontRequest<{
    cartLinesAdd: { cart?: ShopifyCartNode | null; userErrors?: Array<{ message: string }> };
  }>(CART_LINES_ADD, { cartId, lines: [{ merchandiseId, quantity }] });
  return assertCartResult(data.cartLinesAdd);
}

export async function updateCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontRequest<{
    cartLinesUpdate: { cart?: ShopifyCartNode | null; userErrors?: Array<{ message: string }> };
  }>(CART_LINES_UPDATE, { cartId, lines: [{ id: lineId, quantity }] });
  return assertCartResult(data.cartLinesUpdate);
}

export async function removeCartLine(cartId: string, lineId: string) {
  const data = await storefrontRequest<{
    cartLinesRemove: { cart?: ShopifyCartNode | null; userErrors?: Array<{ message: string }> };
  }>(CART_LINES_REMOVE, { cartId, lineIds: [lineId] });
  return assertCartResult(data.cartLinesRemove);
}

export function isShopifyConfigured() {
  return Boolean(storefrontConfig());
}

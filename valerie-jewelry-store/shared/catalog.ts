export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string;
  width?: number;
  height?: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  price: Money;
  selectedOptions?: Array<{ name: string; value: string }>;
};

export type StorefrontProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  vendor: string;
  availableForSale: boolean;
  featuredImage: ProductImage;
  images: ProductImage[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: ProductVariant[];
  details: {
    materials: string;
    sizing: string;
    finish: string;
    care: string;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: ProductVariant & {
    product: Pick<StorefrontProduct, "handle" | "title" | "featuredImage">;
  };
};

export type StorefrontCart = {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
};

export const BRAND = {
  name: "Valerie Jewelry",
  eyebrow: "Timeless Jewelry, Modern Soul",
  headline: "Crafted for You",
  description:
    "Inspired by timeless elegance and the spirit of today's woman — jewelry designed to elevate every moment with effortless sophistication.",
  instagram: "https://www.instagram.com/p/DZ8FYfcjWXf/",
  domain: "https://www.valerie-jewelry.com",
  email: "valerietimelessjewelry@gmail.com",
} as const;

export const ASSETS = {
  hero: "/manus-storage/hero_3b08adbd.png",
  story: "/manus-storage/story_dfa2b841.png",
  rings: "/manus-storage/rings_d27a16a1.png",
  necklaces: "/manus-storage/necklaces_a068a0ee.png",
  bracelets: "/manus-storage/bracelets_ade009ac.jpg",
  earrings: "/manus-storage/earrings_05dc5414.png",
  braceletGallery: [
    "/manus-storage/bracelet-1_6485d506.jpg",
    "/manus-storage/bracelet-2_52b31233.jpg",
    "/manus-storage/bracelet-3_6de846e3.jpg",
    "/manus-storage/bracelet-4_18ea9b6b.jpg",
  ],
} as const;

export const COLLECTIONS = [
  {
    name: "Rings",
    slug: "rings",
    description: "Symbols of eternal love",
    image: ASSETS.rings,
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Luminous pendants & chains",
    image: ASSETS.necklaces,
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Elegance on the wrist",
    image: ASSETS.bracelets,
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Radiant statement pieces",
    image: ASSETS.earrings,
  },
] as const;

export const TRUST_LABELS = [
  "free insured shipping",
  "gift box",
  "30-day returns",
  "lifetime warranty",
] as const;

export const PREVIEW_PRODUCT: StorefrontProduct = {
  id: "preview://valerie-ball-bead-chain-bracelet",
  handle: "valerie-ball-bead-chain-bracelet",
  title: "Valérie Ball Bead Chain Bracelet",
  description:
    "A polished strand of 4 mm ball beads brings quiet luminosity to every look. Wear it alone for a refined finish or layer it into a modern stack.",
  productType: "Bracelets",
  vendor: "Valerie Jewelry",
  availableForSale: true,
  featuredImage: {
    url: ASSETS.braceletGallery[0],
    altText: "Valérie Ball Bead Chain Bracelet in polished gold",
    width: 1248,
    height: 1248,
  },
  images: ASSETS.braceletGallery.map((url, index) => ({
    url,
    altText: `Valérie Ball Bead Chain Bracelet view ${index + 1}`,
    width: 1248,
    height: 1248,
  })),
  priceRange: {
    minVariantPrice: { amount: "40.00", currencyCode: "USD" },
    maxVariantPrice: { amount: "40.00", currencyCode: "USD" },
  },
  variants: [
    {
      id: "preview://valerie-ball-bead-chain-bracelet/default",
      title: "Default Title",
      availableForSale: true,
      price: { amount: "40.00", currencyCode: "USD" },
    },
  ],
  details: {
    materials: "High-quality 18K gold plating over stainless steel.",
    sizing: "Adjustable from 6.5 to 8.5 inches with a 2-inch extender chain.",
    finish: "Polished 4 mm ball beads with a secure lobster-claw clasp.",
    care: "Avoid perfume, lotions, water, and abrasive surfaces. Store in the provided box and wipe gently after wear.",
  },
};

export const PREVIEW_PRODUCTS = [PREVIEW_PRODUCT];

export function createEmptyPreviewCart(currencyCode = "USD"): StorefrontCart {
  const zero = { amount: "0.00", currencyCode };
  return {
    id: "preview://cart",
    checkoutUrl: null,
    totalQuantity: 0,
    lines: [],
    cost: { subtotalAmount: zero, totalAmount: zero },
  };
}

export function recalculatePreviewCart(cart: StorefrontCart): StorefrontCart {
  const totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + Number(line.merchandise.price.amount) * line.quantity,
    0,
  );
  const currencyCode = cart.lines[0]?.merchandise.price.currencyCode || "USD";
  const money = { amount: subtotal.toFixed(2), currencyCode };
  return {
    ...cart,
    totalQuantity,
    cost: { subtotalAmount: money, totalAmount: money },
  };
}

export function addPreviewCartLine(
  currentCart: StorefrontCart | null,
  product: StorefrontProduct,
  variant: ProductVariant,
  quantity = 1,
): StorefrontCart {
  const cart = currentCart?.id.startsWith("preview://")
    ? currentCart
    : createEmptyPreviewCart(variant.price.currencyCode);
  const lineId = `preview-line://${variant.id}`;
  const existing = cart.lines.find(line => line.id === lineId);
  const lines = existing
    ? cart.lines.map(line =>
        line.id === lineId
          ? { ...line, quantity: Math.min(20, line.quantity + quantity) }
          : line,
      )
    : [
        ...cart.lines,
        {
          id: lineId,
          quantity: Math.max(1, Math.min(20, quantity)),
          merchandise: {
            ...variant,
            product: {
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
            },
          },
        },
      ];
  return recalculatePreviewCart({ ...cart, lines });
}

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

export function normalizeCategory(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function filterProductsByCategory(
  products: StorefrontProduct[],
  category: string,
): StorefrontProduct[] {
  if (!category || category === "all") return products;
  return products.filter(
    product => normalizeCategory(product.productType) === normalizeCategory(category),
  );
}

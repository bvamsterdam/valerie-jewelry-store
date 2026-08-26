import { trpc } from "@/lib/trpc";
import {
  addPreviewCartLine,
  recalculatePreviewCart,
  type StorefrontCart,
  type StorefrontProduct,
  type ProductVariant,
} from "@shared/catalog";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

const STORAGE_KEY = "valerie-storefront-cart-v1";

type AddToBagInput = {
  product: StorefrontProduct;
  variant: ProductVariant;
  quantity?: number;
  source: "shopify" | "preview";
};

type CartContextValue = {
  cart: StorefrontCart | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isPending: boolean;
  addToBag: (input: AddToBagInput) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StorefrontCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const createMutation = trpc.storefront.cartCreate.useMutation();
  const addMutation = trpc.storefront.cartLinesAdd.useMutation();
  const updateMutation = trpc.storefront.cartLineUpdate.useMutation();
  const removeMutation = trpc.storefront.cartLineRemove.useMutation();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored) as StorefrontCart);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!cart) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToBag = useCallback(
    async ({ product, variant, quantity = 1, source }: AddToBagInput) => {
      setIsPending(true);
      try {
        if (source === "shopify" && !variant.id.startsWith("preview://")) {
          const nextCart =
            cart && !cart.id.startsWith("preview://")
              ? await addMutation.mutateAsync({
                  cartId: cart.id,
                  merchandiseId: variant.id,
                  quantity,
                })
              : await createMutation.mutateAsync({
                  merchandiseId: variant.id,
                  quantity,
                });
          setCart(nextCart);
        } else {
          setCart(addPreviewCartLine(cart, product, variant, quantity));
        }
        setIsOpen(true);
        toast.success(`${product.title} added to your bag`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to update your bag");
      } finally {
        setIsPending(false);
      }
    },
    [addMutation, cart, createMutation],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart || quantity < 1 || quantity > 20) return;
      setIsPending(true);
      try {
        if (cart.id.startsWith("preview://")) {
          const lines = cart.lines.map(line =>
            line.id === lineId ? { ...line, quantity } : line,
          );
          setCart(recalculatePreviewCart({ ...cart, lines }));
        } else {
          setCart(
            await updateMutation.mutateAsync({ cartId: cart.id, lineId, quantity }),
          );
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to update quantity");
      } finally {
        setIsPending(false);
      }
    },
    [cart, updateMutation],
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsPending(true);
      try {
        if (cart.id.startsWith("preview://")) {
          setCart(
            recalculatePreviewCart({
              ...cart,
              lines: cart.lines.filter(line => line.id !== lineId),
            }),
          );
        } else {
          setCart(await removeMutation.mutateAsync({ cartId: cart.id, lineId }));
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to remove item");
      } finally {
        setIsPending(false);
      }
    },
    [cart, removeMutation],
  );

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.assign(cart.checkoutUrl);
      return;
    }
    toast.info("Secure Shopify checkout will be enabled when the client store connection is approved.");
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      setIsOpen,
      isPending,
      addToBag,
      updateQuantity,
      removeLine,
      checkout,
    }),
    [cart, isOpen, isPending, addToBag, updateQuantity, removeLine, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

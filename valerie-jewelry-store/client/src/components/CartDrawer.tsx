import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@shared/catalog";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    setIsOpen,
    isPending,
    updateQuantity,
    removeLine,
    checkout,
  } = useCart();
  const lines = cart?.lines ?? [];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full border-l border-[#d8cbb6] bg-[#fbf7ef] p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-[#d8cbb6] px-6 py-6 text-left">
          <p className="eyebrow">Your selection</p>
          <SheetTitle className="font-display text-3xl font-normal text-[#201a17]">
            Shopping Bag
          </SheetTitle>
          <SheetDescription className="font-body text-xs tracking-wide text-[#6f655b]">
            {cart?.totalQuantity || 0} {cart?.totalQuantity === 1 ? "piece" : "pieces"}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <ShoppingBag className="mb-5 h-8 w-8 stroke-[1.25] text-[#a87932]" />
            <h2 className="font-display text-3xl text-[#201a17]">Your bag is waiting</h2>
            <p className="mt-3 max-w-xs font-body text-sm leading-6 text-[#6f655b]">
              Discover polished pieces designed to become part of your everyday ritual.
            </p>
            <Link
              href="/shop"
              onClick={() => setIsOpen(false)}
              className="luxury-button mt-8"
            >
              Explore jewelry
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {lines.map(line => (
                <article
                  key={line.id}
                  className="grid grid-cols-[96px_1fr] gap-4 border-b border-[#e3d9c9] py-5"
                >
                  <Link
                    href={`/products/${line.merchandise.product.handle}`}
                    onClick={() => setIsOpen(false)}
                    className="block aspect-square overflow-hidden bg-[#f1e9dd]"
                  >
                    <img
                      src={line.merchandise.product.featuredImage.url}
                      alt={line.merchandise.product.featuredImage.altText}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    />
                  </Link>
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/products/${line.merchandise.product.handle}`}
                          onClick={() => setIsOpen(false)}
                          className="font-display text-xl leading-tight text-[#201a17] hover:text-[#9a6b26]"
                        >
                          {line.merchandise.product.title}
                        </Link>
                        {line.merchandise.title !== "Default Title" && (
                          <p className="mt-1 font-body text-[11px] uppercase tracking-[0.14em] text-[#7e7368]">
                            {line.merchandise.title}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${line.merchandise.product.title}`}
                        onClick={() => removeLine(line.id)}
                        disabled={isPending}
                        className="p-1 text-[#7e7368] transition-colors hover:text-[#201a17] disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.4]" />
                      </button>
                    </div>
                    <p className="mt-2 font-body text-sm text-[#9a6b26]">
                      {formatMoney(line.merchandise.price)}
                    </p>
                    <div className="mt-4 inline-flex items-center border border-[#cfc0aa] bg-[#fffdf8]">
                      <button
                        type="button"
                        aria-label={`Decrease ${line.merchandise.product.title} quantity`}
                        disabled={isPending || line.quantity <= 1}
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                        className="grid h-9 w-9 place-items-center disabled:opacity-35"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span
                        aria-live="polite"
                        className="min-w-8 text-center font-body text-xs"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${line.merchandise.product.title} quantity`}
                        disabled={isPending || line.quantity >= 20}
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                        className="grid h-9 w-9 place-items-center disabled:opacity-35"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-[#d8cbb6] bg-[#f6efe3] px-6 py-6">
              <div className="flex items-center justify-between">
                <span className="font-body text-xs uppercase tracking-[0.18em] text-[#5e554d]">
                  Subtotal
                </span>
                <span className="font-display text-2xl text-[#201a17]">
                  {cart ? formatMoney(cart.cost.subtotalAmount) : "$0.00"}
                </span>
              </div>
              <p className="mt-2 font-body text-[11px] leading-5 text-[#756b61]">
                Shipping and taxes are calculated securely at Shopify checkout.
              </p>
              <button
                type="button"
                onClick={checkout}
                disabled={isPending}
                className="luxury-button mt-5 w-full justify-center disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Secure checkout"}
              </button>
              {!cart?.checkoutUrl && (
                <p className="mt-3 text-center font-body text-[10px] uppercase tracking-[0.13em] text-[#8a7e72]">
                  Shopify connection pending
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

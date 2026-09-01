import CartDrawer from "@/components/CartDrawer";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { BRAND, COLLECTIONS } from "@shared/catalog";
import { Facebook, Instagram, Menu, ShoppingBag } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";

const mainNavigation = [
  { label: "Collections", href: "/shop" },
  ...COLLECTIONS.map(collection => ({
    label: collection.name,
    href: `/shop?category=${collection.slug}`,
  })),
];

const careNavigation = [
  { label: "Contact Us", href: "/contact" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Ring Sizing Guide", href: "/ring-sizing" },
  { label: "Care Instructions", href: "/care" },
];

function BrandMark() {
  return (
    <span className="inline-flex flex-col leading-none" aria-label="Valerie Jewelry">
      <span className="font-display text-[1.55rem] font-normal tracking-[0.13em] text-[#211b18]">
        VALERIE
      </span>
      <span className="mt-1 font-body text-[0.48rem] font-medium tracking-[0.42em] text-[#a87932]">
        JEWELRY
      </span>
    </span>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { cart, setIsOpen } = useCart();

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#d9cdbb]/80 bg-[#fbf7ef]/95 backdrop-blur-md">
        <div className="container flex h-[76px] items-center justify-between gap-5">
          <button
            type="button"
            className="p-2 lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5 stroke-[1.4]" />
          </button>

          <Link href="/" className="shrink-0">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {mainNavigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="font-body text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#4e463f] transition-colors hover:text-[#a87932]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label={`Open shopping bag, ${cart?.totalQuantity || 0} items`}
            className="relative p-2 text-[#211b18]"
          >
            <ShoppingBag className="h-5 w-5 stroke-[1.35]" />
            {(cart?.totalQuantity || 0) > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center bg-[#a87932] px-1 font-body text-[9px] font-semibold text-white">
                {cart?.totalQuantity}
              </span>
            )}
          </button>
        </div>

        <nav
          className="border-t border-[#e8ddcd] bg-[#f6efe4] lg:hidden"
          aria-label="Collection quick links"
        >
          <div className="no-scrollbar flex overflow-x-auto px-4">
            {mainNavigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 px-4 py-3 font-body text-[0.56rem] font-medium uppercase tracking-[0.16em] text-[#5a5047]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[88%] border-r border-[#d8cbb6] bg-[#211c19] p-0 text-[#fbf7ef] sm:max-w-sm"
        >
          <div className="border-b border-white/10 px-7 py-7">
            <SheetTitle className="sr-only">Main navigation</SheetTitle>
            <span className="inline-flex flex-col leading-none">
              <span className="font-display text-2xl tracking-[0.13em] text-white">VALERIE</span>
              <span className="mt-1 font-body text-[0.5rem] tracking-[0.42em] text-[#d6b16d]">
                JEWELRY
              </span>
            </span>
          </div>
          <nav className="flex flex-col px-7 py-9" aria-label="Mobile navigation">
            {mainNavigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-white/10 py-4 font-display text-3xl font-light text-white transition-colors hover:text-[#d6b16d]"
              >
                <span className="mr-4 align-middle font-body text-[0.55rem] tracking-[0.14em] text-[#a8957e]">
                  0{index + 1}
                </span>
                {item.label}
              </Link>
            ))}
            <Link
              href="/about"
              className="mt-8 font-body text-[0.62rem] uppercase tracking-[0.2em] text-[#d6b16d]"
            >
              Our Story
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#201b18] text-[#f7f0e5]">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:py-20">
        <div>
          <BrandMark />
          <p className="mt-6 max-w-sm font-body text-xs leading-6 tracking-wide text-[#cbbfb0]">
            Timeless silhouettes, modern spirit, and considered details—created for women who wear their individuality with confidence.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Valerie Jewelry on Instagram"
              className="grid h-10 w-10 place-items-center border border-white/20 text-[#e2d5c3] transition-colors hover:border-[#d6b16d] hover:text-[#d6b16d]"
            >
              <Instagram className="h-4 w-4 stroke-[1.4]" />
            </a>
            <span
              aria-label="Pinterest link to be confirmed"
              title="Pinterest link to be confirmed"
              className="grid h-10 w-10 place-items-center border border-white/10 font-display text-lg text-white/35"
            >
              P
            </span>
            <span
              aria-label="Facebook link to be confirmed"
              title="Facebook link to be confirmed"
              className="grid h-10 w-10 place-items-center border border-white/10 text-white/35"
            >
              <Facebook className="h-4 w-4 stroke-[1.4]" />
            </span>
          </div>
        </div>

        <div>
          <h2 className="footer-heading">Collections</h2>
          <ul className="mt-5 space-y-3">
            {[...COLLECTIONS.map(item => ({ label: item.name, href: `/shop?category=${item.slug}` })), { label: "All Jewelry", href: "/shop" }].map(item => (
              <li key={item.href}>
                <Link className="footer-link" href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Company</h2>
          <ul className="mt-5 space-y-3">
            <li><Link className="footer-link" href="/about">Our Story</Link></li>
            <li><Link className="footer-link" href="/about#craftsmanship">Craftsmanship</Link></li>
            <li><Link className="footer-link" href="/about#values">Our Values</Link></li>
            <li><Link className="footer-link" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Customer Care</h2>
          <ul className="mt-5 space-y-3">
            {careNavigation.map(item => (
              <li key={item.href}>
                <Link className="footer-link" href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 font-body text-[0.58rem] uppercase tracking-[0.14em] text-[#968a7c] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Valerie Jewelry</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fbf7ef] text-[#241e1a]">
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

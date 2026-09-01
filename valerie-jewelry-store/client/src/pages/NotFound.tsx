import Seo from "@/components/Seo";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <section className="grid min-h-[620px] place-items-center bg-[#f2eadf] px-6 py-20 text-center">
      <Seo title="Page Not Found | Valerie Jewelry" description="Return to Valerie Jewelry and explore the collection." path="/404" />
      <div className="max-w-xl">
        <p className="font-display text-8xl font-light italic text-[#c8a15e]">404</p>
        <p className="eyebrow mt-4">A wrong turn</p>
        <h1 className="mt-4 font-display text-5xl text-[#241e1a]">This page has slipped away.</h1>
        <p className="mx-auto mt-5 max-w-md font-body text-xs leading-6 text-[#695f55]">
          Return home or explore the Valerie collection to find a piece that belongs in your story.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="luxury-button"><ArrowLeft className="h-4 w-4" />Home</Link>
          <Link href="/shop" className="luxury-button bg-transparent text-[#241e1a]">Shop jewelry</Link>
        </div>
      </div>
    </section>
  );
}

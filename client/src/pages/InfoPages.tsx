import Seo from "@/components/Seo";
import { ASSETS, BRAND } from "@shared/catalog";
import { ArrowRight, Check, Mail, MapPin } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";

function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="bg-[#2a231f] px-6 py-20 text-center text-[#f8f1e6] sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow text-[#d6b16d]">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl font-light leading-[1.02] sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-xl font-body text-xs leading-6 tracking-wide text-[#d0c5b6]">{intro}</p>
      </div>
    </header>
  );
}

function ArticleShell({ children }: { children: ReactNode }) {
  return <div className="container max-w-4xl py-14 sm:py-20">{children}</div>;
}

function ArticleSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-[#ddd1bf] py-8 first:pt-0 last:border-0">
      <h2 className="font-display text-3xl text-[#261f1b]">{title}</h2>
      <div className="article-copy mt-4">{children}</div>
    </section>
  );
}

export function About() {
  return (
    <>
      <Seo
        title="Our Story | Valerie Jewelry"
        description="Meet Valerie Jewelry: timeless elegance, modern design, and premium gold-plated pieces created to celebrate confidence and individuality."
        path="/about"
        image={ASSETS.story}
      />
      <PageHeader
        eyebrow="Our story"
        title="A modern expression of timeless elegance"
        intro="Valerie was created for women who embrace individuality and express their style with confidence."
      />

      <section className="grid bg-[#fbf7ef] lg:grid-cols-2">
        <div className="relative min-h-[500px] lg:min-h-[680px]">
          <img src={ASSETS.story} alt="Valerie Jewelry brand story" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex items-center px-6 py-14 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <p className="eyebrow">The Valerie woman</p>
            <h2 className="mt-4 font-display text-5xl font-light leading-[1.03]">Jewelry that feels like you.</h2>
            <p className="mt-6 font-body text-sm leading-7 tracking-wide text-[#62584f]">
              We believe jewelry is more than a finishing touch. It is a personal language—one that holds memories, marks transitions, and brings quiet confidence to everyday moments.
            </p>
            <p className="mt-5 font-body text-sm leading-7 tracking-wide text-[#62584f]">
              Our collections combine modern silhouettes, timeless proportions, and warm gold-plated finishes. Each piece is considered for how it layers, how it moves, and how naturally it can become part of your ritual.
            </p>
          </div>
        </div>
      </section>

      <section id="craftsmanship" className="section-space bg-[#f2eadf]">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">Craftsmanship</p>
            <h2 className="section-title">Considered from first line to final polish</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              ["Intentional form", "Each silhouette begins with balance: enough presence to feel distinctive, with an ease that makes it effortless to wear."],
              ["Warm luminosity", "Gold-plated finishes are selected for their refined glow and ability to complement a wide range of skin tones and personal styles."],
              ["Made for layering", "Proportions, clasps, and adjustable details are considered so pieces can be worn alone or built into a personal stack."],
              ["Cared for beautifully", "Thoughtful care guidance and protective packaging help every piece retain its finish and place in your collection."],
            ].map(([title, body], index) => (
              <article key={title} className="border-t border-[#cdbfa9] pt-5">
                <span className="font-body text-[0.55rem] tracking-[0.16em] text-[#a87932]">0{index + 1}</span>
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-3 font-body text-xs leading-6 text-[#655b52]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="section-space bg-[#2a231f] text-[#f8f1e6]">
        <div className="container text-center">
          <p className="eyebrow text-[#d6b16d]">Our values</p>
          <blockquote className="mx-auto mt-5 max-w-4xl font-display text-4xl font-light italic leading-tight sm:text-5xl">
            “Modern design. Timeless elegance. Made to empower.”
          </blockquote>
          <Link href="/shop" className="luxury-button luxury-button-gold mt-10">
            Explore the collection <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

export function ShippingReturns() {
  return (
    <>
      <Seo title="Shipping & Returns | Valerie Jewelry" description="Read Valerie Jewelry shipping, delivery, returns, exchanges, and order support information." path="/shipping-returns" />
      <PageHeader eyebrow="Customer care" title="Shipping & Returns" intro="Clear guidance for receiving, reviewing, and caring for your Valerie Jewelry order." />
      <ArticleShell>
        <div className="mb-8 border-l-2 border-[#b8863b] bg-[#f3eadc] px-5 py-4 font-body text-xs leading-6 text-[#5f554c]">
          Launch note: rates, delivery markets, free-shipping thresholds, and the detailed lifetime-warranty conditions will be finalized in Shopify before the store accepts orders.
        </div>
        <ArticleSection title="Order processing">
          <p>Orders are prepared with care before dispatch. Your order confirmation will be sent to the email used at checkout, followed by tracking information when your parcel leaves our care.</p>
        </ArticleSection>
        <ArticleSection title="Shipping and delivery">
          <p>Available destinations, delivery estimates, and any applicable shipping charges will be shown at Shopify checkout. Where the order qualifies, the service will be presented as <strong>free insured shipping</strong>.</p>
          <p>Delivery estimates begin after dispatch and can be affected by public holidays, customs review, or carrier conditions outside Valerie Jewelry’s control.</p>
        </ArticleSection>
        <ArticleSection title="30-day returns">
          <p>Our intended launch policy offers <strong>30-day returns</strong> from confirmed delivery. Returned pieces should be unworn, unused, and in their original condition with packaging and any included accessories.</p>
          <p>For hygiene and personalization reasons, certain items may not be eligible. Any exclusions will be clearly disclosed on the product page and at checkout before purchase.</p>
        </ArticleSection>
        <ArticleSection title="Starting a return">
          <p>Email <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> with your order number and the item you wish to return. Do not send an item back before receiving return instructions.</p>
        </ArticleSection>
        <ArticleSection title="Damaged or incorrect orders">
          <p>Please inspect your order when it arrives. If an item is damaged, incorrect, or missing, contact us promptly with your order number and clear photographs so we can review the issue.</p>
        </ArticleSection>
        <ArticleSection title="Refunds">
          <p>Approved refunds are issued to the original payment method after the returned item is received and inspected. Your bank or payment provider may require additional processing time.</p>
        </ArticleSection>
      </ArticleShell>
    </>
  );
}

export function RingSizing() {
  const sizeRows = [
    ["5", "49.3 mm", "15.7 mm"], ["6", "51.9 mm", "16.5 mm"], ["7", "54.4 mm", "17.3 mm"],
    ["8", "57.0 mm", "18.1 mm"], ["9", "59.5 mm", "18.9 mm"], ["10", "62.1 mm", "19.8 mm"],
  ];
  return (
    <>
      <Seo title="Ring Sizing Guide | Valerie Jewelry" description="Use the Valerie Jewelry ring sizing guide to measure your finger or an existing ring and choose a comfortable fit." path="/ring-sizing" />
      <PageHeader eyebrow="The perfect fit" title="Ring Sizing Guide" intro="Two simple measuring methods and a practical size reference for choosing your Valerie ring." />
      <ArticleShell>
        <div className="grid gap-8 md:grid-cols-2">
          <section className="border-t border-[#cdbfa9] pt-6">
            <span className="eyebrow">Method 01</span>
            <h2 className="mt-3 font-display text-3xl">Measure your finger</h2>
            <ol className="mt-5 space-y-4 font-body text-xs leading-6 text-[#62584f]">
              <li><strong>1.</strong> Wrap a narrow strip of paper around the base of your finger.</li>
              <li><strong>2.</strong> Mark where the ends meet without pulling the paper too tightly.</li>
              <li><strong>3.</strong> Measure the length in millimetres; this is your finger circumference.</li>
              <li><strong>4.</strong> Compare the result with the table below.</li>
            </ol>
          </section>
          <section className="border-t border-[#cdbfa9] pt-6">
            <span className="eyebrow">Method 02</span>
            <h2 className="mt-3 font-display text-3xl">Measure an existing ring</h2>
            <ol className="mt-5 space-y-4 font-body text-xs leading-6 text-[#62584f]">
              <li><strong>1.</strong> Choose a ring that fits the intended finger comfortably.</li>
              <li><strong>2.</strong> Measure straight across the inside at its widest point.</li>
              <li><strong>3.</strong> Record the inside diameter in millimetres.</li>
              <li><strong>4.</strong> Match that diameter to the closest size below.</li>
            </ol>
          </section>
        </div>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full border-collapse font-body text-xs">
            <thead><tr className="bg-[#2a231f] text-left text-[#f8f1e6]"><th className="p-4 font-medium uppercase tracking-[0.14em]">US size</th><th className="p-4 font-medium uppercase tracking-[0.14em]">Circumference</th><th className="p-4 font-medium uppercase tracking-[0.14em]">Inside diameter</th></tr></thead>
            <tbody>{sizeRows.map(row => <tr key={row[0]} className="border-b border-[#d8cbb8]"><td className="p-4 font-semibold text-[#9a6b26]">{row[0]}</td><td className="p-4">{row[1]}</td><td className="p-4">{row[2]}</td></tr>)}</tbody>
          </table>
        </div>
        <ArticleSection title="Fit notes">
          <p>Measure at the end of the day, when fingers are naturally a little larger. Wider bands usually feel more snug, while stacking several rings may require sizing up. If your result falls between two sizes, choose the larger size for comfort.</p>
        </ArticleSection>
      </ArticleShell>
    </>
  );
}

export function Care() {
  const careSteps = [
    ["Wear thoughtfully", "Apply perfume, lotions, and cosmetics before putting on your jewelry. Remove pieces before showering, swimming, exercising, or sleeping."],
    ["Clean gently", "After wear, wipe each piece with a soft, dry, lint-free cloth. Do not use abrasive cleaners, polishing compounds, or chemical dips on plated jewelry."],
    ["Store separately", "Keep pieces in the provided box or a soft pouch, away from humidity and direct sunlight. Store chains flat and fastened to help prevent tangling."],
    ["Protect the finish", "Avoid hard knocks, rough surfaces, prolonged moisture, and contact with household chemicals. These habits help preserve the warmth and polish of the plating."],
  ];
  return (
    <>
      <Seo title="Jewelry Care Instructions | Valerie Jewelry" description="Follow Valerie Jewelry care guidance to protect gold-plated finishes, prevent tangles, and keep pieces looking luminous." path="/care" />
      <PageHeader eyebrow="Keep the glow" title="Care Instructions" intro="Simple rituals that help your Valerie pieces retain their warm finish and polished presence." />
      <section className="section-space bg-[#fbf7ef]">
        <div className="container grid gap-5 sm:grid-cols-2">
          {careSteps.map(([title, body], index) => (
            <article key={title} className="border border-[#d8cbb8] p-7 sm:p-9">
              <span className="font-body text-[0.55rem] tracking-[0.16em] text-[#a87932]">0{index + 1}</span>
              <h2 className="mt-5 font-display text-3xl">{title}</h2>
              <p className="mt-4 font-body text-xs leading-6 text-[#62584f]">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const order = String(data.get("order") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Valerie Jewelry enquiry${order ? ` — Order ${order}` : ""}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nOrder: ${order || "N/A"}\n\n${message}`);
    window.location.href = `mailto:${BRAND.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }
  return (
    <>
      <Seo title="Contact Us | Valerie Jewelry" description="Contact Valerie Jewelry for product, sizing, order, shipping, return, and care assistance." path="/contact" />
      <PageHeader eyebrow="We are here to help" title="Contact Us" intro="Questions about a piece, your size, an order, or jewelry care? Send us a note." />
      <section className="section-space bg-[#fbf7ef]">
        <div className="container grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <aside>
            <p className="eyebrow">Customer care</p>
            <h2 className="mt-4 font-display text-4xl">Let us help you choose beautifully.</h2>
            <div className="mt-8 space-y-5 border-t border-[#d8cbb8] pt-7 font-body text-xs leading-6 text-[#62584f]">
              <p className="flex gap-3"><Mail className="mt-1 h-4 w-4 shrink-0 text-[#a87932]" /><a href={`mailto:${BRAND.email}`} className="break-all hover:text-[#9a6b26]">{BRAND.email}</a></p>
              <p className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#a87932]" />Meydan Free Zone, Dubai, United Arab Emirates</p>
            </div>
            <p className="mt-7 font-body text-[10px] leading-5 text-[#82776c]">Please include your order number when contacting us about an existing purchase.</p>
          </aside>
          <form onSubmit={handleSubmit} className="grid gap-5 border border-[#d8cbb8] p-6 sm:grid-cols-2 sm:p-10">
            <label className="form-label">Name<input className="form-input" name="name" autoComplete="name" required /></label>
            <label className="form-label">Email<input className="form-input" type="email" name="email" autoComplete="email" required /></label>
            <label className="form-label sm:col-span-2">Order number <span className="normal-case tracking-normal text-[#8c8176]">(optional)</span><input className="form-input" name="order" /></label>
            <label className="form-label sm:col-span-2">How can we help?<textarea className="form-input min-h-36 resize-y py-3" name="message" required /></label>
            <div className="sm:col-span-2">
              <button type="submit" className="luxury-button">Create email <ArrowRight className="h-4 w-4" /></button>
              {sent && <p role="status" aria-live="polite" className="mt-4 flex items-center gap-2 font-body text-xs text-[#6a5f54]"><Check aria-hidden="true" className="h-4 w-4 text-[#8a6a30]" />Your email application has been opened with the enquiry details.</p>}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy | Valerie Jewelry" description="Learn how Valerie Jewelry collects, uses, shares, and protects personal information through its website and Shopify checkout." path="/privacy" />
      <PageHeader eyebrow="Legal" title="Privacy Policy" intro="How Valerie Jewelry handles information when you browse, contact us, or place an order." />
      <ArticleShell>
        <p className="mb-8 font-body text-[10px] uppercase tracking-[0.16em] text-[#8a7f74]">Last updated: 16 July 2026</p>
        <ArticleSection title="Who we are"><p>Valerie Jewelry is based in Dubai, United Arab Emirates. For privacy questions, contact <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.</p></ArticleSection>
        <ArticleSection title="Information we collect"><p>Depending on how you use the site, we may receive contact details, shipping and billing information, order and transaction details, customer-service messages, device information, browser information, IP address, cookies, and website activity. Payment-card details are processed by Shopify and its payment providers; Valerie Jewelry does not receive your full card number.</p></ArticleSection>
        <ArticleSection title="How information is used"><p>We use information to operate the store, process and deliver orders, provide support, prevent fraud, improve the website, maintain security, meet legal obligations, and send marketing communications where you have chosen to receive them.</p></ArticleSection>
        <ArticleSection title="Shopify and service providers"><p>Our commerce experience uses Shopify for product, cart, checkout, payment, order, and store services. We may also use providers for hosting, delivery, analytics, communications, and fraud prevention. These providers process information only for the services they deliver and under their own applicable privacy terms.</p></ArticleSection>
        <ArticleSection title="Cookies and analytics"><p>Cookies and similar technologies may remember preferences, keep the bag functioning, measure website performance, and support security. Where required, non-essential cookies will be controlled through a consent choice.</p></ArticleSection>
        <ArticleSection title="International processing"><p>Because Shopify and other service providers operate internationally, information may be processed outside your country. Appropriate safeguards will be used where required by applicable law.</p></ArticleSection>
        <ArticleSection title="Retention and security"><p>We retain personal information only for as long as reasonably necessary for the purposes described, including legal, accounting, fraud-prevention, and dispute requirements. We use reasonable administrative and technical safeguards, but no internet transmission or storage method can be guaranteed completely secure.</p></ArticleSection>
        <ArticleSection title="Your choices and rights"><p>Depending on your location, you may have rights to request access, correction, deletion, restriction, objection, portability, or withdrawal of consent. You can also unsubscribe from marketing using the link in the message or by contacting us.</p></ArticleSection>
        <ArticleSection title="Updates"><p>We may update this policy when the store, services, or legal requirements change. The revised date will appear at the top of this page.</p></ArticleSection>
      </ArticleShell>
    </>
  );
}

export function Terms() {
  return (
    <>
      <Seo title="Terms of Service | Valerie Jewelry" description="Read the terms governing access to the Valerie Jewelry website, products, orders, checkout, returns, and intellectual property." path="/terms" />
      <PageHeader eyebrow="Legal" title="Terms of Service" intro="The terms that apply when you visit Valerie Jewelry or purchase through our Shopify checkout." />
      <ArticleShell>
        <div className="mb-8 border-l-2 border-[#b8863b] bg-[#f3eadc] px-5 py-4 font-body text-xs leading-6 text-[#5f554c]">Launch note: final merchant identity, tax registration, governing-law wording, warranty conditions, and market-specific consumer terms must be reviewed before orders are enabled.</div>
        <p className="mb-8 font-body text-[10px] uppercase tracking-[0.16em] text-[#8a7f74]">Last updated: 16 July 2026</p>
        <ArticleSection title="Agreement"><p>By accessing this website or placing an order, you agree to these Terms of Service and any policies referenced here. If you do not agree, do not use the website or submit an order.</p></ArticleSection>
        <ArticleSection title="Store services"><p>The storefront is presented by Valerie Jewelry and uses Shopify to support catalog, cart, checkout, payment, order, and related commerce functions. Shopify may apply additional platform and payment terms.</p></ArticleSection>
        <ArticleSection title="Eligibility and accurate information"><p>You must be legally able to enter a contract in your location. You agree to provide current, complete, and accurate account, contact, billing, and delivery information and to keep it updated.</p></ArticleSection>
        <ArticleSection title="Products and availability"><p>We aim to present product descriptions, dimensions, materials, finishes, colors, and images accurately. Screens can display colors differently, and handmade or production variations may occur. Products and quantities are subject to availability.</p></ArticleSection>
        <ArticleSection title="Prices, taxes, and payment"><p>Prices and available currencies are displayed on the website or at checkout. Shipping charges, duties, taxes, and other amounts will be shown or described where applicable. We may correct clear pricing or listing errors before accepting an order.</p></ArticleSection>
        <ArticleSection title="Orders"><p>An order submission is an offer to purchase. An automated acknowledgement does not necessarily mean the order has been accepted. We may decline or cancel an order for availability, payment, fraud-prevention, legal, or listing-error reasons and will provide any required refund.</p></ArticleSection>
        <ArticleSection title="Shipping, returns, and warranty"><p>Shipping, delivery, returns, and refund conditions are described on the Shipping & Returns page and may also appear on product pages or at checkout. Any lifetime-warranty offering applies only under the conditions published at launch and does not replace rights that cannot legally be excluded.</p></ArticleSection>
        <ArticleSection title="Intellectual property"><p>The Valerie Jewelry name, website design, copy, product imagery, graphics, and other original materials are owned by or licensed to Valerie Jewelry. They may not be copied, republished, sold, or commercially exploited without written permission.</p></ArticleSection>
        <ArticleSection title="Acceptable use"><p>You may not misuse the website, interfere with its security, introduce harmful code, scrape protected content, attempt unauthorized access, use the store for unlawful activity, or infringe another person’s rights.</p></ArticleSection>
        <ArticleSection title="Disclaimers and liability"><p>To the maximum extent permitted by law, the website is provided without guarantees beyond those expressly stated. Nothing in these terms excludes liability or consumer rights that cannot lawfully be excluded or limited.</p></ArticleSection>
        <ArticleSection title="Changes and contact"><p>We may update these terms as the store or law changes. For questions, contact <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.</p></ArticleSection>
      </ArticleShell>
    </>
  );
}

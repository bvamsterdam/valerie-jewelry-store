import { ASSETS, BRAND } from "@shared/catalog";
import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "product";
};

function upsertMeta(property: string, content: string, attribute: "name" | "property") {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${property}"]`,
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, property);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function Seo({
  title,
  description,
  path = "/",
  image = ASSETS.hero,
  type = "website",
}: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes("Valerie") ? title : `${title} | Valerie Jewelry`;
    const canonicalUrl = new URL(path, BRAND.domain).toString();
    const imageUrl = image.startsWith("http")
      ? image
      : new URL(image, window.location.origin).toString();

    document.title = fullTitle;
    upsertMeta("description", description, "name");
    upsertMeta("og:title", fullTitle, "property");
    upsertMeta("og:description", description, "property");
    upsertMeta("og:type", type, "property");
    upsertMeta("og:url", canonicalUrl, "property");
    upsertMeta("og:image", imageUrl, "property");
    upsertMeta("twitter:card", "summary_large_image", "name");
    upsertMeta("twitter:title", fullTitle, "name");
    upsertMeta("twitter:description", description, "name");
    upsertMeta("twitter:image", imageUrl, "name");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [description, image, path, title, type]);

  return null;
}

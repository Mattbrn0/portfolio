import type { MetadataRoute } from "next";
import { projects } from "@content/projects";
import { publicPath, siteUrl } from "@/lib/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["/", "/cv", ...projects.map((project) => `/projets/${project.slug}`)];
  return paths.flatMap((path) => [
    { url: siteUrl() + publicPath("fr", path), lastModified: now },
    { url: siteUrl() + publicPath("en", path), lastModified: now },
  ]);
}

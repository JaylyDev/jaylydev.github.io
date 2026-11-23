// Post-build entry point: writes the sitemap and the OG images into out/.
import { generateOgImages } from "./generateOgImage";
import { generateSitemaps } from "./generateSitemap";

generateSitemaps();
generateOgImages();

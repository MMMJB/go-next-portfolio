const title = "Michael Beck";
const description =
  "I'm a 17-year-old experienced in web dev and UI/UX. I'm the founder of Launch and a frontend developer at a few other projects.";
const url = "https://mjb.sh";

export default {
  title,
  description,
  metadataBase: new URL(url),
  manifest: "/meta/site.webmanifest",
  openGraph: {
    title,
    description,
    siteName: title,
    url,
    images: [],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title,
    description,
    cardType: "summary_large_image",
    images: [],
    site: "@elonmusk",
  },
  icons: {
    apple: "/meta/apple-touch-icon.png",
  },
};

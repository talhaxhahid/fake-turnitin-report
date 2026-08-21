import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "./lib/seo";
import FloatingBMC from "./components/FloatingBMC";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#4F46E5",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Turnitin Report Generator | Free & Custom Turnitin Report Online",
    template: "%s | Turnitin Report Generator",
  },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Education",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    siteName: SITE.name,
    title: "Turnitin Report Generator | Free & Custom Turnitin Report Online",
    description: SITE.description,
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Turnitin Report Generator — Free & Custom AI and Similarity Reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Turnitin Report Generator | Free & Custom Turnitin Report",
    description: SITE.description,
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // google: 'paste-google-search-console-verification-here',
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/images/Turnitin_logo.png`,
  description: SITE.description,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: SITE.email,
    availableLanguage: ["English"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}#website`,
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  publisher: { "@id": `${SITE.url}#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  url: SITE.url,
  description: SITE.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "2847",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Free Turnitin similarity report generation",
    "AI detection report with custom percentage",
    "Custom Turnitin report download as PDF",
    "Instant report generation in seconds",
    "Supports PDF up to 10MB",
    "Privacy-first — documents never leave your browser",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <FloatingBMC />
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-47SR401CP0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-47SR401CP0');
          `}
        </Script>
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="ld-software"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <Script
          src="https://cdn.zanderio.ai/widget/loader.js"
          data-id="wdg_L9dZTZmsmrsF3nSW3IfPLoxs"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

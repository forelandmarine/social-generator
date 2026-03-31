"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";

/* ───────── brand constants ───────── */
const C = {
  bg0: "#040D1A",
  bg1: "#081630",
  bg2: "#0C1E42",
  accent: "#5386B6",
  muted: "#7BA8C8",
  white: "#FFFFFF",
  green: "#22C55E",
};

/* ───────── format definitions ───────── */
type FormatKey = "ig-story" | "ig-square" | "ig-portrait" | "linkedin" | "li-banner" | "li-icon";

interface Format {
  label: string;
  w: number;
  h: number;
}

const FORMATS: Record<FormatKey, Format> = {
  "ig-story": { label: "Instagram Story", w: 1080, h: 1920 },
  "ig-square": { label: "Instagram Square", w: 1080, h: 1080 },
  "ig-portrait": { label: "Instagram Portrait", w: 1080, h: 1350 },
  linkedin: { label: "LinkedIn Post", w: 1200, h: 630 },
  "li-banner": { label: "LinkedIn Banner", w: 1584, h: 396 },
  "li-icon": { label: "LinkedIn Icon", w: 300, h: 300 },
};

/* ───────── slide data ───────── */
interface SlideData {
  id: string;
  label: string;
  heading: string[];
  headingAccent?: number;
  subtitle?: string;
  image: string;
  serviceList?: string[];
  featurePills?: string[];
  cta?: { text: string };
  statLine?: { value: string; label: string }[];
  contentPosition?: "top" | "center" | "bottom";
  topOffset?: number;
  bgPosition?: string;
  inlineAccentColor?: string;
  labelColor?: string;
  subtitleColor?: string;
  logoOnly?: boolean;
  wordmark?: boolean;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  format: FormatKey;
  slides: SlideData[];
}

/* ═══════════════════════════════════════════
   CAMPAIGN 1 — PRE-LAUNCH TEASE
   ═══════════════════════════════════════════ */
const PRELAUNCH: Campaign = {
  id: "prelaunch",
  name: "Pre-Launch Tease",
  description: "3 stories to build anticipation before the website goes live",
  format: "ig-story",
  slides: [
    {
      id: "tease-quiet",
      label: "FORELAND MARINE",
      heading: ["We've been", "quiet.", "We've been busy."],
      headingAccent: 2,
      image: "/images/stock/karl-muscat-8S9DC-GerN0-unsplash.jpg",
      contentPosition: "bottom",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "tease-stats",
      label: "OUR WORK",
      heading: ["From wooden", "planks to", "carbon fibre."],
      subtitle: "Independent consultancy. Global reach.",
      image: "/images/stock/leo-talabardon-KfTUI-1TOuU-unsplash.jpg",
      bgPosition: "center 80%",
      contentPosition: "top",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "tease-coming",
      label: "",
      heading: ["Something new", "is coming."],
      headingAccent: 1,
      subtitle: "forelandmarine.com",
      image: "/images/stock/nathan-anderson-SENyJWI9Za4-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
  ],
};

/* ═══════════════════════════════════════════
   CAMPAIGN 2 — WEBSITE LAUNCH (existing)
   ═══════════════════════════════════════════ */
const LAUNCH: Campaign = {
  id: "launch",
  name: "Website Launch",
  description: "10-slide story sequence for the website launch day",
  format: "ig-story",
  slides: [
    {
      id: "hero",
      label: "NEW WEBSITE",
      heading: ["foreland", "marine{.com}"],
      subtitle: "Rebuilt from the ground up.",
      image: "/images/stock/karl-muscat-Pc85Zbj9K1Y-unsplash.jpg",
      bgPosition: "0% center",
      inlineAccentColor: "#A8CFEA",
      contentPosition: "top",
      topOffset: 0.25,
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "brand",
      label: "FORELAND MARINE",
      heading: ["Your guiding", "light through", "the storm."],
      subtitle:
        "Project management, representation and consultancy for some of the world's most famous yachts.",
      image: "/images/stories/02-brand.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.2,
    },
    {
      id: "services",
      label: "WHAT WE DO",
      heading: [],
      subtitle: "All in one place.",
      image: "/images/stories/03-services.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.1,
      serviceList: [
        "Management",
        "New Build",
        "Refit",
        "Technical Consultancy",
      ],
    },
    {
      id: "management",
      label: "YACHT MANAGEMENT",
      heading: ["Smooth sailing.", "Every time."],
      subtitle:
        "ISM compliance, crew management, financial oversight and insurance coordination.",
      image: "/images/stories/04-management.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.2,
    },
    {
      id: "newbuild",
      label: "NEW BUILD",
      heading: ["Your interests,", "every step of", "the way."],
      subtitle:
        "SYBAss-accredited owner representation from concept to warranty.",
      image: "/images/stories/05-newbuild.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "refit",
      label: "REFIT",
      heading: ["Classic", "to Carbon."],
      headingAccent: 1,
      subtitle: "Wooden planks to carbon racing yachts.\nWe've done the hard ones.",
      image: "/images/stories/06-refit.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "technical",
      label: "TECHNICAL CONSULTANCY",
      heading: ["Six disciplines.", "One team."],
      subtitle:
        "Captains, Chief Engineers, Pro Sailors, Designers, Architects and Project Managers.\n\nAll under one roof.",
      image: "/images/stories/07-technical.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "independence",
      label: "INDEPENDENT",
      heading: ["No commissions.", "No conflicts."],
      subtitle:
        "We receive no commissions from shipyards or suppliers. Every recommendation is based solely on your best interest.",
      image: "/images/stories/08-independence.jpg",
      contentPosition: "top",
      topOffset: 0.2,
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "tools",
      label: "DIGITAL TOOLS",
      heading: [],
      subtitle: "Built by us, for the industry.",
      image: "/images/stories/09-tools.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.1,
      featurePills: [
        "Lightship Yacht Management Portal",
        "SeaTime Tracker",
      ],
    },
    {
      id: "cta",
      label: "",
      heading: ["Take a", "look \u2192"],
      headingAccent: 1,
      image: "/images/stories/10-cta.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.375,
    },
  ],
};

/* ═══════════════════════════════════════════
   CAMPAIGN 3 — SERVICES AUTHORITY
   ═══════════════════════════════════════════ */
const AUTHORITY: Campaign = {
  id: "authority",
  name: "Services Authority",
  description:
    "6 stories positioning Foreland as the go-to independent consultancy",
  format: "ig-story",
  slides: [
    {
      id: "auth-hero",
      label: "FORELAND MARINE",
      heading: ["Clear", "direction."],
      headingAccent: 1,
      subtitle: "Independent yacht management and marine consultancy.",
      image: "/images/stock/simon-oberthaler-PtAQSowQxdo-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "auth-refit",
      label: "REFIT",
      heading: ["What six", "J-Class yachts", "taught us."],
      subtitle:
        "From hull plating to rig tuning, we've been part of some of the most complex heritage refits in the world.",
      image: "/images/stories/02-brand.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.2,
    },
    {
      id: "auth-mgmt",
      label: "MANAGEMENT",
      heading: ["On the", "Owner's side,", "by the", "Captain's side."],
      subtitle:
        "ISM compliance, crew HR, budgets, class, flag state and insurance. Handled.",
      image: "/images/stock/steve-sullivant-hgdcBDBWwCU-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.27,
    },
    {
      id: "auth-newbuild",
      label: "NEW BUILD",
      heading: ["From concept", "to warranty."],
      subtitle:
        "SYBAss-accredited. On-site representation at the yard. Deadlines met.",
      image: "/images/stock/andrea-zignin-Us8dszDXx28-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "auth-record",
      label: "FORELAND MARINE",
      heading: ["We love", "what we do."],
      subtitle: "And it shows in our work.",
      image: "/images/stock/danilo-capece-Mn5vLHPLTuw-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "auth-cta",
      label: "",
      heading: ["Let's talk."],
      subtitle: "info@forelandmarine.com",
      image: "/images/stock/tobias-tullius-XZOO6QHub60-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      contentPosition: "top",
      topOffset: 0.2,
    },
  ],
};

/* ═══════════════════════════════════════════
   CAMPAIGN 4 — SEATIME TRACKER
   ═══════════════════════════════════════════ */
const SEATIME: Campaign = {
  id: "seatime",
  name: "SeaTime Tracker",
  description: "5 stories promoting the SeaTime Tracker app",
  format: "ig-story",
  slides: [
    {
      id: "st-hero",
      label: "SEATIME TRACKER",
      heading: ["Your sea time,", "on autopilot."],
      headingAccent: 1,
      subtitle: "AIS-powered automated sea time logging.",
      image: "/images/stock/kateryna-hliznitsova-FWA1DfzRq-A-unsplash.jpg",
    },
    {
      id: "st-problem",
      label: "THE PROBLEM",
      heading: ["Still filling in", "your logbook", "by hand?"],
      subtitle:
        "Manual sea time records are slow, error-prone and easy to forget.",
      image: "/images/stock/aaron-burden-oHNzEstWRec-unsplash.jpg",
    },
    {
      id: "st-solution",
      label: "THE SOLUTION",
      heading: ["AIS-powered.", "Automatic."],
      headingAccent: 1,
      subtitle:
        "SeaTime connects to AIS data to log your voyages automatically. No manual entry. No missed trips.",
      image: "/images/stock/50m-above-bWiocb-XhyA-unsplash.jpg",
    },
    {
      id: "st-features",
      label: "FEATURES",
      heading: [],
      subtitle: "Everything you need, nothing you don't.",
      image: "/images/stock/kateryna-hliznitsova-2Ccv7o1a0UQ-unsplash.jpg",
      featurePills: [
        "AIS tracking",
        "Auto sea time log",
        "MCA-compliant reports",
        "Voyage history",
        "PDF export",
        "Multi-vessel",
      ],
    },
    {
      id: "st-cta",
      label: "",
      heading: ["The last", "logbook you'll", "fill in by hand."],
      headingAccent: 2,
      subtitle: "\u00A34.99/month",
      image: "/images/stock/christian-lambert-P8O2cZEhUXE-unsplash.jpg",
      cta: { text: "Try SeaTime Tracker" },
    },
  ],
};

/* ═══════════════════════════════════════════
   CAMPAIGN 5 — LINKEDIN POSTS
   ═══════════════════════════════════════════ */
const LINKEDIN: Campaign = {
  id: "linkedin",
  name: "LinkedIn Posts",
  description: "5 LinkedIn post images for launch week (Mon\u2013Fri)",
  format: "linkedin",
  slides: [
    {
      id: "li-launch",
      label: "NEW WEBSITE",
      heading: ["foreland", "marine{.com}"],
      subtitle: "Rebuilt from the ground up.",
      image: "/images/stories/01-hero.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "li-refit",
      label: "REFIT",
      heading: ["Classic", "to Carbon."],
      subtitle: "Wooden planks to carbon racing yachts.\nWe've done the hard ones.",
      image: "/images/stories/06-refit.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "li-newbuild",
      label: "NEW BUILD",
      heading: ["Your interests,", "every step."],
      subtitle:
        "SYBAss-accredited. On-site representation at the yard. Deadlines met.",
      image: "/images/stories/05-newbuild.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "li-lightship",
      label: "DIGITAL TOOLS",
      heading: ["Yacht admin,", "but a bit clever."],
      subtitle: "Built by us, for peace of mind.",
      image: "/images/stories/09-tools.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      featurePills: [
        "Lightship Yacht Management Portal",
        "SeaTime Tracker",
      ],
    },
    {
      id: "li-testimonial",
      label: "TESTIMONIAL",
      heading: [
        "\u201CThey catch",
        "problems before",
        "we even",
        'notice them.\u201D',
      ],
      subtitle: "Captain, 45m MY",
      image: "/images/stock/michael-WFg0H8V2560-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
  ],
};

/* ═══════════════════════════════════════════
   LINKEDIN PAGE — BANNER & ICON
   ═══════════════════════════════════════════ */
const LI_BANNER: Campaign = {
  id: "li-banner",
  name: "LinkedIn Banner",
  description: "Company page header banner at 1584×396px",
  format: "li-banner",
  slides: [
    {
      id: "banner",
      label: "",
      heading: [],
      image: "/images/stories/02-brand.jpg",
      wordmark: true,
    },
  ],
};

const LI_ICON: Campaign = {
  id: "li-icon",
  name: "LinkedIn Icon",
  description: "Company page profile icon at 300×300px",
  format: "li-icon",
  slides: [
    {
      id: "icon",
      label: "",
      heading: [],
      image: "",
      logoOnly: true,
    },
  ],
};

/* ═══════════════════════════════════════════
   LIGHTSHIP ISM — LINKEDIN BANNER & ICON
   ═══════════════════════════════════════════ */
const LIGHTSHIP_BANNER: Campaign = {
  id: "lightship-banner",
  name: "Lightship Banner",
  description: "Lightship ISM LinkedIn page header at 1584×396px",
  format: "li-banner",
  slides: [
    {
      id: "ls-banner",
      label: "LIGHTSHIP ISM",
      heading: ["Yacht administration,", "but a bit clever."],
      image: "/images/stories/09-tools.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
  ],
};

const LIGHTSHIP_ICON: Campaign = {
  id: "lightship-icon",
  name: "Lightship Icon",
  description: "Lightship ISM LinkedIn profile icon at 300×300px",
  format: "li-icon",
  slides: [
    {
      id: "ls-icon",
      label: "",
      heading: [],
      image: "",
      logoOnly: true,
    },
  ],
};

/* ═══════════════════════════════════════════
   LIGHTSHIP ISM — LINKEDIN POSTS
   ═══════════════════════════════════════════ */
const LIGHTSHIP_POSTS: Campaign = {
  id: "lightship-posts",
  name: "Lightship Posts",
  description: "5 LinkedIn posts promoting Lightship ISM platform",
  format: "linkedin",
  slides: [
    {
      id: "ls-hero",
      label: "LIGHTSHIP ISM",
      heading: ["Yacht administration,", "but a bit clever."],
      subtitle: "Fleet compliance, crew records, incident tracking.\nAll in one place.",
      image: "/images/stock/steve-sullivant-hgdcBDBWwCU-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "ls-compliance",
      label: "COMPLIANCE",
      heading: ["ISM compliance", "at a glance."],
      subtitle: "Safety management systems, audit schedules, non-conformities.\nNo more spreadsheets.",
      image: "/images/stock/simon-oberthaler-PtAQSowQxdo-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "ls-safety",
      label: "SAFETY",
      heading: ["Checklists, drills,", "risk assessments."],
      subtitle: "Create, assign, and track safety inspections across your entire fleet.",
      image: "/images/stock/andrea-zignin-Us8dszDXx28-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "ls-logbook",
      label: "SHIP'S LOGBOOK",
      heading: ["Flag state compliant.", "Always audit-ready."],
      subtitle: "Official ship's logbook, garbage records, oil records.\nDigital, searchable, exportable.",
      image: "/images/stock/danilo-capece-Mn5vLHPLTuw-unsplash.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
    },
    {
      id: "ls-cta",
      label: "LIGHTSHIP ISM",
      heading: ["Built by yacht", "managers, for", "yacht managers."],
      subtitle: "Get in touch for a demo.",
      image: "/images/stories/09-tools.jpg",
      labelColor: "#A8CFEA",
      subtitleColor: "#C8E0F0",
      cta: { text: "forelandmarine.com" },
    },
  ],
};

/* ───────── all campaigns ───────── */
const ALL_CAMPAIGNS: Campaign[] = [
  PRELAUNCH,
  LAUNCH,
  AUTHORITY,
  SEATIME,
  LINKEDIN,
  LI_BANNER,
  LI_ICON,
  LIGHTSHIP_BANNER,
  LIGHTSHIP_ICON,
  LIGHTSHIP_POSTS,
];

/* ═══════════════════════════════════════════════════
   SLIDE RENDERER — adapts to any format
   ═══════════════════════════════════════════════════ */
function StorySlide({
  slide,
  w,
  h,
  format,
}: {
  slide: SlideData;
  w: number;
  h: number;
  format: FormatKey;
}) {
  const s = (v: number) => v * (w / 1080);

  /* ── Logo-only icon (LinkedIn profile pic) ── */
  if (slide.logoOnly) {
    return (
      <div
        style={{
          width: w,
          height: h,
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.bg0} 0%, ${C.bg1} 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito Sans', system-ui, sans-serif",
        }}
      >
        <img
          src="/images/logos/foreland-icon-white.svg"
          alt="Foreland Marine"
          draggable={false}
          style={{
            width: w * 0.55,
            height: w * 0.55,
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  /* ── LinkedIn banner (wordmark or text) ── */
  if (format === "li-banner") {
    const bannerLabelSize = w * 0.014;
    const bannerHeadingSize = w * 0.04;
    const bannerSubSize = w * 0.018;
    return (
      <div
        style={{
          width: w,
          height: h,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Nunito Sans', system-ui, sans-serif",
        }}
      >
        {/* Background image */}
        {slide.image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: slide.bgPosition || "center",
            }}
          />
        )}
        {/* Solid bg fallback */}
        {!slide.image && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${C.bg0} 0%, ${C.bg1} 100%)`,
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: slide.image
              ? `linear-gradient(to right, ${C.bg0} 0%, rgba(4,13,26,0.75) 35%, rgba(4,13,26,0.6) 65%, ${C.bg0} 100%)`
              : "none",
          }}
        />
        {/* Content — offset right to avoid profile icon overlap zone */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: w * 0.15,
            paddingRight: w * 0.05,
          }}
        >
          {/* Wordmark mode */}
          {slide.wordmark && (
            <img
              src="/images/logos/foreland-marine-white.svg"
              alt="Foreland Marine"
              draggable={false}
              style={{
                width: w * 0.35,
                objectFit: "contain",
                opacity: 0.95,
              }}
            />
          )}
          {/* Text mode */}
          {!slide.wordmark && slide.label && (
            <div
              style={{
                color: slide.labelColor || C.accent,
                fontSize: bannerLabelSize,
                fontWeight: 600,
                letterSpacing: w * 0.004,
                marginBottom: h * 0.04,
                textAlign: "center",
              }}
            >
              {slide.label}
            </div>
          )}
          {!slide.wordmark && slide.heading.length > 0 && (
            <div style={{ textAlign: "center", marginBottom: h * 0.04 }}>
              {slide.heading.map((line, i) => (
                <div
                  key={i}
                  style={{
                    color: slide.headingAccent === i ? C.accent : C.white,
                    fontSize: bannerHeadingSize,
                    fontWeight: 300,
                    lineHeight: 1.15,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          )}
          {!slide.wordmark && slide.subtitle && (
            <div
              style={{
                color: slide.subtitleColor || C.muted,
                fontSize: bannerSubSize,
                fontWeight: 300,
                textAlign: "center",
                whiteSpace: "pre-line",
              }}
            >
              {slide.subtitle}
            </div>
          )}
        </div>
        {/* Accent line bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: C.accent,
            opacity: 0.4,
          }}
        />
      </div>
    );
  }

  const isWide = format === "linkedin" || format === "li-banner";
  const isCompact = isWide || format === "ig-square";

  const headingSize = isWide ? s(64) : isCompact ? s(80) : s(96);
  const subtitleSize = isWide ? s(24) : isCompact ? s(30) : s(36);
  const labelSize = isWide ? s(16) : s(24);
  const pillSize = isWide ? s(18) : s(26);
  const padX = isWide ? s(60) : s(72);
  const padY = isWide ? s(48) : s(120);
  const footerSize = isWide ? s(16) : s(24);

  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Nunito Sans', system-ui, sans-serif",
      }}
    >
      {/* Background image — uses div+backgroundImage for html-to-image compat */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: slide.bgPosition || "center",
        }}
      />

      {/* Logo icon — top right */}
      <img
        src="/images/logos/foreland-icon-white.svg"
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          top: isWide ? s(24) : s(48),
          right: isWide ? s(36) : s(52),
          width: isWide ? s(90) : s(135),
          height: isWide ? s(90) : s(135),
          objectFit: "contain",
          opacity: 0.85,
          zIndex: 10,
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isWide
            ? `linear-gradient(to right, ${C.bg0} 0%, rgba(4,13,26,0.85) 50%, rgba(4,13,26,0.4) 100%)`
            : `linear-gradient(to bottom, rgba(4,13,26,0.72) 0%, rgba(4,13,26,0.5) 40%, rgba(4,13,26,0.55) 65%, ${C.bg0} 100%)`,
        }}
      />

      {/* Content area */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent:
            slide.contentPosition === "bottom"
              ? "flex-end"
              : slide.contentPosition === "top"
                ? "flex-start"
                : "center",
          padding: `${slide.topOffset ? h * slide.topOffset : padY}px ${padX}px`,
          paddingBottom:
            slide.contentPosition === "bottom" ? s(160) : padY,
          maxWidth: isWide ? "65%" : "100%",
        }}
      >
        {/* Section label */}
        {slide.label && (
          <div
            style={{
              color: slide.labelColor || C.accent,
              fontSize: labelSize,
              fontWeight: 600,
              letterSpacing: s(6),
              marginBottom: s(isWide ? 12 : 24),
            }}
          >
            {slide.label}
          </div>
        )}

        {/* Accent bar */}
        <div
          style={{
            width: s(60),
            height: s(3),
            background: C.accent,
            marginBottom: s(isWide ? 20 : 40),
          }}
        />

        {/* Stat line */}
        {slide.statLine && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: isWide ? s(24) : s(32),
              marginBottom: s(isWide ? 20 : 40),
            }}
          >
            {slide.statLine.map((stat) => (
              <div
                key={stat.label}
                style={{ minWidth: isWide ? s(100) : s(160) }}
              >
                <div
                  style={{
                    color: C.accent,
                    fontSize: isWide ? s(48) : s(72),
                    fontWeight: 300,
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    color: C.muted,
                    fontSize: isWide ? s(14) : s(22),
                    fontWeight: 400,
                    marginTop: s(4),
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service list */}
        {slide.serviceList && (
          <div style={{ marginBottom: s(isWide ? 20 : 40) }}>
            {slide.serviceList.map((svc) => (
              <div
                key={svc}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: s(16),
                  marginBottom: s(isWide ? 10 : 20),
                }}
              >
                <div
                  style={{
                    width: s(4),
                    height: isWide ? s(24) : s(36),
                    background: C.accent,
                    borderRadius: s(2),
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    color: C.white,
                    fontSize: isWide ? s(28) : s(48),
                    fontWeight: 300,
                    lineHeight: 1.2,
                  }}
                >
                  {svc}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Feature pills */}
        {slide.featurePills && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: s(isWide ? 8 : 12),
              marginBottom: s(isWide ? 20 : 40),
            }}
          >
            {slide.featurePills.map((pill) => (
              <span
                key={pill}
                style={{
                  display: "inline-block",
                  border: `${s(1.5)}px solid rgba(83,134,182,0.5)`,
                  color: C.white,
                  fontSize: pillSize,
                  fontWeight: 400,
                  padding: `${s(isWide ? 6 : 10)}px ${s(isWide ? 14 : 20)}px`,
                  borderRadius: s(6),
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        )}

        {/* Heading */}
        {slide.heading.length > 0 && (
          <div style={{ marginBottom: s(isWide ? 16 : 32) }}>
            {slide.heading.map((line, i) => {
              const isAccentLine = slide.headingAccent === i;
              // Support inline accent: text wrapped in {braces} renders in accent colour
              const parts = line.split(/(\{[^}]+\})/);
              return (
                <div
                  key={i}
                  style={{
                    color: isAccentLine ? C.accent : C.white,
                    fontSize: headingSize,
                    fontWeight: 300,
                    lineHeight: 1.1,
                  }}
                >
                  {parts.length > 1
                    ? parts.map((part, j) =>
                        part.startsWith("{") && part.endsWith("}") ? (
                          <span key={j} style={{ color: slide.inlineAccentColor || C.accent }}>
                            {part.slice(1, -1)}
                          </span>
                        ) : (
                          <span key={j}>{part}</span>
                        ),
                      )
                    : line}
                </div>
              );
            })}
          </div>
        )}

        {/* Subtitle */}
        {slide.subtitle && (
          <div
            style={{
              color: slide.subtitleColor || C.muted,
              fontSize: subtitleSize,
              fontWeight: 300,
              lineHeight: 1.5,
              whiteSpace: "pre-line",
              maxWidth: isWide ? s(550) : s(800),
            }}
          >
            {slide.subtitle}
          </div>
        )}

        {/* CTA button */}
        {slide.cta && (
          <div style={{ marginTop: s(isWide ? 16 : 32) }}>
            <span
              style={{
                display: "inline-block",
                background: C.accent,
                color: C.white,
                fontSize: isWide ? s(20) : s(32),
                fontWeight: 600,
                padding: `${s(isWide ? 12 : 20)}px ${s(isWide ? 32 : 48)}px`,
                borderRadius: s(8),
              }}
            >
              {slide.cta.text}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: isWide
            ? `0 ${padX}px ${s(24)}px`
            : `0 ${padX}px ${s(80)}px`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(255,255,255,0.15)",
            marginBottom: s(isWide ? 12 : 24),
          }}
        />
        <div style={{ color: C.accent, fontSize: footerSize, fontWeight: 400 }}>
          forelandmarine.com
        </div>
      </div>
    </div>
  );
}

/* ───────── scaled preview card ───────── */
function PreviewCard({
  slide,
  format,
}: {
  slide: SlideData;
  format: FormatKey;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const { w, h } = FORMATS[format];

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      if (e) setScale(e.contentRect.width / w);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={ref} style={{ width: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: w,
          height: h,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <StorySlide slide={slide} w={w} h={h} format={format} />
      </div>
      <div style={{ marginTop: h * scale - h }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function StoriesPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const campaign = ALL_CAMPAIGNS[activeIdx];
  const fmt = FORMATS[campaign.format];

  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const setRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      refs.current[i] = el;
    },
    [],
  );

  const preloadImage = (src: string) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = src;
    });

  const capture = async (slides: SlideData[], i: number, f: Format) => {
    const el = refs.current[i];
    if (!el) return;
    // Preload all images (background + logo)
    await Promise.all([
      preloadImage(slides[i].image),
      preloadImage("/images/logos/foreland-icon-white.svg"),
    ]);
    el.style.left = "0px";
    el.style.opacity = "1";
    el.style.zIndex = "-1";
    // Allow browser to paint all images
    await new Promise((r) => setTimeout(r, 600));
    const opts = {
      width: f.w,
      height: f.h,
      pixelRatio: 1,
      cacheBust: true,
    };
    // Triple-call: first two warm up fonts/images, third produces clean output
    await toPng(el, opts);
    await new Promise((r) => setTimeout(r, 150));
    await toPng(el, opts);
    await new Promise((r) => setTimeout(r, 150));
    const url = await toPng(el, opts);
    el.style.left = "-9999px";
    el.style.opacity = "0";
    el.style.zIndex = "";
    const a = document.createElement("a");
    a.download = `${String(i + 1).padStart(2, "0")}-${slides[i].id}-${f.w}x${f.h}.png`;
    a.href = url;
    a.click();
  };

  const captureAll = async () => {
    setBusy(true);
    for (let i = 0; i < campaign.slides.length; i++) {
      setStatus(`Exporting ${i + 1}/${campaign.slides.length}\u2026`);
      await capture(campaign.slides, i, fmt);
      if (i < campaign.slides.length - 1)
        await new Promise((r) => setTimeout(r, 500));
    }
    setStatus("Done.");
    setBusy(false);
    setTimeout(() => setStatus(""), 2000);
  };

  const captureAllCampaigns = async () => {
    setBusy(true);
    const total = ALL_CAMPAIGNS.reduce((n, c) => n + c.slides.length, 0);
    let done = 0;
    for (const camp of ALL_CAMPAIGNS) {
      setActiveIdx(ALL_CAMPAIGNS.indexOf(camp));
      await new Promise((r) => setTimeout(r, 1000));
      const f = FORMATS[camp.format];
      for (let i = 0; i < camp.slides.length; i++) {
        done++;
        setStatus(`Exporting ${done}/${total} \u2014 ${camp.name}\u2026`);
        const el = refs.current[i];
        if (!el) continue;
        await Promise.all([
          preloadImage(camp.slides[i].image),
          preloadImage("/images/logos/foreland-icon-white.svg"),
        ]);
        el.style.left = "0px";
        el.style.opacity = "1";
        el.style.zIndex = "-1";
        await new Promise((r) => setTimeout(r, 400));
        const opts = {
          width: f.w,
          height: f.h,
          pixelRatio: 1,
          cacheBust: true,
        };
        await toPng(el, opts);
        await new Promise((r) => setTimeout(r, 150));
        await toPng(el, opts);
        await new Promise((r) => setTimeout(r, 150));
        const url = await toPng(el, opts);
        el.style.left = "-9999px";
        el.style.opacity = "0";
        el.style.zIndex = "";
        const a = document.createElement("a");
        a.download = `${camp.id}-${String(i + 1).padStart(2, "0")}-${camp.slides[i].id}-${f.w}x${f.h}.png`;
        a.href = url;
        a.click();
        await new Promise((r) => setTimeout(r, 300));
      }
    }
    setStatus("Done \u2014 all campaigns exported.");
    setBusy(false);
    setTimeout(() => setStatus(""), 3000);
  };

  const cols =
    campaign.format === "li-banner" || campaign.format === "li-icon"
      ? "1fr"
      : campaign.format === "linkedin"
        ? "repeat(3, 1fr)"
        : campaign.slides.length <= 5
          ? `repeat(${campaign.slides.length}, 1fr)`
          : campaign.slides.length <= 6
            ? "repeat(3, 1fr)"
            : "repeat(5, 1fr)";

  return (
    <div style={{ minHeight: "100vh", padding: "40px 24px" }}>
      {/* Campaign tabs */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto 32px",
          display: "flex",
          gap: 4,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: 0,
        }}
      >
        {ALL_CAMPAIGNS.map((camp, i) => (
          <button
            key={camp.id}
            onClick={() => {
              setActiveIdx(i);
              refs.current = [];
            }}
            style={{
              background: i === activeIdx ? C.bg2 : "transparent",
              color: i === activeIdx ? C.white : C.muted,
              border: "none",
              borderBottom:
                i === activeIdx
                  ? `2px solid ${C.accent}`
                  : "2px solid transparent",
              padding: "12px 20px",
              fontSize: 13,
              fontWeight: i === activeIdx ? 600 : 400,
              cursor: "pointer",
              fontFamily: "'Nunito Sans', system-ui, sans-serif",
              letterSpacing: 0.5,
              transition: "all 0.15s",
            }}
          >
            {camp.name}
            <span
              style={{
                marginLeft: 8,
                color: C.accent,
                fontSize: 11,
                fontWeight: 400,
              }}
            >
              {camp.slides.length}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{ color: C.white, fontSize: 24, fontWeight: 300, margin: 0 }}
          >
            {campaign.name}
          </h1>
          <p style={{ color: C.muted, fontSize: 14, margin: "8px 0 0" }}>
            {campaign.description} \u2014 {campaign.slides.length} slides at{" "}
            {fmt.w}&times;{fmt.h}px ({fmt.label})
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={captureAllCampaigns}
            disabled={busy}
            style={{
              background: "transparent",
              color: C.accent,
              border: `1px solid ${C.accent}`,
              padding: "12px 20px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.6 : 1,
              fontFamily: "'Nunito Sans', system-ui, sans-serif",
            }}
          >
            Export All Campaigns
          </button>
          <button
            onClick={captureAll}
            disabled={busy}
            style={{
              background: C.accent,
              color: C.white,
              border: "none",
              padding: "12px 24px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.6 : 1,
              fontFamily: "'Nunito Sans', system-ui, sans-serif",
            }}
          >
            {busy ? status : `Export ${campaign.name}`}
          </button>
        </div>
      </div>

      {/* Preview grid */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: cols,
          gap: 20,
        }}
      >
        {campaign.slides.map((slide, i) => (
          <div
            key={slide.id}
            onClick={() => !busy && capture(campaign.slides, i, fmt)}
            style={{
              cursor: "pointer",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(83,134,182,0.4)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
            }
          >
            <PreviewCard slide={slide} format={campaign.format} />
          </div>
        ))}
      </div>

      {/* Offscreen export containers */}
      {campaign.slides.map((slide, i) => (
        <div
          key={`exp-${slide.id}`}
          ref={setRef(i)}
          style={{
            position: "absolute",
            left: -9999,
            top: 0,
            width: fmt.w,
            height: fmt.h,
            opacity: 0,
          }}
        >
          <StorySlide
            slide={slide}
            w={fmt.w}
            h={fmt.h}
            format={campaign.format}
          />
        </div>
      ))}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Quotes", href: "/quotes" },
  { label: "Contact", href: "/connect" },
];

export default function Navbar({ isScrolled, onArticleBack }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.log({ isScrolled });

  return (
    <>
      <nav
        className={`
          navbar fixed top-0 w-full z-[100] py-6 lg:py-12 transition-all duration-700
          bg-[var(--bg-primary)]
          ${isScrolled
            ? "py-4 border-b border-[var(--border-light)] shadow-[var(--shadow-soft)]"
            : "border-b border-transparent"
          }
        `}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* Brand */}
          <div
            className="flex flex-col items-center justify-start cursor-pointer group"
            onClick={() => {
              if (onArticleBack) onArticleBack();
              // window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="hidden sm:block">
              <Logo className="text-[20px]" />
            </span>
            <span className="sm:hidden">
              <Logo className="text-[16px]" />
            </span>
          </div>

          {/* Desktop Navigation */}
          <div
            className={`
              hidden lg:flex items-center gap-12
              text-[10px] font-black uppercase tracking-[0.5em]
              ${isScrolled ? "text-[var(--text-heading)]" : "text-[var(--text-muted)]"}
            `}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[var(--accent-secondary)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>



          {/* Actions */}
          <div className="flex items-center gap-4 lg:gap-10">
            <a
              href="/connect#subscribe"
              className="
                px-5 lg:px-10 py-2 lg:py-3
                bg-[var(--accent-secondary)]
                text-[var(--bg-primary)]
                text-[10px] font-black uppercase tracking-[0.3em]
                rounded-full
                hover:bg-[var(--text-heading)]
                transition-all
                shadow-xl
                active:scale-95
              "
            >
              Subscribe
            </a>

            <button
              className="lg:hidden text-[var(--accent-secondary)] p-2"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile View  */}
      <div
        className={`
          fixed inset-0 z-[110]
          bg-[var(--bg-primary)]
          transition-transform duration-700
          lg:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-10 h-full flex flex-col justify-center items-center gap-12 relative">

          <button
            onClick={() => setIsMenuOpen(false)}
            className="
              absolute top-8 right-8
              text-[var(--accent-secondary)]
              hover:rotate-90
              transition-transform duration-300
            "
            aria-label="Close Menu"
          >
            <X size={32} />
          </button>

          <div className="space-y-8 text-center">
            {["Insights", "Playbooks", "Blog", "Connect", "Subscribe"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    block
                    text-5xl
                    font-editorial italic
                    text-[var(--text-heading)]
                    hover:text-[var(--accent-secondary)]
                    transition-colors
                  "
                >
                  {item}
                </a>
              )
            )}
          </div>

          <div
            className="
              mt-12
              text-[10px] font-black uppercase tracking-[0.5em]
              text-[var(--text-muted)]
            "
          >
            TrendyStory Journal
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Twitter, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";

const socials = [
  { name: "Twitter", icon: Twitter, handle: "@TrendyStoryHQ" },
  { name: "GitHub", icon: Github, handle: "TrendyStoryHQ" },
  { name: "LinkedIn", icon: Linkedin, handle: "TrendyStory Journal" },
  { name: "Instagram", icon: Instagram, handle: "@TrendyStory.ai" },
];

export default function Connect() {
  const [contactStatus, setContactStatus] = useState(null);
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      message: String(form.get("message") || "").trim(),
      company: String(form.get("company") || "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send message.");
      }
      setContactStatus("Thanks! We received your message.");
      e.currentTarget.reset();
    } catch (err) {
      setContactStatus(err.message || "Something went wrong.");
    } finally {
      setContactLoading(false);
    }
  };

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeStatus(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") || "").trim(),
      name: String(form.get("name") || "").trim(),
    };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to subscribe.");
      }
      setSubscribeStatus("You are in. Welcome to TrendyStory.");
      e.currentTarget.reset();
    } catch (err) {
      setSubscribeStatus(err.message || "Something went wrong.");
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <section
      id="connect"
      className="py-32 px-6 bg-[var(--bg-primary)]"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* <SectionReveal> */}
          <div>
            <h2 className="text-7xl md:text-8xl font-editorial italic text-[var(--text-heading)] leading-[0.9]">
              Stay <br /> Informed
            </h2>
            <p className="mt-8 text-xl max-w-md text-[var(--text-secondary)]">
              Follow TrendyStory for practical AI workflows, experiments, and small
              business growth tactics.
            </p>
          </div>
        {/* </SectionReveal> */}

        <div className="grid sm:grid-cols-2 gap-6">
          {socials.map((item) => (
            <div key={item.name}>
            {/* // <SectionReveal key={item.name} delay={i * 100}> */}
              <div
                className="
                  group relative p-10 rounded-3xl
                  border border-[var(--border-light)]
                  bg-[var(--bg-secondary)]/60 backdrop-blur
                  cursor-pointer
                  transition-all duration-700
                  hover:border-[var(--accent-secondary)]/40
                  hover:-translate-y-2
                "
              >
                <item.icon
                  size={40}
                  className="
                    text-[var(--text-muted)]
                    group-hover:text-[var(--accent-secondary)]
                    transition-all duration-700
                  "
                />

                <p className="mt-6 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                  {item.name}
                </p>

                <p
                  className="
                    mt-2 font-editorial italic
                    text-[var(--text-secondary)]
                    group-hover:text-[var(--text-heading)]
                    transition-colors
                  "
                >
                  {item.handle}
                </p>

                <ArrowUpRight
                  size={20}
                  className="
                    absolute top-8 right-8
                    text-[var(--text-muted)]
                    group-hover:text-[var(--accent-secondary)]
                    transition-all duration-700
                  "
                />
              </div>
              </div>
            // </SectionReveal> 
          ))}
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-20 grid lg:grid-cols-2 gap-10">
        <div className="rounded-[2.5rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-8 shadow-[var(--shadow-soft)]">
          <h3 className="text-3xl font-editorial italic text-[var(--text-heading)]">
            Contact us
          </h3>
          <p className="mt-3 text-[var(--text-secondary)]">
            Tell us what you are building and how we can help.
          </p>
          <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                name="name"
                required
                placeholder="Your name"
                className="w-full rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm outline-none"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <input
              name="company"
              placeholder="Company (optional)"
              className="w-full rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm outline-none"
            />
            <textarea
              name="message"
              required
              placeholder="How can we help?"
              className="w-full min-h-[140px] rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm outline-none resize-none"
            />
            <button
              type="submit"
              disabled={contactLoading}
              className="
                inline-flex items-center gap-2
                px-6 py-3 rounded-full
                bg-[var(--text-heading)]
                text-[var(--bg-primary)]
                text-xs font-semibold uppercase tracking-[0.3em]
                hover:translate-y-[-1px]
                transition
              "
            >
              {contactLoading ? "Sending..." : "Send Message"}
            </button>
            {contactStatus && (
              <p className="text-sm text-[var(--text-secondary)]">
                {contactStatus}
              </p>
            )}
          </form>
        </div>

        <div
          id="subscribe"
          className="rounded-[2.5rem] border border-[var(--border-light)] bg-[var(--bg-secondary)] p-8 shadow-[var(--shadow-soft)]"
        >
          <h3 className="text-3xl font-editorial italic text-[var(--text-heading)]">
            Subscribe
          </h3>
          <p className="mt-3 text-[var(--text-secondary)]">
            Weekly AI playbooks and trend briefs. No noise, just signal.
          </p>
          <form onSubmit={handleSubscribeSubmit} className="mt-6 space-y-4">
            <input
              name="name"
              placeholder="Your name (optional)"
              className="w-full rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm outline-none"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="w-full rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={subscribeLoading}
              className="
                inline-flex items-center gap-2
                px-6 py-3 rounded-full
                bg-[var(--accent-secondary)]
                text-[var(--bg-primary)]
                text-xs font-semibold uppercase tracking-[0.3em]
                hover:translate-y-[-1px]
                transition
              "
            >
              {subscribeLoading ? "Joining..." : "Join Newsletter"}
            </button>
            {subscribeStatus && (
              <p className="text-sm text-[var(--text-secondary)]">
                {subscribeStatus}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

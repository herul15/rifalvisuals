import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

describe("Empty publication lists", () => {
  it("never substitutes static photos or testimonials for an empty approved list", () => {
    const portfolio = renderToStaticMarkup(createElement(PortfolioSection, { initialItems: [] }));
    const testimonials = renderToStaticMarkup(createElement(TestimonialsSection, { testimonials: [] }));
    expect(portfolio.includes('<img')).toBe(false);
    expect(portfolio).toContain('Belum ada');
    expect(testimonials).not.toContain('Siti Rahmawati');
    expect(testimonials).toContain('Belum ada');
  });
});

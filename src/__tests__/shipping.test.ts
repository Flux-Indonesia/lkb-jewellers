import { describe, expect, it } from "vitest";
import {
  HAT_INTERNATIONAL_POSTAGE_FEE_GBP,
  HAT_UK_POSTAGE_FEE_GBP,
  WORLDWIDE_ALLOWED_COUNTRIES,
  hasHatShipping,
  isHatProduct,
} from "@/lib/shipping";

describe("isHatProduct", () => {
  it("matches hat products by category", () => {
    expect(isHatProduct({ category: "flagship caps" })).toBe(true);
  });

  it("matches hat products by product text fallback", () => {
    expect(isHatProduct({ name: "LKB Trucker Hat" })).toBe(true);
  });

  it("does not match unrelated products", () => {
    expect(isHatProduct({ category: "watch", name: "Daytona" })).toBe(false);
  });
});

describe("hasHatShipping", () => {
  it("returns true when any hat is in the cart", () => {
    expect(
      hasHatShipping([
        { category: "watch", name: "Rolex" },
        { category: "flagship caps", name: "LKB Flagship Cap" },
      ])
    ).toBe(true);
  });

  it("returns false when there are no hats", () => {
    expect(hasHatShipping([{ category: "watch", name: "Rolex" }])).toBe(false);
  });

  it("keeps the configured hat postage values stable", () => {
    expect(HAT_UK_POSTAGE_FEE_GBP).toBe(7);
    expect(HAT_INTERNATIONAL_POSTAGE_FEE_GBP).toBe(12);
  });
});

describe("WORLDWIDE_ALLOWED_COUNTRIES", () => {
  it("includes key markets called out in the checkout requirements", () => {
    expect(WORLDWIDE_ALLOWED_COUNTRIES).toContain("GB");
    expect(WORLDWIDE_ALLOWED_COUNTRIES).toContain("US");
    expect(WORLDWIDE_ALLOWED_COUNTRIES).toContain("ID");
    expect(WORLDWIDE_ALLOWED_COUNTRIES).toContain("AE");
  });
});

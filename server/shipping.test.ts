import { describe, it, expect } from "vitest";

// Shipping fee logic: 50 THB if order contains Gummy, free otherwise
function calculateShipping(items: { name: string }[]): number {
  const hasGummy = items.some((item) => item.name.toLowerCase().includes("gummy"));
  return hasGummy ? 50 : 0;
}

describe("Shipping fee calculation", () => {
  it("charges 50 THB when order contains Gummy Afternoon Awake", () => {
    const items = [{ name: "Gummy Afternoon Awake" }];
    expect(calculateShipping(items)).toBe(50);
  });

  it("charges 50 THB when order contains Gummy Midnight Rose", () => {
    const items = [{ name: "Gummy Midnight Rose" }];
    expect(calculateShipping(items)).toBe(50);
  });

  it("charges 50 THB when order has both Gummy and beverage", () => {
    const items = [
      { name: "Beyond Cider™ 1 ขวด" },
      { name: "Gummy Afternoon Awake" },
    ];
    expect(calculateShipping(items)).toBe(50);
  });

  it("charges free shipping for Beyond Cider only", () => {
    const items = [{ name: "Beyond Cider™ 1 ขวด" }];
    expect(calculateShipping(items)).toBe(0);
  });

  it("charges free shipping for Gift Set only", () => {
    const items = [{ name: "Gift Set 6 ขวด" }];
    expect(calculateShipping(items)).toBe(0);
  });

  it("charges free shipping for Morning Veil Shot only", () => {
    const items = [{ name: "Morning Veil Shot 50ml" }];
    expect(calculateShipping(items)).toBe(0);
  });

  it("charges free shipping for empty cart", () => {
    expect(calculateShipping([])).toBe(0);
  });

  it("is case-insensitive for gummy detection", () => {
    const items = [{ name: "GUMMY AFTERNOON AWAKE" }];
    expect(calculateShipping(items)).toBe(50);
  });
});

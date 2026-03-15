export function formatINR(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

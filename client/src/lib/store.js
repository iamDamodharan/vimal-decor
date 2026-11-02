export async function loadStore() {
  try {
    const response = await fetch("/api/site");
    if (!response.ok) throw new Error(`Store API responded with ${response.status}`);
    return await response.json();
  } catch (apiError) {
    const response = await fetch("/sitemap-data.json");
    if (!response.ok) throw apiError;
    return response.json();
  }
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

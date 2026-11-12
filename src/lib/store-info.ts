export const storeInfo = {
  name: "Decoritu",
  tagline: "Walk in for New Ideas",
  intro:
    "Decoritu offers a range of home interior furnishing solutions — curtains, blinds, wallpapers and mattresses — chosen to make every room feel complete.",
  services: ["Curtains", "Blinds", "Wallpapers", "Mattresses"],
  contactPerson: "Ravi Koshti",
  phones: ["+91 9986479525", "+91 8660675500"],
  address: {
    lines: ["Talikuti Building, S S Road", "Opp. Siddeshwar Kalabhavan"],
    city: "Vijayapura",
    state: "Karnataka",
    country: "India",
  },
} as const;

export const storeAddressText = [
  ...storeInfo.address.lines,
  storeInfo.address.city,
  storeInfo.address.state,
  storeInfo.address.country,
].join(", ");

export const storeMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `Decoritu, ${storeAddressText}`,
)}`;

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

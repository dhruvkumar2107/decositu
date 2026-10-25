import type { Metadata } from "next";
import { WishlistView } from "@/components/account/WishlistView";

export const metadata: Metadata = {
  title: "Saved pieces",
  description: "Your saved Decoritu pieces.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return <WishlistView />;
}

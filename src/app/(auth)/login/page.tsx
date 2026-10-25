import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Decoritu account.",
  robots: { index: false, follow: true },
};

function safeNext(value: string | string[] | undefined) {
  const next = typeof value === "string" ? value : "";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/login")) {
    return "/account";
  }
  return next;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const user = await getCurrentUser();
  if (user && next === "/account") redirect("/account");

  return <LoginForm next={next} />;
}

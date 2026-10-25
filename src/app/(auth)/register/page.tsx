import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Decoritu account to save pieces and track orders.",
  robots: { index: false, follow: true },
};

function safeNext(value: string | string[] | undefined) {
  const next = typeof value === "string" ? value : "";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/register")) {
    return "/account";
  }
  return next;
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = safeNext(params.next);
  const user = await getCurrentUser();
  if (user) redirect(next);

  return <RegisterForm next={next} />;
}

"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Tag,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/components/providers/StoreProvider";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

type OrderResponse = {
  orderNumber?: string;
  accessToken?: string;
  total?: number;
  error?: string;
  payment?: {
    provider: string;
    keyId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
  } | null;
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, handler: () => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutView({
  user,
  addresses,
  shippingThreshold,
  shippingFee,
  returnWindow,
  onlineAvailable,
  demoMode,
}: {
  user: { name: string; email: string; phone: string | null } | null;
  addresses: SavedAddress[];
  shippingThreshold: number;
  shippingFee: number;
  returnWindow: number;
  onlineAvailable: boolean;
  demoMode: boolean;
}) {
  const router = useRouter();
  const { cart, subtotal, cartCount, isReady, clearCart } = useStore();
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];

  const [form, setForm] = useState({
    email: user?.email ?? "",
    phone: defaultAddress?.phone ?? user?.phone ?? "",
    fullName: defaultAddress?.fullName ?? user?.name ?? "",
    line1: defaultAddress?.line1 ?? "",
    line2: defaultAddress?.line2 ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state ?? "",
    pincode: defaultAddress?.pincode ?? "",
    notes: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const paymentHandled = useRef(false);

  const shipping = subtotal >= shippingThreshold ? 0 : shippingFee;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(subtotal - discount, 0) + shipping;
  const savings = useMemo(() => {
    const compareSavings = cart.reduce(
      (sum, item) =>
        sum +
        (item.compareAtPrice && item.compareAtPrice > item.unitPrice
          ? (item.compareAtPrice - item.unitPrice) * item.quantity
          : 0),
      0,
    );
    return compareSavings + discount;
  }, [cart, discount]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseAddress(id: string) {
    setSelectedAddressId(id);
    const address = addresses.find((entry) => entry.id === id);
    if (!address) return;
    setForm((current) => ({
      ...current,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    }));
  }

  async function applyCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const data = (await response.json()) as {
        code?: string;
        discount?: number;
        description?: string;
        error?: string;
      };
      if (!response.ok || !data.code || !data.discount) {
        throw new Error(data.error || "That coupon cannot be applied.");
      }
      setCoupon({ code: data.code, discount: data.discount, description: data.description ?? "" });
      setCouponInput("");
      toast.success(`${data.code} applied.`);
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Unable to apply the coupon.");
    } finally {
      setCouponLoading(false);
    }
  }

  function finishPending(orderNumber: string, accessToken: string, message?: string) {
    clearCart();
    if (message) toast(message);
    router.push(`/order/${orderNumber}?token=${accessToken}`);
  }

  async function openRazorpay(
    order: Required<Pick<OrderResponse, "orderNumber" | "accessToken">> & {
      payment: NonNullable<OrderResponse["payment"]>;
    },
  ) {
    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) {
      toast.error("Payment window could not load. Your order is saved as pending.");
      finishPending(order.orderNumber, order.accessToken);
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.payment.keyId,
      amount: order.payment.amount,
      currency: order.payment.currency,
      name: "Decoritu",
      description: `Order ${order.orderNumber}`,
      order_id: order.payment.razorpayOrderId,
      prefill: {
        name: form.fullName,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#5d624c" },
      modal: {
        ondismiss: () => {
          if (paymentHandled.current) return;
          toast("Payment was not completed. Your order is saved as pending.");
          finishPending(order.orderNumber, order.accessToken);
        },
      },
      handler: async (response: RazorpayResponse) => {
        paymentHandled.current = true;
        try {
          const verify = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: order.orderNumber, ...response }),
          });
          const data = (await verify.json()) as { error?: string };
          if (!verify.ok) throw new Error(data.error || "Payment could not be verified.");
          toast.success("Payment received. Your order is confirmed.");
        } catch (caught) {
          toast.error(
            caught instanceof Error
              ? `${caught.message} Please contact customer care with your order number.`
              : "Payment could not be verified.",
          );
        } finally {
          clearCart();
          router.push(`/order/${order.orderNumber}?token=${order.accessToken}`);
        }
      },
    });

    razorpay.on("payment.failed", () => {
      if (paymentHandled.current) return;
      toast.error("Payment failed. Your order is saved as pending.");
      finishPending(order.orderNumber, order.accessToken);
    });

    razorpay.open();
  }

  async function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!termsAccepted) {
      setError("Please accept the terms and return policy to place your order.");
      return;
    }
    if (!cart.length) {
      setError("Your bag is empty.");
      return;
    }

    setPlacing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          couponCode: coupon?.code ?? "",
          paymentMethod,
          items: cart.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = (await response.json()) as OrderResponse;
      if (!response.ok || !data.orderNumber || !data.accessToken) {
        throw new Error(data.error || "We could not place your order.");
      }

      if (paymentMethod === "ONLINE" && data.payment) {
        await openRazorpay({
          orderNumber: data.orderNumber,
          accessToken: data.accessToken,
          payment: data.payment,
        });
      } else {
        clearCart();
        router.push(`/order/${data.orderNumber}?token=${data.accessToken}`);
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "We could not place your order.";
      setError(message);
      toast.error(message);
      setPlacing(false);
    }
  }

  if (!isReady) {
    return (
      <div className="container-luxe py-14 md:py-20">
        <div className="skeleton h-12 w-64" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="skeleton h-[520px]" />
          <div className="skeleton h-[380px]" />
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="container-luxe py-20 text-center md:py-28">
        <p className="eyebrow text-muted">Checkout</p>
        <h1 className="display mt-3 text-5xl sm:text-6xl">Your bag is empty.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
          Add a piece before continuing to checkout.
        </p>
        <Link href="/collections/bestsellers" className="btn btn-primary mt-7">
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-10 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow text-muted">Secure checkout</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">Almost home.</h1>
        </div>
        <Link href="/cart" className="link-underline text-[0.64rem] font-semibold uppercase tracking-[0.11em] text-muted">
          Edit bag
        </Link>
      </div>

      {!user && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-line bg-paper px-4 py-3 text-xs">
          <p className="text-muted">Already have an account? Sign in for faster checkout and order tracking.</p>
          <Link href="/login?next=%2Fcheckout" className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-olive">
            Sign in
          </Link>
        </div>
      )}

      <form onSubmit={placeOrder} className="mt-7 grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
        <div className="space-y-5">
          {error && (
            <p role="alert" className="border border-wine/25 bg-wine/5 px-4 py-3 text-xs leading-5 text-wine">
              {error}
            </p>
          )}

          {addresses.length > 0 && (
            <section className="border border-line bg-paper p-5">
              <p className="eyebrow text-muted">Saved address</p>
              <select
                value={selectedAddressId}
                onChange={(event) => chooseAddress(event.target.value)}
                className="select mt-3"
                aria-label="Choose a saved address"
              >
                <option value="">Enter a new address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label} — {address.fullName}, {address.city}
                  </option>
                ))}
              </select>
            </section>
          )}

          <section className="border border-line bg-paper p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-[0.65rem] text-ivory">1</span>
              <h2 className="font-display text-2xl">Contact</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="phone" className="label">Mobile number</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="10-digit mobile number"
                  className="input"
                />
              </div>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-[0.65rem] text-ivory">2</span>
              <h2 className="font-display text-2xl">Delivery address</h2>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="fullName" className="label">Full name</label>
                <input
                  id="fullName"
                  autoComplete="name"
                  required
                  minLength={2}
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="line1" className="label">Address line 1</label>
                <input
                  id="line1"
                  autoComplete="address-line1"
                  required
                  minLength={5}
                  value={form.line1}
                  onChange={(event) => updateField("line1", event.target.value)}
                  placeholder="House / flat, building, street"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="line2" className="label">
                  Address line 2 <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="line2"
                  autoComplete="address-line2"
                  value={form.line2}
                  onChange={(event) => updateField("line2", event.target.value)}
                  placeholder="Area, landmark"
                  className="input"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className="label">City</label>
                  <input
                    id="city"
                    autoComplete="address-level2"
                    required
                    minLength={2}
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="label">State</label>
                  <input
                    id="state"
                    autoComplete="address-level1"
                    required
                    minLength={2}
                    value={form.state}
                    onChange={(event) => updateField("state", event.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className="label">PIN code</label>
                  <input
                    id="pincode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                    pattern="[1-9][0-9]{5}"
                    maxLength={6}
                    value={form.pincode}
                    onChange={(event) => updateField("pincode", event.target.value)}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="label">
                  Order note <span className="font-normal text-muted">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  maxLength={500}
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Delivery preferences or a note for our team"
                  className="textarea resize-none"
                />
              </div>
            </div>
          </section>

          <section className="border border-line bg-paper p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal text-[0.65rem] text-ivory">3</span>
              <h2 className="font-display text-2xl">Payment</h2>
            </div>
            <div className="mt-4 space-y-2.5">
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-4 transition-colors",
                  paymentMethod === "COD" ? "border-olive bg-olive/5" : "border-line hover:border-ink/30",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-1 accent-olive"
                />
                <span>
                  <span className="block text-sm font-medium">Cash on delivery</span>
                  <span className="mt-1 block text-[0.66rem] leading-5 text-muted">
                    Pay the carrier when your order arrives. No advance payment.
                  </span>
                </span>
              </label>
              <label
                className={cn(
                  "flex items-start gap-3 border p-4 transition-colors",
                  !onlineAvailable && "cursor-not-allowed opacity-55",
                  paymentMethod === "ONLINE" ? "border-olive bg-olive/5" : "border-line",
                  onlineAvailable && "cursor-pointer hover:border-ink/30",
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  disabled={!onlineAvailable}
                  className="mt-1 accent-olive"
                />
                <span>
                  <span className="block text-sm font-medium">Pay online securely</span>
                  <span className="mt-1 block text-[0.66rem] leading-5 text-muted">
                    {onlineAvailable
                      ? "Cards, UPI and net banking via Razorpay. Payment is verified before confirmation."
                      : "Online payment is not configured on this deployment. Choose cash on delivery."}
                  </span>
                </span>
              </label>
            </div>
            {demoMode && (
              <p className="mt-3 border border-clay/25 bg-clay/5 px-3 py-2 text-[0.62rem] leading-5 text-clay">
                This is a sample storefront. Orders are real database records, but no live payment should
                be considered captured. Cash on delivery is a demo flow.
              </p>
            )}
          </section>
        </div>

        <aside className="border border-line bg-paper p-5 sm:p-6 lg:sticky lg:top-[105px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Order summary</h2>
            <span className="text-[0.62rem] uppercase tracking-[0.1em] text-muted">{cartCount} pieces</span>
          </div>

          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.variantId} className="flex gap-3">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-cream">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-charcoal px-1 text-[0.55rem] text-ivory">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg leading-tight">{item.name}</p>
                  <p className="mt-0.5 text-[0.6rem] text-muted">{item.size} · {item.color}</p>
                  <p className="mt-1 text-xs">{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-line pt-4">
            {coupon ? (
              <div className="flex items-center justify-between gap-3 border border-olive/25 bg-olive/5 px-3 py-2.5 text-xs">
                <span className="inline-flex items-center gap-2 text-olive">
                  <Tag size={13} /> {coupon.code}
                </span>
                <button
                  type="button"
                  onClick={() => setCoupon(null)}
                  className="text-muted hover:text-wine"
                  aria-label="Remove coupon"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={applyCoupon} className="flex gap-2">
                <label htmlFor="coupon" className="sr-only">Coupon code</label>
                <input
                  id="coupon"
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="input h-[42px] py-2 text-xs uppercase"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="shrink-0 border border-line px-4 text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-charcoal disabled:opacity-50"
                >
                  {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                </button>
              </form>
            )}
          </div>

          <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between gap-4 text-olive">
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Taxes</span>
              <span className="text-muted">Included</span>
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <span className="text-[0.67rem] font-semibold uppercase tracking-[0.12em]">Total</span>
            <span className="font-display text-3xl">{formatPrice(total)}</span>
          </div>
          {savings > 0 && (
            <p className="mt-1 text-right text-[0.62rem] text-olive">
              You&apos;re saving {formatPrice(savings)}
            </p>
          )}

          <label className="mt-5 flex items-start gap-2.5 text-[0.65rem] leading-5 text-muted">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-1 h-3.5 w-3.5 accent-olive"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-ink underline underline-offset-2">Terms</Link>,{" "}
              <Link href="/shipping-returns" className="text-ink underline underline-offset-2">Return Policy</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-ink underline underline-offset-2">Privacy Policy</Link>.
            </span>
          </label>

          <button type="submit" disabled={placing} className="btn btn-primary mt-4 w-full disabled:cursor-wait disabled:opacity-70">
            {placing ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Placing order…
              </>
            ) : (
              <>
                <LockKeyhole size={14} /> Place order · {formatPrice(total)}
              </>
            )}
          </button>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-[0.62rem] text-muted">
            <p className="flex items-center gap-2"><ShieldCheck size={13} className="text-olive" /> Secure, encrypted checkout</p>
            <p className="flex items-center gap-2"><Truck size={13} className="text-olive" /> Free shipping over {formatPrice(shippingThreshold)}</p>
            <p className="flex items-center gap-2"><Check size={13} className="text-olive" /> {returnWindow}-day returns on eligible pieces</p>
          </div>
        </aside>
      </form>
    </div>
  );
}

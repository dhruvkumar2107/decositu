import { Check } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { ORDER_STEPS, orderStepIndex } from "@/lib/orders";
import { cn } from "@/lib/utils";

export function OrderTimeline({
  order,
}: {
  order: {
    status: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    shippedAt: Date | string | null;
    deliveredAt: Date | string | null;
  };
}) {
  if (["CANCELLED", "REFUNDED"].includes(order.status)) {
    return (
      <div className="border border-wine/25 bg-wine/5 p-4 text-xs leading-6 text-wine">
        This order was {order.status === "REFUNDED" ? "refunded" : "cancelled"}. Stock has been restored
        and no further dispatch will take place.
      </div>
    );
  }

  const index = order.status === "PENDING" ? -1 : Math.max(orderStepIndex(order.status), 0);
  const dates = [
    order.createdAt,
    order.status === "PROCESSING" ? order.updatedAt : null,
    order.shippedAt,
    order.deliveredAt,
  ];

  return (
    <div>
      <ol className="grid grid-cols-4">
        {ORDER_STEPS.map((step, stepIndex) => {
          const complete = stepIndex <= index;
          const current = stepIndex === index;
          return (
            <li key={step.key} className="relative">
              {stepIndex < ORDER_STEPS.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[18px] right-0 top-[9px] h-px",
                    stepIndex < index ? "bg-olive" : "bg-line",
                  )}
                />
              )}
              <div className="relative flex flex-col items-start">
                <span
                  className={cn(
                    "relative z-10 flex h-[19px] w-[19px] items-center justify-center rounded-full border",
                    complete
                      ? "border-olive bg-olive text-ivory"
                      : "border-line bg-paper text-transparent",
                    current && "ring-4 ring-olive/10",
                  )}
                >
                  <Check size={10} strokeWidth={2.5} />
                </span>
                <p className={cn("mt-2 text-[0.62rem] font-semibold", complete ? "text-ink" : "text-muted")}>
                  {step.label}
                </p>
                {dates[stepIndex] && complete && (
                  <p className="mt-0.5 hidden text-[0.55rem] text-muted sm:block">
                    {formatDateTime(dates[stepIndex] as Date | string)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {order.status === "PENDING" && (
        <p className="mt-4 border border-clay/25 bg-clay/5 px-3 py-2 text-[0.65rem] leading-5 text-clay">
          We are waiting for payment confirmation. If payment was completed, please allow a few minutes
          and refresh this page.
        </p>
      )}
    </div>
  );
}

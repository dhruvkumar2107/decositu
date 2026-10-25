import { NextResponse } from "next/server";
import { searchProducts, getProductCards } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 8, 1), 24);

  try {
    if (query) {
      const products = await searchProducts(query, limit);
      return NextResponse.json(
        { products },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const products = await getProductCards({
      where: category ? { category: { slug: category } } : undefined,
      take: limit,
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(
      { products },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Product search failed", error);
    return NextResponse.json({ error: "Unable to search products." }, { status: 500 });
  }
}

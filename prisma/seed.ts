import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type VariantSeed = {
  size: string;
  color: string;
  stock: number;
  price?: number;
  compareAtPrice?: number;
  image?: string;
};

type ProductSeed = {
  name: string;
  slug: string;
  category: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  story: string;
  images: string[];
  material: string;
  dimensions: string;
  care: string;
  badge?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  variants: VariantSeed[];
};

const categories = [
  {
    name: "Bedsheets & Bedding",
    slug: "bedding",
    description: "Soft, breathable layers for slower mornings and beautifully made beds.",
    image: "/images/bedding-01.jpg",
    sortOrder: 1,
  },
  {
    name: "Curtains & Window Styling",
    slug: "curtains",
    description: "Sheers, linens and blackouts that change the way light lives in a room.",
    image: "/images/curtains-01.jpg",
    sortOrder: 2,
  },
  {
    name: "Dohars, Quilts & Blankets",
    slug: "dohars",
    description: "Lightweight cotton quilts and layered textures for every season.",
    image: "/images/dohar-02.jpg",
    sortOrder: 3,
  },
  {
    name: "Cushions & Pillows",
    slug: "cushions",
    description: "The finishing layer: tactile covers, quiet colour and easy pattern.",
    image: "/images/cushions-01.jpg",
    sortOrder: 4,
  },
  {
    name: "Rugs & Carpets",
    slug: "rugs",
    description: "Handwoven and flatweave foundations that bring warmth underfoot.",
    image: "/images/rugs-01.jpg",
    sortOrder: 5,
  },
  {
    name: "Sofa Covers & Mats",
    slug: "sofa-covers",
    description: "Relaxed, washable layers that protect your sofa without hiding it.",
    image: "/images/sofa-01.jpg",
    sortOrder: 6,
  },
  {
    name: "Table Linen & Dining",
    slug: "table-linen",
    description: "Considered table linens for everyday rituals and generous gatherings.",
    image: "/images/dining-01.jpg",
    sortOrder: 7,
  },
  {
    name: "Home Décor",
    slug: "home-decor",
    description: "Sculptural objects, ceramics and art with a quiet point of view.",
    image: "/images/decor-01.jpg",
    sortOrder: 8,
  },
];

const products: ProductSeed[] = [
  {
    name: "Noor Handblock Bedsheet Set",
    slug: "noor-handblock-bedsheet-set",
    category: "bedding",
    sku: "DCT-BED-NOOR",
    price: 249900,
    compareAtPrice: 349900,
    description:
      "A soft cotton bedsheet set finished with a handblock floral motif, two matching pillow covers and a generous drape. Woven for everyday comfort with a finely combed cotton hand-feel.",
    story:
      "Noor is inspired by the quiet courtyards of Jaipur, where shadow and blossom meet on lime-washed walls.",
    images: ["/images/bedding-01.jpg", "/images/bedding-04.jpg", "/images/bedding-07.jpg"],
    material: "100% combed cotton, 210 thread count",
    dimensions: "Queen: 90 × 100 in · King: 108 × 100 in · Pillow covers: 18 × 28 in",
    care: "Machine wash cold with like colours. Use a mild detergent. Do not bleach. Line dry in shade. Warm iron.",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    variants: [
      { size: "Single", color: "Ivory Bloom", stock: 12, image: "/images/bedding-01.jpg" },
      { size: "Queen", color: "Ivory Bloom", stock: 24, image: "/images/bedding-01.jpg" },
      { size: "King", color: "Ivory Bloom", stock: 18, image: "/images/bedding-04.jpg" },
      { size: "Queen", color: "Rust Bloom", stock: 14, price: 269900, image: "/images/bedding-07.jpg" },
      { size: "King", color: "Rust Bloom", stock: 9, price: 289900, image: "/images/bedding-07.jpg" },
    ],
  },
  {
    name: "Mehr Indigo Bedsheet Set",
    slug: "mehr-indigo-bedsheet-set",
    category: "bedding",
    sku: "DCT-BED-MEHR",
    price: 289900,
    compareAtPrice: 399900,
    description:
      "An indigo floral bedsheet set with a crisp cotton finish. Includes one bedsheet and two pillow covers, made to soften beautifully with every wash.",
    story:
      "The Mehr print is drawn from traditional bagru blocks and set on a calm indigo ground.",
    images: ["/images/bedding-02.jpg", "/images/bedding-05.jpg", "/images/bedding-08.jpg"],
    material: "100% cotton percale, 200 thread count",
    dimensions: "Queen: 90 × 100 in · King: 108 × 100 in · Pillow covers: 18 × 28 in",
    care: "Machine wash cold. Wash dark colours separately. Tumble dry low. Warm iron on reverse.",
    featured: true,
    newArrival: true,
    variants: [
      { size: "Single", color: "Indigo", stock: 10, image: "/images/bedding-02.jpg" },
      { size: "Queen", color: "Indigo", stock: 20, image: "/images/bedding-02.jpg" },
      { size: "King", color: "Indigo", stock: 16, image: "/images/bedding-05.jpg" },
      { size: "Queen", color: "Ecru", stock: 11, price: 279900, image: "/images/bedding-08.jpg" },
    ],
  },
  {
    name: "Anaya Sateen Bedsheet Set",
    slug: "anaya-sateen-bedsheet-set",
    category: "bedding",
    sku: "DCT-BED-ANAYA",
    price: 349900,
    compareAtPrice: 449900,
    description:
      "A quietly luminous sateen set with a smooth, cool hand-feel. The subtle sheen brings an understated hotel-like finish to the bedroom.",
    story:
      "Anaya is an ode to unhurried evenings, dressed in champagne and stone.",
    images: ["/images/bedding-03.jpg", "/images/bedding-06.jpg", "/images/bedding-01.jpg"],
    material: "100% long-staple cotton sateen, 300 thread count",
    dimensions: "Queen: 90 × 100 in · King: 108 × 100 in · Pillow covers: 18 × 28 in",
    care: "Machine wash cold on a gentle cycle. Do not bleach. Line dry. Iron while slightly damp.",
    badge: "New",
    newArrival: true,
    variants: [
      { size: "Queen", color: "Champagne", stock: 15, image: "/images/bedding-03.jpg" },
      { size: "King", color: "Champagne", stock: 12, image: "/images/bedding-03.jpg" },
      { size: "Queen", color: "Stone", stock: 9, image: "/images/bedding-06.jpg" },
      { size: "King", color: "Stone", stock: 7, image: "/images/bedding-06.jpg" },
    ],
  },
  {
    name: "Raag Linen Bedsheet Set",
    slug: "raag-linen-bedsheet-set",
    category: "bedding",
    sku: "DCT-BED-RAAG",
    price: 399900,
    compareAtPrice: 499900,
    description:
      "A washed linen bedding set with a relaxed, lived-in texture. Breathable and temperature-regulating, it is made for warm Indian nights.",
    story:
      "Raag is the colour of a garden after rain: muted sage, warm light and a little softness.",
    images: ["/images/bedding-09.jpg", "/images/bedding-08.jpg", "/images/bedding-04.jpg"],
    material: "100% washed European flax linen",
    dimensions: "Queen: 90 × 100 in · King: 108 × 100 in · Pillow covers: 18 × 28 in",
    care: "Machine wash cool on a gentle cycle. Tumble dry low. Scrunch while damp for a relaxed finish.",
    featured: true,
    variants: [
      { size: "Queen", color: "Sage", stock: 13, image: "/images/bedding-09.jpg" },
      { size: "King", color: "Sage", stock: 9, image: "/images/bedding-09.jpg" },
      { size: "Queen", color: "Oat", stock: 8, image: "/images/bedding-08.jpg" },
    ],
  },
  {
    name: "Aria Sheer Curtain Pair",
    slug: "aria-sheer-curtain-pair",
    category: "curtains",
    sku: "DCT-CUR-ARIA",
    price: 189900,
    compareAtPrice: 249900,
    description:
      "A pair of softly diffusing sheers that filter daylight without closing off the view. Finished with a clean rod-pocket header for effortless draping.",
    story:
      "Aria is for the morning hour, when light becomes the quietest material in the room.",
    images: ["/images/curtains-01.jpg", "/images/curtains-03.jpg", "/images/curtains-05.jpg"],
    material: "100% polyester voile",
    dimensions: "Each panel: 46 in wide · Available in 5 ft, 7 ft and 9 ft lengths",
    care: "Gentle machine wash cold. Hang to dry. Steam lightly if needed.",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    variants: [
      { size: "5 ft", color: "Ivory", stock: 20, image: "/images/curtains-01.jpg" },
      { size: "7 ft", color: "Ivory", stock: 30, image: "/images/curtains-01.jpg" },
      { size: "9 ft", color: "Ivory", stock: 12, price: 219900, image: "/images/curtains-03.jpg" },
      { size: "7 ft", color: "Sand", stock: 16, image: "/images/curtains-05.jpg" },
    ],
  },
  {
    name: "Niva Blackout Curtain Pair",
    slug: "niva-blackout-curtain-pair",
    category: "curtains",
    sku: "DCT-CUR-NIVA",
    price: 279900,
    compareAtPrice: 349900,
    description:
      "A tailored blackout curtain pair with a soft linen-look face and a dense woven reverse. Designed to soften sound and keep bedrooms cooler.",
    story:
      "Niva draws its palette from olive groves and late-afternoon shade.",
    images: ["/images/curtains-02.jpg", "/images/curtains-04.jpg", "/images/curtains-01.jpg"],
    material: "Front: 70% cotton, 30% linen · Reverse: blackout weave",
    dimensions: "Each panel: 46 in wide · Available in 5 ft, 7 ft and 9 ft lengths",
    care: "Dry clean recommended. Vacuum gently with a soft brush attachment.",
    featured: true,
    bestseller: true,
    variants: [
      { size: "5 ft", color: "Olive", stock: 12, image: "/images/curtains-02.jpg" },
      { size: "7 ft", color: "Olive", stock: 18, image: "/images/curtains-02.jpg" },
      { size: "9 ft", color: "Olive", stock: 10, price: 309900, image: "/images/curtains-04.jpg" },
      { size: "7 ft", color: "Charcoal", stock: 14, image: "/images/curtains-04.jpg" },
    ],
  },
  {
    name: "Saanjh Linen Curtain Pair",
    slug: "saanjh-linen-curtain-pair",
    category: "curtains",
    sku: "DCT-CUR-SAANJH",
    price: 329900,
    compareAtPrice: 399900,
    description:
      "A textured linen curtain pair with a weighted hem and a warm, filtered opacity. Designed to hang beautifully from the first day.",
    story:
      "Saanjh is the golden hour, held in a fabric.",
    images: ["/images/curtains-03.jpg", "/images/curtains-05.jpg", "/images/curtains-02.jpg"],
    material: "80% linen, 20% cotton",
    dimensions: "Each panel: 50 in wide · Available in 7 ft and 9 ft lengths",
    care: "Dry clean recommended. Steam to relax creases.",
    newArrival: true,
    variants: [
      { size: "7 ft", color: "Sand", stock: 12, image: "/images/curtains-03.jpg" },
      { size: "9 ft", color: "Sand", stock: 8, price: 359900, image: "/images/curtains-03.jpg" },
      { size: "7 ft", color: "Clay", stock: 6, image: "/images/curtains-05.jpg" },
    ],
  },
  {
    name: "Mira Pleated Sheer Panel",
    slug: "mira-pleated-sheer-panel",
    category: "curtains",
    sku: "DCT-CUR-MIRA",
    price: 229900,
    compareAtPrice: 289900,
    description:
      "A single finely pleated sheer panel with a crisp, architectural fold. Layer it with a heavier drape or use alone for a softer window.",
    story:
      "Mira takes its cue from the pleated light on old shuttered windows.",
    images: ["/images/curtains-04.jpg", "/images/curtains-01.jpg", "/images/curtains-03.jpg"],
    material: "100% recycled polyester voile",
    dimensions: "Panel: 48 in wide · Available in 7 ft and 9 ft lengths",
    care: "Gentle machine wash cold in a laundry bag. Hang to dry.",
    newArrival: true,
    variants: [
      { size: "7 ft", color: "Warm White", stock: 18, image: "/images/curtains-04.jpg" },
      { size: "9 ft", color: "Warm White", stock: 10, price: 259900, image: "/images/curtains-04.jpg" },
    ],
  },
  {
    name: "Kora Cotton Dohar",
    slug: "kora-cotton-dohar",
    category: "dohars",
    sku: "DCT-DOH-KORA",
    price: 219900,
    compareAtPrice: 289900,
    description:
      "A featherlight three-layer cotton dohar for nights when a heavy quilt feels like too much. Soft, breathable and easy to layer.",
    story:
      "Kora is named for the raw, unbleached cotton that gives it its quiet texture.",
    images: ["/images/dohar-01.jpg", "/images/dohar-04.jpg", "/images/dohar-02.jpg"],
    material: "100% cotton mulmul with cotton fill",
    dimensions: "Single: 60 × 90 in · Double: 90 × 100 in",
    care: "Machine wash cold on a gentle cycle. Line dry in shade. Do not bleach.",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    variants: [
      { size: "Single", color: "Natural", stock: 14, image: "/images/dohar-01.jpg" },
      { size: "Double", color: "Natural", stock: 22, image: "/images/dohar-01.jpg" },
      { size: "Double", color: "Rust Stripe", stock: 11, image: "/images/dohar-04.jpg" },
    ],
  },
  {
    name: "Bagh Reversible Quilt",
    slug: "bagh-reversible-quilt",
    category: "dohars",
    sku: "DCT-DOH-BAGH",
    price: 329900,
    compareAtPrice: 429900,
    description:
      "A reversible cotton quilt with a botanical print on one side and a calm solid on the other. Lightly filled for year-round comfort.",
    story:
      "Bagh borrows its garden motif from hand-painted textiles found in old family homes.",
    images: ["/images/dohar-02.jpg", "/images/dohar-03.jpg", "/images/dohar-05.jpg"],
    material: "Cotton shell with 120 GSM cotton fill",
    dimensions: "Single: 60 × 90 in · Double: 90 × 100 in",
    care: "Machine wash cold. Wash separately for the first few washes. Line dry.",
    featured: true,
    newArrival: true,
    variants: [
      { size: "Single", color: "Ochre Garden", stock: 9, image: "/images/dohar-02.jpg" },
      { size: "Double", color: "Ochre Garden", stock: 14, image: "/images/dohar-02.jpg" },
      { size: "Double", color: "Olive Garden", stock: 10, image: "/images/dohar-03.jpg" },
    ],
  },
  {
    name: "Saanjh Light Quilt",
    slug: "saanjh-light-quilt",
    category: "dohars",
    sku: "DCT-DOH-SAANJH",
    price: 279900,
    compareAtPrice: 349900,
    description:
      "A stone-coloured quilt with a fine hand-quilted grid and a soft washed finish. The weight is light enough for humid nights and cosy enough for winter layering.",
    story:
      "Saanjh is the colour of dusk settling on a lime-plaster wall.",
    images: ["/images/dohar-03.jpg", "/images/dohar-05.jpg", "/images/dohar-01.jpg"],
    material: "Washed cotton shell and fill",
    dimensions: "Double: 90 × 100 in · King: 100 × 108 in",
    care: "Machine wash cold on a gentle cycle. Tumble dry low. Warm iron if needed.",
    variants: [
      { size: "Double", color: "Stone", stock: 16, image: "/images/dohar-03.jpg" },
      { size: "King", color: "Stone", stock: 9, price: 299900, image: "/images/dohar-03.jpg" },
      { size: "Double", color: "Clay", stock: 8, image: "/images/dohar-05.jpg" },
    ],
  },
  {
    name: "Nila Jaipuri Razai",
    slug: "nila-jaipuri-razai",
    category: "dohars",
    sku: "DCT-DOH-NILA",
    price: 449900,
    compareAtPrice: 549900,
    description:
      "A traditional Jaipuri razai in a deep indigo print, filled with soft cotton and finished with a hand-bound edge. Generous, warm and made to last.",
    story:
      "Nila honours the indigo vats and sunlit terraces of Rajasthan.",
    images: ["/images/dohar-04.jpg", "/images/dohar-01.jpg", "/images/dohar-02.jpg"],
    material: "Cotton shell with 200 GSM cotton fill",
    dimensions: "Single: 60 × 90 in · Double: 90 × 100 in · King: 100 × 108 in",
    care: "Dry clean recommended. Air in shade. Store folded with a cotton sheet.",
    featured: true,
    variants: [
      { size: "Single", color: "Indigo Bloom", stock: 7, image: "/images/dohar-04.jpg" },
      { size: "Double", color: "Indigo Bloom", stock: 10, image: "/images/dohar-04.jpg" },
      { size: "King", color: "Indigo Bloom", stock: 5, price: 479900, image: "/images/dohar-04.jpg" },
    ],
  },
  {
    name: "Ada Cushion Cover Set",
    slug: "ada-cushion-cover-set",
    category: "cushions",
    sku: "DCT-CUS-ADA",
    price: 89900,
    compareAtPrice: 119900,
    description:
      "A pair of woven cushion covers with a subtle tonal pattern and a concealed zip. An easy layer for sofas and beds.",
    story:
      "Ada is a small study in texture: quiet from a distance, alive up close.",
    images: ["/images/cushions-01.jpg", "/images/cushions-02.jpg", "/images/cushions-03.jpg"],
    material: "100% cotton jacquard",
    dimensions: "Set of 2 · 16 × 16 in or 18 × 18 in",
    care: "Machine wash cold on a gentle cycle. Do not bleach. Line dry in shade.",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    variants: [
      { size: "16 × 16 in", color: "Oat", stock: 24, image: "/images/cushions-01.jpg" },
      { size: "18 × 18 in", color: "Oat", stock: 18, image: "/images/cushions-02.jpg" },
      { size: "16 × 16 in", color: "Olive", stock: 15, image: "/images/cushions-03.jpg" },
      { size: "18 × 18 in", color: "Clay", stock: 10, image: "/images/cushions-03.jpg" },
    ],
  },
  {
    name: "Sia Embroidered Cushion",
    slug: "sia-embroidered-cushion",
    category: "cushions",
    sku: "DCT-CUS-SIA",
    price: 74900,
    compareAtPrice: 99900,
    description:
      "A single cushion cover with fine tonal embroidery and a soft cotton slub base. An understated accent for a reading chair or layered bed.",
    story:
      "Sia is for the small details that make a room feel considered.",
    images: ["/images/cushions-02.jpg", "/images/cushions-03.jpg", "/images/cushions-04.jpg"],
    material: "Cotton slub with cotton embroidery",
    dimensions: "18 × 18 in",
    care: "Hand wash cold. Dry flat in shade. Warm iron on reverse.",
    newArrival: true,
    variants: [
      { size: "18 × 18 in", color: "Sand", stock: 20, image: "/images/cushions-02.jpg" },
      { size: "18 × 18 in", color: "Olive", stock: 13, image: "/images/cushions-03.jpg" },
    ],
  },
  {
    name: "Vela Textured Cushion",
    slug: "vela-textured-cushion",
    category: "cushions",
    sku: "DCT-CUS-VELA",
    price: 64900,
    compareAtPrice: 84900,
    description:
      "A square cushion cover in a tactile bouclé weave, designed to add softness and depth to a neutral sofa.",
    story:
      "Vela is named for the sail-like movement of light across a woven surface.",
    images: ["/images/cushions-03.jpg", "/images/cushions-04.jpg", "/images/cushions-01.jpg"],
    material: "Cotton-blend bouclé",
    dimensions: "18 × 18 in",
    care: "Spot clean or gentle hand wash. Do not wring. Dry flat.",
    variants: [
      { size: "18 × 18 in", color: "Ivory", stock: 16, image: "/images/cushions-03.jpg" },
      { size: "18 × 18 in", color: "Taupe", stock: 11, image: "/images/cushions-04.jpg" },
    ],
  },
  {
    name: "Pihu Velvet Cushion",
    slug: "pihu-velvet-cushion",
    category: "cushions",
    sku: "DCT-CUS-PIHU",
    price: 99900,
    compareAtPrice: 129900,
    description:
      "A plush velvet cushion cover with a piped edge and a deep, saturated colour. The final note of richness in a layered room.",
    story:
      "Pihu is an evening colour: warm, a little dramatic and completely at home.",
    images: ["/images/cushions-04.jpg", "/images/cushions-01.jpg", "/images/cushions-02.jpg"],
    material: "Cotton-viscose velvet",
    dimensions: "18 × 18 in",
    care: "Dry clean recommended. Brush pile gently in one direction.",
    featured: true,
    variants: [
      { size: "18 × 18 in", color: "Rust", stock: 12, image: "/images/cushions-04.jpg" },
      { size: "18 × 18 in", color: "Olive", stock: 9, image: "/images/cushions-01.jpg" },
      { size: "18 × 18 in", color: "Charcoal", stock: 8, image: "/images/cushions-02.jpg" },
    ],
  },
  {
    name: "Nira Handwoven Jute Rug",
    slug: "nira-handwoven-jute-rug",
    category: "rugs",
    sku: "DCT-RUG-NIRA",
    price: 499900,
    compareAtPrice: 699900,
    description:
      "A handwoven jute rug with a chunky looped texture and a natural, undyed finish. Adds grounding warmth to living rooms and bedrooms.",
    story:
      "Nira begins with the fibre itself: sun-dried, hand-spun and woven by skilled makers.",
    images: ["/images/rugs-01.jpg", "/images/rugs-03.jpg", "/images/rugs-02.jpg"],
    material: "100% jute",
    dimensions: "3 × 5 ft · 5 × 8 ft · 6 × 9 ft",
    care: "Vacuum regularly. Rotate periodically. Spot clean with a damp cloth. Use a rug pad.",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    variants: [
      { size: "3 × 5 ft", color: "Natural", stock: 12, image: "/images/rugs-01.jpg" },
      { size: "5 × 8 ft", color: "Natural", stock: 8, price: 649900, image: "/images/rugs-01.jpg" },
      { size: "6 × 9 ft", color: "Natural", stock: 5, price: 799900, image: "/images/rugs-03.jpg" },
    ],
  },
  {
    name: "Zoya Flatweave Dhurrie",
    slug: "zoya-flatweave-dhurrie",
    category: "rugs",
    sku: "DCT-RUG-ZOYA",
    price: 349900,
    compareAtPrice: 449900,
    description:
      "A reversible cotton dhurrie with a geometric border and a low, easy-care profile. A versatile layer for dining and living spaces.",
    story:
      "Zoya takes its geometry from the courtyards and carved screens of western India.",
    images: ["/images/rugs-02.jpg", "/images/rugs-04.jpg", "/images/rugs-01.jpg"],
    material: "100% cotton",
    dimensions: "3 × 5 ft · 5 × 8 ft · 6 × 9 ft",
    care: "Vacuum without a beater bar. Machine wash cold on a gentle cycle. Air dry flat.",
    newArrival: true,
    variants: [
      { size: "3 × 5 ft", color: "Ecru / Charcoal", stock: 16, image: "/images/rugs-02.jpg" },
      { size: "5 × 8 ft", color: "Ecru / Charcoal", stock: 9, price: 449900, image: "/images/rugs-02.jpg" },
      { size: "6 × 9 ft", color: "Ecru / Charcoal", stock: 6, price: 599900, image: "/images/rugs-04.jpg" },
    ],
  },
  {
    name: "Earth Loop Wool Rug",
    slug: "earth-loop-wool-rug",
    category: "rugs",
    sku: "DCT-RUG-EARTH",
    price: 799900,
    compareAtPrice: 1099900,
    description:
      "A softly looped wool rug in an organic, tonal design. Dense underfoot, warm in winter and quiet in a room.",
    story:
      "Earth is an heirloom-in-waiting, made slowly in small batches.",
    images: ["/images/rugs-03.jpg", "/images/rugs-01.jpg", "/images/rugs-04.jpg"],
    material: "80% wool, 20% cotton",
    dimensions: "5 × 8 ft · 6 × 9 ft",
    care: "Professional cleaning recommended. Vacuum regularly. Rotate to ensure even wear.",
    featured: true,
    variants: [
      { size: "5 × 8 ft", color: "Earth", stock: 6, image: "/images/rugs-03.jpg" },
      { size: "6 × 9 ft", color: "Earth", stock: 4, price: 999900, image: "/images/rugs-03.jpg" },
    ],
  },
  {
    name: "Mirage Cotton Rug",
    slug: "mirage-cotton-rug",
    category: "rugs",
    sku: "DCT-RUG-MIRAGE",
    price: 299900,
    compareAtPrice: 399900,
    description:
      "A soft cotton rug with a plush low pile and a subtle tonal pattern. Machine washable and made for easy everyday living.",
    story:
      "Mirage is the softest way to bring pattern into a quiet room.",
    images: ["/images/rugs-04.jpg", "/images/rugs-02.jpg", "/images/rugs-03.jpg"],
    material: "100% cotton",
    dimensions: "3 × 5 ft · 5 × 8 ft",
    care: "Machine wash cold on a gentle cycle. Air dry flat. Do not bleach.",
    newArrival: true,
    variants: [
      { size: "3 × 5 ft", color: "Sand", stock: 14, image: "/images/rugs-04.jpg" },
      { size: "5 × 8 ft", color: "Sand", stock: 8, price: 399900, image: "/images/rugs-04.jpg" },
    ],
  },
  {
    name: "Cloud Cotton Sofa Cover Set",
    slug: "cloud-cotton-sofa-cover-set",
    category: "sofa-covers",
    sku: "DCT-SOF-CLOUD",
    price: 299900,
    compareAtPrice: 399900,
    description:
      "A relaxed cotton sofa cover set with a soft washed finish and generous tuck-in panels. Protects without making a sofa feel covered up.",
    story:
      "Cloud is for the sofa that everyone gravitates to at the end of the day.",
    images: ["/images/sofa-01.jpg", "/images/sofa-02.jpg", "/images/sofa-03.jpg"],
    material: "100% washed cotton",
    dimensions: "3+1+1 seater · 3+2 seater · 5 seater",
    care: "Machine wash cold separately. Tumble dry low. Warm iron while slightly damp.",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    variants: [
      { size: "3+1+1 seater", color: "Ivory", stock: 8, image: "/images/sofa-01.jpg" },
      { size: "3+2 seater", color: "Ivory", stock: 10, price: 329900, image: "/images/sofa-02.jpg" },
      { size: "5 seater", color: "Sage", stock: 5, price: 369900, image: "/images/sofa-03.jpg" },
    ],
  },
  {
    name: "Terra Slipcover",
    slug: "terra-slipcover",
    category: "sofa-covers",
    sku: "DCT-SOF-TERRA",
    price: 449900,
    compareAtPrice: 599900,
    description:
      "A textured slipcover with a relaxed drape and a warm terracotta tone. Designed for easy layering over a three-seater sofa.",
    story:
      "Terra is an earthy reset for a room that needs a little warmth.",
    images: ["/images/sofa-02.jpg", "/images/sofa-03.jpg", "/images/sofa-04.jpg"],
    material: "Cotton-linen blend",
    dimensions: "3 seater: fits 78 × 36 in · 2 seater: fits 58 × 36 in",
    care: "Dry clean recommended. Vacuum gently. Smooth by hand after fitting.",
    newArrival: true,
    variants: [
      { size: "2 seater", color: "Terracotta", stock: 7, price: 399900, image: "/images/sofa-02.jpg" },
      { size: "3 seater", color: "Terracotta", stock: 6, image: "/images/sofa-03.jpg" },
    ],
  },
  {
    name: "Loom Woven Sofa Mat",
    slug: "loom-woven-sofa-mat",
    category: "sofa-covers",
    sku: "DCT-SOF-LOOM",
    price: 179900,
    compareAtPrice: 229900,
    description:
      "A woven sofa mat with a subtle stripe and a non-slip backing. A light layer for the seat that takes the most life.",
    story:
      "Loom is small, practical and quietly beautiful.",
    images: ["/images/sofa-03.jpg", "/images/sofa-04.jpg", "/images/sofa-01.jpg"],
    material: "Cotton blend with non-slip backing",
    dimensions: "Sofa mat: 23 × 70 in",
    care: "Machine wash cold on a gentle cycle. Line dry. Do not bleach.",
    variants: [
      { size: "70 × 23 in", color: "Sand Stripe", stock: 20, image: "/images/sofa-03.jpg" },
      { size: "70 × 23 in", color: "Olive Stripe", stock: 14, image: "/images/sofa-04.jpg" },
    ],
  },
  {
    name: "Nook Bouclé Sofa Throw",
    slug: "nook-boucle-sofa-throw",
    category: "sofa-covers",
    sku: "DCT-SOF-NOOK",
    price: 249900,
    compareAtPrice: 319900,
    description:
      "A generously sized bouclé throw with a soft hand and a fringed edge. Layer it over a sofa arm or at the end of a bed.",
    story:
      "Nook is the textile equivalent of a favourite corner.",
    images: ["/images/sofa-04.jpg", "/images/sofa-01.jpg", "/images/sofa-02.jpg"],
    material: "Polyester-cotton bouclé",
    dimensions: "50 × 70 in",
    care: "Dry clean recommended. Spot clean with a soft damp cloth.",
    newArrival: true,
    variants: [
      { size: "50 × 70 in", color: "Oat", stock: 12, image: "/images/sofa-04.jpg" },
      { size: "50 × 70 in", color: "Moss", stock: 8, image: "/images/sofa-01.jpg" },
    ],
  },
  {
    name: "Aahar Linen Table Runner",
    slug: "aahar-linen-table-runner",
    category: "table-linen",
    sku: "DCT-TAB-AAHAR",
    price: 129900,
    compareAtPrice: 169900,
    description:
      "A washed linen table runner with a delicate hemstitch detail. Designed to bring texture to everyday meals without feeling precious.",
    story:
      "Aahar means daily ritual. This runner is made to be used.",
    images: ["/images/dining-01.jpg", "/images/dining-03.jpg", "/images/dining-02.jpg"],
    material: "100% washed linen",
    dimensions: "6 seater: 14 × 72 in · 8 seater: 14 × 90 in",
    care: "Machine wash cold. Tumble dry low. Iron while damp for a crisp finish.",
    featured: true,
    variants: [
      { size: "6 seater", color: "Natural", stock: 18, image: "/images/dining-01.jpg" },
      { size: "8 seater", color: "Natural", stock: 12, price: 149900, image: "/images/dining-03.jpg" },
      { size: "6 seater", color: "Olive", stock: 9, image: "/images/dining-02.jpg" },
    ],
  },
  {
    name: "Saaj Cotton Placemat Set",
    slug: "saaj-cotton-placemat-set",
    category: "table-linen",
    sku: "DCT-TAB-SAAJ",
    price: 149900,
    compareAtPrice: 189900,
    description:
      "A set of four woven cotton placemats with a soft fringe edge. Simple, tactile and easy to mix with any table setting.",
    story:
      "Saaj is the pleasure of setting the table with a little intention.",
    images: ["/images/dining-02.jpg", "/images/dining-04.jpg", "/images/dining-01.jpg"],
    material: "100% cotton",
    dimensions: "Set of 4 · 14 × 19 in",
    care: "Machine wash cold. Line dry. Warm iron if needed.",
    newArrival: true,
    variants: [
      { size: "Set of 4", color: "Oat", stock: 22, image: "/images/dining-02.jpg" },
      { size: "Set of 4", color: "Rust", stock: 16, image: "/images/dining-04.jpg" },
    ],
  },
  {
    name: "Dine Washed Tablecloth",
    slug: "dine-washed-tablecloth",
    category: "table-linen",
    sku: "DCT-TAB-DINE",
    price: 219900,
    compareAtPrice: 279900,
    description:
      "A soft washed cotton tablecloth with a generous drape and mitred corners. Relaxed enough for every day, considered enough for guests.",
    story:
      "Dine is the long table, the extra chair and the second helping.",
    images: ["/images/dining-03.jpg", "/images/dining-01.jpg", "/images/dining-04.jpg"],
    material: "100% cotton",
    dimensions: "6 seater: 60 × 90 in · 8 seater: 60 × 108 in",
    care: "Machine wash cold. Tumble dry low. Warm iron.",
    featured: true,
    variants: [
      { size: "6 seater", color: "Ecru", stock: 14, image: "/images/dining-03.jpg" },
      { size: "8 seater", color: "Ecru", stock: 9, price: 239900, image: "/images/dining-01.jpg" },
    ],
  },
  {
    name: "Chai Napkin Set",
    slug: "chai-napkin-set",
    category: "table-linen",
    sku: "DCT-TAB-CHAI",
    price: 89900,
    compareAtPrice: 119900,
    description:
      "A set of four cotton napkins in a warm neutral, finished with a simple hem. The small everyday luxury that makes a table feel cared for.",
    story:
      "Chai is the pause between one thing and the next.",
    images: ["/images/dining-04.jpg", "/images/dining-02.jpg", "/images/dining-03.jpg"],
    material: "100% cotton",
    dimensions: "Set of 4 · 18 × 18 in",
    care: "Machine wash warm. Tumble dry low. Warm iron.",
    variants: [
      { size: "Set of 4", color: "Clay", stock: 24, image: "/images/dining-04.jpg" },
      { size: "Set of 4", color: "Ecru", stock: 18, image: "/images/dining-02.jpg" },
    ],
  },
  {
    name: "Vayu Ceramic Vase",
    slug: "vayu-ceramic-vase",
    category: "home-decor",
    sku: "DCT-DEC-VAYU",
    price: 189900,
    compareAtPrice: 249900,
    description:
      "A sculptural ceramic vase with a matte, chalky glaze and an organic silhouette. Beautiful empty, extraordinary with a few branches.",
    story:
      "Vayu is shaped by air and hand-finished by ceramicists in small batches.",
    images: ["/images/decor-01.jpg", "/images/decor-03.jpg", "/images/decor-04.jpg"],
    material: "Stoneware ceramic",
    dimensions: "7 in diameter × 12 in height",
    care: "Wipe with a soft damp cloth. Not dishwasher safe. Watertight.",
    badge: "Bestseller",
    featured: true,
    bestseller: true,
    variants: [
      { size: "Medium", color: "Chalk", stock: 14, image: "/images/decor-01.jpg" },
      { size: "Large", color: "Chalk", stock: 8, price: 219900, image: "/images/decor-03.jpg" },
      { size: "Medium", color: "Terracotta", stock: 10, image: "/images/decor-04.jpg" },
    ],
  },
  {
    name: "Aura Sculptural Candle",
    slug: "aura-sculptural-candle",
    category: "home-decor",
    sku: "DCT-DEC-AURA",
    price: 129900,
    compareAtPrice: 169900,
    description:
      "A hand-poured sculptural candle in a warm ivory wax with a soft, unscented burn. A small object with a large presence.",
    story:
      "Aura is for the shelf that needs one quiet object.",
    images: ["/images/decor-02.jpg", "/images/decor-04.jpg", "/images/decor-01.jpg"],
    material: "Soy wax blend, cotton wick",
    dimensions: "4 × 6 in · Approx. 30 hour burn",
    care: "Trim wick to 5 mm before each use. Burn on a heat-safe surface. Never leave unattended.",
    newArrival: true,
    variants: [
      { size: "Small", color: "Ivory", stock: 20, image: "/images/decor-02.jpg" },
      { size: "Large", color: "Ivory", stock: 10, price: 149900, image: "/images/decor-02.jpg" },
    ],
  },
  {
    name: "Kala Wall Art Set",
    slug: "kala-wall-art-set",
    category: "home-decor",
    sku: "DCT-DEC-KALA",
    price: 349900,
    compareAtPrice: 449900,
    description:
      "A pair of framed abstract prints in warm earth tones, inspired by handmade paper and mineral pigments. Sold as a set of two.",
    story:
      "Kala is a conversation between negative space and pigment.",
    images: ["/images/decor-03.jpg", "/images/decor-05.jpg", "/images/decor-06.jpg"],
    material: "Archival print on textured paper, oak frame",
    dimensions: "Set of 2 · 12 × 16 in each",
    care: "Dust gently with a dry cloth. Avoid direct sunlight.",
    featured: true,
    variants: [
      { size: "12 × 16 in", color: "Earth", stock: 9, image: "/images/decor-03.jpg" },
      { size: "16 × 20 in", color: "Earth", stock: 5, price: 399900, image: "/images/decor-05.jpg" },
    ],
  },
  {
    name: "Oasis Stoneware Planter",
    slug: "oasis-stoneware-planter",
    category: "home-decor",
    sku: "DCT-DEC-OASIS",
    price: 159900,
    compareAtPrice: 199900,
    description:
      "A rounded stoneware planter with a soft satin glaze and a matching saucer. Made for the plant that has become part of the family.",
    story:
      "Oasis is a small patch of green in a busy room.",
    images: ["/images/decor-05.jpg", "/images/decor-06.jpg", "/images/decor-07.jpg"],
    material: "Glazed stoneware",
    dimensions: "8 in diameter × 7 in height",
    care: "Wipe clean. Suitable for indoor plants. Drainage hole with saucer.",
    newArrival: true,
    variants: [
      { size: "8 in", color: "Moss", stock: 12, image: "/images/decor-05.jpg" },
      { size: "10 in", color: "Moss", stock: 7, price: 189900, image: "/images/decor-06.jpg" },
    ],
  },
];

const settings = [
  ["heroEyebrow", "The considered home · Volume 01"],
  ["heroTitle", "Make room for beautiful living."],
  ["heroSubtitle", "Thoughtfully chosen furnishings for the home you love."],
  ["announcement", "Decoritu preview · Curated furnishings, sample catalogue"],
  ["announcementSecondary", "Complimentary shipping on orders over ₹1,999"],
  ["supportEmail", "hello@decoritu.in"],
  ["supportHours", "Mon–Sat, 10am–6pm IST"],
  ["shippingThreshold", "199900"],
  ["shippingFee", "9900"],
  ["returnWindow", "7"],
  ["demoNote", "Sample catalogue and pricing are shown for preview. No live payment is captured in demo mode."],
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@decoritu.in").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "DecorituAdmin!2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Decoritu Studio", role: "ADMIN" },
    create: {
      name: "Decoritu Studio",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        image: category.image,
        sortOrder: category.sortOrder,
        active: true,
      },
      create: category,
    });
    categoryMap.set(record.slug, record.id);
  }

  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    if (!categoryId) throw new Error(`Missing category ${product.category}`);

    const sumStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
    const productRecord = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        story: product.story,
        categoryId,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: sumStock,
        images: JSON.stringify(product.images),
        material: product.material,
        dimensions: product.dimensions,
        care: product.care,
        badge: product.badge,
        featured: product.featured ?? false,
        newArrival: product.newArrival ?? false,
        bestseller: product.bestseller ?? false,
        active: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        story: product.story,
        categoryId,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        stock: sumStock,
        images: JSON.stringify(product.images),
        material: product.material,
        dimensions: product.dimensions,
        care: product.care,
        badge: product.badge,
        featured: product.featured ?? false,
        newArrival: product.newArrival ?? false,
        bestseller: product.bestseller ?? false,
      },
    });

    await prisma.productVariant.deleteMany({ where: { productId: productRecord.id } });

    for (const [index, variant] of product.variants.entries()) {
      await prisma.productVariant.create({
        data: {
          productId: productRecord.id,
          sku: `${product.sku}-${String(index + 1).padStart(2, "0")}`,
          size: variant.size,
          color: variant.color,
          price: variant.price ?? product.price,
          compareAtPrice: variant.price ? variant.compareAtPrice ?? null : product.compareAtPrice,
          stock: variant.stock,
          image: variant.image ?? product.images[0],
          active: true,
        },
      });
    }
  }

  for (const [key, value] of settings) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      description: "10% off your first order, up to ₹1,000",
      type: "PERCENT",
      value: 10,
      minSubtotal: 199900,
      maxDiscount: 100000,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FESTIVE15" },
    update: {},
    create: {
      code: "FESTIVE15",
      description: "15% off orders over ₹3,999, up to ₹2,000",
      type: "PERCENT",
      value: 15,
      minSubtotal: 399900,
      maxDiscount: 200000,
      active: true,
    },
  });

  console.log(`Seeded ${products.length} products across ${categories.length} categories.`);
  console.log(`Admin account: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

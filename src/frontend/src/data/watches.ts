export type Category =
  | "All"
  | "Dress"
  | "Sport"
  | "Dive"
  | "Chronograph"
  | "Vintage";

export interface Watch {
  id: number;
  name: string;
  brand: string;
  category: Exclude<Category, "All">;
  price: number;
  image: string;
  description: string;
  specs: {
    caseSize: string;
    material: string;
    waterResistance: string;
    movement: string;
    crystal?: string;
    strap?: string;
  };
}

export const watches: Watch[] = [
  {
    id: 1,
    name: "Aurel Noir",
    brand: "Denseverse",
    category: "Dress",
    price: 23987,
    image: "/assets/generated/watch-dress.dim_600x600.jpg",
    description:
      "A masterpiece of understated elegance. The Aurel Noir features a striking black dial set within a polished gold case, finished with sapphire crystal glass for unparalleled clarity. Perfect for the modern professional who demands sophistication.",
    specs: {
      caseSize: "40mm",
      material: "316L Stainless Steel, Gold PVD",
      waterResistance: "50m",
      movement: "Swiss Quartz",
      crystal: "Sapphire Crystal",
      strap: "Italian Leather",
    },
  },
  {
    id: 2,
    name: "Meridian Rose",
    brand: "Denseverse",
    category: "Dress",
    price: 28967,
    image: "/assets/generated/watch-dress.dim_600x600.jpg",
    description:
      "Timeless femininity meets horological precision. Rose gold case with a luminous champagne dial, powered by a Japanese automatic movement that hums with quiet confidence.",
    specs: {
      caseSize: "38mm",
      material: "Rose Gold PVD Stainless Steel",
      waterResistance: "30m",
      movement: "Japanese Automatic (Miyota)",
      crystal: "Anti-Reflective Sapphire",
      strap: "Rose Gold Mesh Bracelet",
    },
  },
  {
    id: 3,
    name: "Chrono Apex",
    brand: "Denseverse",
    category: "Chronograph",
    price: 41417,
    image: "/assets/generated/watch-chrono.dim_600x600.jpg",
    description:
      "Engineered for those who measure every second. Swiss ETA chronograph movement, silver stainless steel case, delivering split-second precision with elegant white sub-dials and a legible tachymeter bezel.",
    specs: {
      caseSize: "42mm",
      material: "Brushed 316L Stainless Steel",
      waterResistance: "100m",
      movement: "Swiss ETA 7750 Automatic",
      crystal: "Sapphire Crystal",
      strap: "Stainless Steel Bracelet",
    },
  },
  {
    id: 4,
    name: "Chrono Noir",
    brand: "Denseverse",
    category: "Chronograph",
    price: 45567,
    image: "/assets/generated/watch-chrono.dim_600x600.jpg",
    description:
      "Full black PVD case with skeleton sub-dials that reveal the complexity beneath. Swiss automatic chronograph movement, 44mm commanding presence — this watch makes no apologies.",
    specs: {
      caseSize: "44mm",
      material: "Black PVD Stainless Steel",
      waterResistance: "100m",
      movement: "Swiss Automatic Chronograph",
      crystal: "Domed Sapphire Crystal",
      strap: "Black Rubber + Leather",
    },
  },
  {
    id: 5,
    name: "DeepBlue Pro",
    brand: "Denseverse",
    category: "Dive",
    price: 33117,
    image: "/assets/generated/watch-dive.dim_600x600.jpg",
    description:
      "Built for the depths, worn above them. Professional 300m water resistance, unidirectional rotating bezel, and luminous markers that glow green in complete darkness.",
    specs: {
      caseSize: "44mm",
      material: "DLC-Coated Stainless Steel",
      waterResistance: "300m",
      movement: "Japanese Automatic",
      crystal: "Scratch-Resistant Sapphire",
      strap: "Black FKM Rubber",
    },
  },
  {
    id: 6,
    name: "Abyss Commander",
    brand: "Denseverse",
    category: "Dive",
    price: 38097,
    image: "/assets/generated/watch-dive.dim_600x600.jpg",
    description:
      "Command the deep. 500m water resistance and a dramatic dark teal bezel. Oversized luminous markers ensure readability at extreme depths. Professional grade. Accessible price.",
    specs: {
      caseSize: "45mm",
      material: "Solid 316L Stainless Steel",
      waterResistance: "500m",
      movement: "Swiss ETA 2824 Automatic",
      crystal: "Helium-Safe Sapphire",
      strap: "Dark Teal Rubber + Textile",
    },
  },
  {
    id: 7,
    name: "Veloce GT",
    brand: "Denseverse",
    category: "Sport",
    price: 26477,
    image: "/assets/generated/watch-sport.dim_600x600.jpg",
    description:
      "Aerospace-grade titanium case weighing just 60 grams, paired with a skeleton dial exposing the precision movement within. Engineered for athletes, designed for everyone.",
    specs: {
      caseSize: "43mm",
      material: "Grade 2 Titanium",
      waterResistance: "100m",
      movement: "Japanese Automatic",
      crystal: "Anti-Reflective Mineral",
      strap: "Titanium Bracelet",
    },
  },
  {
    id: 8,
    name: "Sprint X1",
    brand: "Denseverse",
    category: "Sport",
    price: 23157,
    image: "/assets/generated/watch-sport.dim_600x600.jpg",
    description:
      "Anti-shock movement technology in a robust stainless steel case with a functional tachymeter bezel. Whether timing a lap or closing a deal, the Sprint X1 keeps up.",
    specs: {
      caseSize: "42mm",
      material: "316L Stainless Steel",
      waterResistance: "100m",
      movement: "Anti-Shock Quartz",
      crystal: "Hardened Mineral Crystal",
      strap: "Silicone Sport Band",
    },
  },
  {
    id: 9,
    name: "Heritage 1952",
    brand: "Denseverse",
    category: "Vintage",
    price: 32287,
    image: "/assets/generated/watch-vintage.dim_600x600.jpg",
    description:
      "A love letter to horological history. Roman numerals, warm cream dial with age-patina tones, and a manually wound movement that connects you to every watchmaker who came before.",
    specs: {
      caseSize: "38mm",
      material: "Gold-Plated Brass",
      waterResistance: "30m",
      movement: "Hand-Wound Mechanical",
      crystal: "Acrylic (Vintage Authentic)",
      strap: "Tan Vintage Leather",
    },
  },
  {
    id: 10,
    name: "Classique Antique",
    brand: "Denseverse",
    category: "Vintage",
    price: 35607,
    image: "/assets/generated/watch-vintage.dim_600x600.jpg",
    description:
      "An open-heart dial reveals the beating escapement beneath an aged gold case. A manual-wind movement with visible oscillation — a window into timekeeping's beautiful complexity.",
    specs: {
      caseSize: "36mm",
      material: "Aged Gold Stainless Steel",
      waterResistance: "30m",
      movement: "Manual Wind, Open-Heart",
      crystal: "Domed Mineral Glass",
      strap: "Crocodile-Embossed Leather",
    },
  },
  {
    id: 11,
    name: "Lumière Blanc",
    brand: "Denseverse",
    category: "Dress",
    price: 21497,
    image: "/assets/generated/watch-dress.dim_600x600.jpg",
    description:
      "Purity of form. A pristine white minimalist dial, whisper-thin 6.5mm silver case, and a Japanese quartz movement that never misses a beat. Simple. Perfect.",
    specs: {
      caseSize: "39mm",
      material: "Polished 316L Stainless Steel",
      waterResistance: "50m",
      movement: "Japanese Quartz (Miyota)",
      crystal: "Sapphire Crystal",
      strap: "White Nappa Leather",
    },
  },
  {
    id: 12,
    name: "Obsidian Edge",
    brand: "Denseverse",
    category: "Chronograph",
    price: 49717,
    image: "/assets/generated/watch-chrono.dim_600x600.jpg",
    description:
      "The pinnacle of the Denseverse collection. Carbon fiber bezel that cuts light into dramatic angles, all-black 45mm case, and a Swiss automatic chronograph movement. Extraordinary.",
    specs: {
      caseSize: "45mm",
      material: "Carbon Fiber & Black PVD Steel",
      waterResistance: "200m",
      movement: "Swiss Automatic Chronograph",
      crystal: "Sapphire with AR Coating",
      strap: "Carbon Fiber Pattern Rubber",
    },
  },
];

export const categories: Category[] = [
  "All",
  "Dress",
  "Sport",
  "Dive",
  "Chronograph",
  "Vintage",
];

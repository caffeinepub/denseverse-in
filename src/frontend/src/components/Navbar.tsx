import { ShoppingBag, Watch } from "lucide-react";
import { motion } from "motion/react";
import type { Category } from "../data/watches";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
  activeCategory: Category;
  onCategoryChange: (cat: Category) => void;
}

export function Navbar({
  cartCount,
  onCartOpen,
  activeCategory,
  onCategoryChange,
}: NavbarProps) {
  const navLinks: { label: string; category: Category }[] = [
    { label: "Dress", category: "Dress" },
    { label: "Sport", category: "Sport" },
    { label: "Dive", category: "Dive" },
    { label: "Chronograph", category: "Chronograph" },
    { label: "Vintage", category: "Vintage" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <motion.button
          type="button"
          onClick={() => onCategoryChange("All")}
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Watch className="w-5 h-5 text-gold" />
          <span className="font-display text-xl font-semibold text-foreground tracking-tight">
            denseverse<span className="text-gold">.in</span>
          </span>
        </motion.button>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <button
              key={link.category}
              type="button"
              data-ocid={`nav.link.${i + 1}`}
              onClick={() => onCategoryChange(link.category)}
              className={`px-4 py-2 text-sm font-body font-medium transition-colors duration-200 ${
                activeCategory === link.category
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <motion.button
          type="button"
          data-ocid="nav.cart_button"
          onClick={onCartOpen}
          className="relative flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
          <span className="hidden sm:block text-sm font-medium">Cart</span>
        </motion.button>
      </nav>
    </header>
  );
}

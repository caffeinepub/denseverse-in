import { Toaster } from "@/components/ui/sonner";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { FilterBar } from "./components/FilterBar";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";
import { ProductGrid } from "./components/ProductGrid";
import { ProductModal } from "./components/ProductModal";
import { type Category, watches as staticWatches } from "./data/watches";
import type { Watch } from "./data/watches";
import { useActor } from "./hooks/useActor";
import { AdminPage } from "./pages/AdminPage";
import type { CartItem } from "./types/cart";
import { formatINR } from "./utils/currency";

const isAdminRoute =
  typeof window !== "undefined" &&
  window.location.pathname.startsWith("/admin");

function StoreFront() {
  const { actor, isFetching: actorFetching } = useActor();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [watches, setWatches] = useState<Watch[]>(staticWatches);

  useEffect(() => {
    if (!actor || actorFetching) return;
    actor
      .initializeWatchesIfEmpty()
      .then(() => actor.getWatches())
      .then((result) => {
        if (result.length > 0) {
          const mapped: Watch[] = result.map((w) => ({
            id: Number(w.id),
            name: w.name,
            brand: w.brand,
            category: w.category as Exclude<Category, "All">,
            price: Number(w.price),
            image: w.image,
            description: w.description,
            specs: {
              caseSize: w.specs.caseSize,
              material: w.specs.material,
              waterResistance: w.specs.waterResistance,
              movement: w.specs.movement,
              crystal: w.specs.crystal,
              strap: w.specs.strap,
            },
          }));
          setWatches(mapped);
        }
      })
      .catch(() => {
        // silently fall back to static data
      });
  }, [actor, actorFetching]);

  const filteredWatches = useMemo(() => {
    if (activeCategory === "All") return watches;
    return watches.filter((w) => w.category === activeCategory);
  }, [activeCategory, watches]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of watches) {
      counts[w.category] = (counts[w.category] ?? 0) + 1;
    }
    return counts;
  }, [watches]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (watch: Watch, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.watch.id === watch.id);
      if (existing) {
        return prev.map((i) =>
          i.watch.id === watch.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { watch, quantity }];
    });
    toast.success(`${watch.name} added to cart`, {
      description: `${formatINR(watch.price)} · ${watch.category}`,
    });
  };

  const handleUpdateQuantity = (watchId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(watchId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.watch.id === watchId ? { ...i, quantity } : i)),
    );
  };

  const handleRemove = (watchId: number) => {
    setCartItems((prev) => prev.filter((i) => i.watch.id !== watchId));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setTimeout(() => {
      setCartItems([]);
      setCheckoutOpen(false);
    }, 4000);
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main>
        <HeroSection onShopNow={scrollToProducts} />
        <div id="products">
          <FilterBar
            active={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
          <ProductGrid
            watches={filteredWatches}
            activeCategory={activeCategory}
            onAddToCart={(w) => handleAddToCart(w)}
            onOpenDetail={setSelectedWatch}
          />
        </div>
      </main>
      <Footer />
      <ProductModal
        watch={selectedWatch}
        onClose={() => setSelectedWatch(null)}
        onAddToCart={handleAddToCart}
      />
      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
      <CheckoutModal
        open={checkoutOpen}
        items={cartItems}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      {isAdminRoute ? <AdminPage /> : <StoreFront />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.12 0.002 60)",
            border: "1px solid oklch(0.22 0.01 70)",
            color: "oklch(0.95 0.005 70)",
          },
        }}
      />
    </>
  );
}

import type { Category, Watch } from "../data/watches";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  watches: Watch[];
  activeCategory: Category;
  onAddToCart: (watch: Watch) => void;
  onOpenDetail: (watch: Watch) => void;
}

export function ProductGrid({
  watches,
  activeCategory,
  onAddToCart,
  onOpenDetail,
}: ProductGridProps) {
  if (watches.length === 0) {
    return (
      <div data-ocid="product.empty_state" className="text-center py-24 px-4">
        <p className="font-display text-3xl text-muted-foreground/50 mb-3">
          No watches found
        </p>
        <p className="font-body text-muted-foreground text-sm">
          Try a different category
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
          {activeCategory === "All"
            ? "All Timepieces"
            : `${activeCategory} Collection`}
        </h2>
        <span className="font-body text-sm text-muted-foreground">
          {watches.length} {watches.length === 1 ? "piece" : "pieces"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {watches.map((watch, i) => (
          <ProductCard
            key={watch.id}
            watch={watch}
            index={i + 1}
            onAddToCart={onAddToCart}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </section>
  );
}

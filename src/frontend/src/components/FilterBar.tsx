import { motion } from "motion/react";
import { type Category, categories } from "../data/watches";

interface FilterBarProps {
  active: Category;
  onChange: (cat: Category) => void;
  counts: Record<string, number>;
}

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <section className="sticky top-16 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-thin">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              data-ocid="filter.tab"
              onClick={() => onChange(cat)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0 px-5 py-2 text-sm font-body font-medium transition-all duration-200 ${
                active === cat
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {active === cat && (
                <motion.span
                  layoutId="filter-bg"
                  className="absolute inset-0 gold-gradient"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {cat}
                {cat !== "All" && (
                  <span
                    className={`ml-1.5 text-xs ${
                      active === cat
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    ({counts[cat] ?? 0})
                  </span>
                )}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { Watch } from "../data/watches";
import { formatINR } from "../utils/currency";

interface ProductCardProps {
  watch: Watch;
  index: number;
  onAddToCart: (watch: Watch) => void;
  onOpenDetail: (watch: Watch) => void;
}

export function ProductCard({
  watch,
  index,
  onAddToCart,
  onOpenDetail,
}: ProductCardProps) {
  return (
    <motion.div
      data-ocid={`product.item.${index}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group bg-card border border-border card-hover"
    >
      <button
        type="button"
        className="relative overflow-hidden aspect-square bg-muted w-full block"
        onClick={() => onOpenDetail(watch)}
        data-ocid="product.open_modal_button"
      >
        <img
          src={watch.image}
          alt={watch.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm text-gold border-gold/30 text-xs font-body"
          >
            {watch.category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-sm font-medium text-foreground bg-background/80 backdrop-blur-sm px-4 py-2">
            View Details
          </span>
        </div>
      </button>

      <div className="p-5">
        <p className="text-xs font-body text-muted-foreground tracking-widest uppercase mb-1">
          {watch.brand}
        </p>
        <button
          type="button"
          className="font-display text-lg font-semibold text-foreground leading-tight hover:text-gold transition-colors text-left w-full"
          onClick={() => onOpenDetail(watch)}
        >
          {watch.name}
        </button>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display text-2xl font-bold text-gold">
            {formatINR(watch.price)}
          </span>
          <motion.button
            type="button"
            data-ocid={`product.add_button.${index}`}
            onClick={() => onAddToCart(watch)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-gold hover:text-primary-foreground text-foreground text-sm font-body font-medium transition-all duration-200 border border-border hover:border-gold"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:block">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

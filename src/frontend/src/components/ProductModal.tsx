import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Watch } from "../data/watches";
import { formatINR } from "../utils/currency";

interface ProductModalProps {
  watch: Watch | null;
  onClose: () => void;
  onAddToCart: (watch: Watch, quantity: number) => void;
}

export function ProductModal({
  watch,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (!watch) return;
    onAddToCart(watch, quantity);
    onClose();
  };

  const rows: [string, string | undefined][] = watch
    ? [
        ["Case Size", watch.specs.caseSize],
        ["Material", watch.specs.material],
        ["Water Resistance", watch.specs.waterResistance],
        ["Movement", watch.specs.movement],
        ["Crystal", watch.specs.crystal],
        ["Strap", watch.specs.strap],
      ]
    : [];

  return (
    <AnimatePresence>
      {watch && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin pointer-events-auto">
              <div className="flex justify-end p-4 pb-0">
                <button
                  type="button"
                  data-ocid="product.close_button"
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <img
                    src={watch.image}
                    alt={watch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
                </div>
                <div className="p-6 sm:p-8 flex flex-col">
                  <div className="mb-6">
                    <p className="text-xs font-body text-gold tracking-[0.2em] uppercase mb-2">
                      {watch.brand} · {watch.category}
                    </p>
                    <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                      {watch.name}
                    </h2>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                      {watch.description}
                    </p>
                  </div>
                  <div className="border border-border mb-6">
                    <div className="px-4 py-2 border-b border-border">
                      <span className="text-xs font-body font-semibold text-gold tracking-widest uppercase">
                        Specifications
                      </span>
                    </div>
                    <table className="w-full">
                      <tbody>
                        {rows
                          .filter(
                            (r): r is [string, string] => r[1] !== undefined,
                          )
                          .map(([label, value]) => (
                            <tr
                              key={label}
                              className="border-b border-border last:border-0"
                            >
                              <td className="px-4 py-2.5 text-xs font-body text-muted-foreground w-1/2">
                                {label}
                              </td>
                              <td className="px-4 py-2.5 text-xs font-body text-foreground">
                                {value}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-display text-4xl font-bold text-gold">
                        {formatINR(watch.price)}
                      </span>
                      <div className="flex items-center gap-3 border border-border">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-body font-semibold text-foreground w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="p-2.5 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      data-ocid="product.primary_button"
                      onClick={handleAdd}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 gold-gradient text-primary-foreground font-body font-semibold text-sm py-4"
                      style={{
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart · {formatINR(watch.price * quantity)}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

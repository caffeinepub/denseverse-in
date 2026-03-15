import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { CartItem } from "../types/cart";
import { formatINR } from "../utils/currency";

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (watchId: number, quantity: number) => void;
  onRemove: (watchId: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  items,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.watch.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            data-ocid="cart.panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="text-xs font-body text-muted-foreground bg-muted px-2 py-0.5">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                type="button"
                data-ocid="cart.close_button"
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {items.length === 0 ? (
                <div
                  data-ocid="cart.empty_state"
                  className="flex flex-col items-center justify-center h-full text-center px-6"
                >
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="font-display text-xl text-muted-foreground/60">
                    Your cart is empty
                  </p>
                  <p className="font-body text-sm text-muted-foreground/40 mt-2">
                    Add a timepiece to begin
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.watch.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 p-4 bg-background border border-border"
                    >
                      <img
                        src={item.watch.image}
                        alt={item.watch.name}
                        className="w-20 h-20 object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-0.5">
                          {item.watch.brand}
                        </p>
                        <h4 className="font-display text-sm font-semibold text-foreground truncate">
                          {item.watch.name}
                        </h4>
                        <p className="font-display text-base font-bold text-gold mt-1">
                          {formatINR(item.watch.price)}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 border border-border">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.watch.id,
                                  item.quantity - 1,
                                )
                              }
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-body text-sm font-medium w-5 text-center text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(
                                  item.watch.id,
                                  item.quantity + 1,
                                )
                              }
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            data-ocid={`cart.delete_button.${i + 1}`}
                            onClick={() => onRemove(item.watch.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <motion.button
                  type="button"
                  data-ocid="cart.primary_button"
                  onClick={onCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full gold-gradient text-primary-foreground font-body font-semibold text-sm py-4"
                  style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
                >
                  Proceed to Checkout
                </motion.button>
                <p className="text-center font-body text-xs text-muted-foreground mt-3">
                  Free shipping · 2-year warranty included
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

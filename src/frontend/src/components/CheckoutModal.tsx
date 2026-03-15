import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Package, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { CartItem } from "../types/cart";
import { formatINR } from "../utils/currency";

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}

function generateOrderId() {
  return `DV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function CheckoutModal({
  open,
  items,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [orderId] = useState(generateOrderId);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const subtotal = items.reduce(
    (sum, item) => sum + item.watch.price * item.quantity,
    0,
  );

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      newErrors.email = "Valid email required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", address: "" });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            data-ocid="checkout.modal"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin pointer-events-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {submitted ? "Order Confirmed" : "Complete Your Order"}
                </h2>
                <button
                  type="button"
                  data-ocid="checkout.close_button"
                  onClick={handleClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      data-ocid="checkout.success_state"
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6"
                      >
                        <CheckCircle className="w-10 h-10 text-primary-foreground" />
                      </motion.div>
                      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                        Thank you, {form.name.split(" ")[0]}!
                      </h3>
                      <p className="font-body text-muted-foreground mb-6">
                        Your luxury timepiece is on its way.
                      </p>
                      <div className="bg-muted border border-border p-4 mb-6">
                        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1">
                          Order Reference
                        </p>
                        <p className="font-display text-2xl font-bold text-gold">
                          {orderId}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 justify-center text-sm font-body text-muted-foreground">
                        <Package className="w-4 h-4 text-gold" />
                        Estimated delivery: 5–7 business days
                      </div>
                      <p className="font-body text-xs text-muted-foreground mt-2">
                        A confirmation will be sent to {form.email}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="bg-background border border-border p-4 mb-2">
                        <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-3">
                          Order Summary
                        </p>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.watch.id}
                              className="flex justify-between text-sm font-body"
                            >
                              <span className="text-muted-foreground">
                                {item.watch.name} × {item.quantity}
                              </span>
                              <span className="text-foreground">
                                {formatINR(item.watch.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border mt-3 pt-3 flex justify-between">
                          <span className="font-body font-semibold text-foreground text-sm">
                            Total
                          </span>
                          <span className="font-display font-bold text-gold">
                            {formatINR(subtotal)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="co-name"
                          className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 block"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="co-name"
                          data-ocid="checkout.input"
                          value={form.name}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                          }
                          placeholder="Your full name"
                          className="bg-background border-border font-body"
                        />
                        {errors.name && (
                          <p
                            data-ocid="checkout.error_state"
                            className="text-xs text-destructive mt-1 font-body"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="co-email"
                          className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 block"
                        >
                          Email
                        </Label>
                        <Input
                          id="co-email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                          }
                          placeholder="you@example.com"
                          className="bg-background border-border font-body"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1 font-body">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="co-phone"
                          className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 block"
                        >
                          Phone
                        </Label>
                        <Input
                          id="co-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                          }
                          placeholder="+91 98765 43210"
                          className="bg-background border-border font-body"
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive mt-1 font-body">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label
                          htmlFor="co-address"
                          className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2 block"
                        >
                          Shipping Address
                        </Label>
                        <Textarea
                          id="co-address"
                          value={form.address}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, address: e.target.value }))
                          }
                          placeholder="Street address, city, state, PIN code"
                          rows={3}
                          className="bg-background border-border font-body resize-none"
                        />
                        {errors.address && (
                          <p className="text-xs text-destructive mt-1 font-body">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <motion.button
                        data-ocid="checkout.submit_button"
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full gold-gradient text-primary-foreground font-body font-semibold text-sm py-4 mt-2"
                        style={{
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Pay Now · {formatINR(subtotal)}
                      </motion.button>
                      <p className="text-center font-body text-xs text-muted-foreground">
                        Secure checkout · 256-bit SSL encryption
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

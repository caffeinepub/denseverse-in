import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onShopNow: () => void;
}

export function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/generated/hero-watch.dim_1200x700.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gold opacity-60" />
          <span className="text-gold text-xs font-body font-semibold tracking-[0.3em] uppercase">
            Luxury Timepieces
          </span>
          <div className="h-px w-12 bg-gold opacity-60" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-foreground leading-none mb-4"
        >
          Time.
          <br />
          <span className="italic text-gold-gradient">Redefined.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-body text-lg sm:text-xl text-muted-foreground mt-6 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Premium luxury watches at prices that make sense.
          <br className="hidden sm:block" />
          Swiss-inspired. Uncompromising quality.
        </motion.p>

        <motion.button
          data-ocid="hero.primary_button"
          onClick={onShopNow}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 gold-gradient text-primary-foreground font-body font-semibold text-base px-10 py-4"
          style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          Shop Now
          <span className="block w-px h-4 bg-primary-foreground/40" />
          <ChevronDown className="w-4 h-4" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex items-center justify-center gap-10 sm:gap-16 mt-16"
        >
          {[
            { value: "12+", label: "Timepieces" },
            { value: "100%", label: "Authentic" },
            { value: "2yr", label: "Warranty" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl sm:text-3xl font-bold text-gold">
                {stat.value}
              </div>
              <div className="font-body text-xs text-muted-foreground tracking-[0.15em] uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="w-5 h-5 text-gold/50" />
      </motion.div>
    </section>
  );
}

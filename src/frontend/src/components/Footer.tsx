import { Watch } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  const collectionLinks = [
    "Dress Watches",
    "Sport Watches",
    "Dive Watches",
    "Chronographs",
    "Vintage",
  ];
  const supportLinks = [
    "About Us",
    "Contact",
    "Returns & Exchanges",
    "Privacy Policy",
    "Shipping Info",
  ];

  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Watch className="w-5 h-5 text-gold" />
              <span className="font-display text-xl font-semibold">
                denseverse<span className="text-gold">.in</span>
              </span>
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium luxury timepieces crafted for those who understand that
              elegance should never come at an unreasonable price.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <div className="h-px flex-1 max-w-[40px] bg-gold/30" />
              <span className="font-body text-xs text-gold/60 tracking-[0.2em] uppercase">
                Est. 2024
              </span>
            </div>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Collections
            </h4>
            <ul className="space-y-2">
              {collectionLinks.map((item) => (
                <li key={item}>
                  <span className="font-body text-sm text-muted-foreground hover:text-gold transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {supportLinks.map((item) => (
                <li key={item}>
                  <span className="font-body text-sm text-muted-foreground hover:text-gold transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground">
            © {currentYear} denseverse.in. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/admin"
              data-ocid="footer.admin_link"
              className="font-body text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              Admin
            </a>
            <p className="font-body text-xs text-muted-foreground">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

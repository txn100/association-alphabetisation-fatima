import { useState, useEffect } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import type { UIStrings } from "../../lib/i18n";

/** Fallback label→anchor map. Used when TinaCloud strips href values from navigation.json. */
const FALLBACK_ANCHORS: Record<string, string> = {
  accueil: "#accueil",  home: "#accueil",
  "notre histoire": "#apropos",  "our story": "#apropos",
  "le parcours": "#parcours",  programs: "#parcours",
  projets: "#projets",  "eco projects": "#projets",  "projets eco-responsables": "#projets",
  "pédagogie": "#pedagogie",  pedagogy: "#pedagogie",
  galerie: "#galerie",  gallery: "#galerie",
};

/** Return link.href if present, otherwise derive from label. */
function resolveHref(link: { href?: string; label?: string }): string {
  if (link.href) return link.href;
  const key = (link.label || "").toLowerCase().trim();
  return FALLBACK_ANCHORS[key] || "#";
}

export default function NavbarVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const ui: UIStrings | undefined = props.ui;
  const nav = data?.navigation;
  const links = nav?.links || [];
  const ctaText = nav?.ctaText || "Devenir Parrain";
  const navbarTitle = nav?.navbarTitle || "Association d'Alphabétisation de Fatima";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      if (menuOpen) setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  const smoothScroll = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="bg-white shadow-md fixed w-full z-50 transition-all duration-300"
      style={scrolled ? { backgroundColor: "rgba(255,255,255,0.95)" } : undefined}
      aria-label={ui?.navAriaLabel || "Navigation principale"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 md:h-20 items-center">
          {/* Logo */}
          <a href="#accueil" onClick={smoothScroll("#accueil")} className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
            <img
              src="/images/logo-fatima-hq.webp"
              alt="Logo Association d'Alphabétisation de Fatima"
              className="h-9 sm:h-11 md:h-14 w-auto flex-shrink-0"
              width={64}
              height={64}
            />
            <span
              className="navbar-title font-heading font-semibold text-brand-blue leading-tight text-[0.65rem] sm:text-xs md:text-sm"
              data-tina-field={nav ? tinaField(nav, "navbarTitle") : undefined}
            >
              {navbarTitle}
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 items-center">
            {links.map((link: any, i: number) => {
              const href = resolveHref(link);
              return (
                <a
                  key={i}
                  href={href}
                  onClick={smoothScroll(href)}
                  className="text-gray-600 hover:text-brand-blue font-semibold transition"
                  data-tina-field={tinaField(link, "label")}
                >
                  {href === "#projets" && (
                    <i className="fas fa-seedling text-emerald-500 mr-1 text-xs" />
                  )}
                  {link.label}
                </a>
              );
            })}
            {/* Language switcher */}
            <a
              href={ui?.langSwitchHref || "/en/"}
              className="text-gray-500 hover:text-brand-blue font-bold text-sm border border-gray-300 px-3 py-1 rounded-full transition hover:border-brand-blue"
            >
              {ui?.langSwitchLabel || "EN"}
            </a>
            <a
              href="#faire-un-don"
              onClick={smoothScroll("#faire-un-don")}
              className="bg-brand-pink hover:bg-pink-600 text-white px-5 py-2 rounded-full font-bold shadow-sm transition transform hover:scale-105"
              data-tina-field={nav ? tinaField(nav, "ctaText") : undefined}
            >
              <i className="fas fa-heart mr-2" /> {ctaText}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-btn"
            className="md:hidden text-gray-600 hover:text-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded p-2 -mr-2 outline-none"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu-panel"
            aria-label={ui?.menuAriaLabel || "Ouvrir le menu"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className="fas fa-bars text-2xl" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel — always in DOM, toggled via CSS + JS */}
      <div
        id="mobile-menu-panel"
        className={`md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg ${menuOpen ? "" : "hidden"}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {links.map((link: any, i: number) => {
            const href = resolveHref(link);
            return (
              <a
                key={i}
                href={href}
                onClick={smoothScroll(href)}
                className="mobile-nav-link block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50"
                data-tina-field={tinaField(link, "label")}
              >
                {href === "#projets" && (
                  <i className="fas fa-seedling text-emerald-500 mr-1.5" />
                )}
                {link.label}
              </a>
            );
          })}
          {/* Mobile language switcher */}
          <a
            href={ui?.langSwitchHref || "/en/"}
            className="mobile-nav-link block px-3 py-3 rounded-md text-base font-bold text-gray-500 hover:text-brand-blue hover:bg-gray-50"
          >
            <i className="fas fa-globe mr-1.5" />
            {ui?.langSwitchLabel || "EN"}
          </a>
          <a
            href="#faire-un-don"
            onClick={smoothScroll("#faire-un-don")}
            className="mobile-nav-link block px-3 py-3 mt-4 text-center rounded-md text-base font-bold bg-brand-pink text-white"
            data-tina-field={nav ? tinaField(nav, "ctaText") : undefined}
          >
            {ctaText}
          </a>
        </div>
      </div>
    </nav>
  );
}

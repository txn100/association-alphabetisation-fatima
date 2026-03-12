import { useState, useEffect } from "react";
import { tinaField, useTina } from "tinacms/dist/react";

const sectionAnchors = ["#accueil", "#apropos", "#parcours", "#pedagogie", "#galerie"];

export default function NavbarVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const nav = data?.navigation;
  const links = nav?.links || [];
  const ctaText = nav?.ctaText || "Devenir Parrain";

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
      aria-label="Navigation principale"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16 md:h-20 items-center">
          {/* Logo */}
          <a href="#accueil" onClick={smoothScroll("#accueil")} className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
            <img
              src="/images/logo-fatima-hq.webp"
              alt="Logo Association d'Alphabétisation de Fatima"
              className="h-9 sm:h-12 md:h-16 w-auto flex-shrink-0"
              width={64}
              height={64}
            />
            <span className="navbar-title font-heading font-bold text-brand-blue leading-tight text-xs sm:text-sm md:text-base">
              Association d'Alphabétisation<br className="hidden lg:block" /> de Fatima
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link: any, i: number) => (
              <a
                key={i}
                href={sectionAnchors[i] || "#"}
                onClick={smoothScroll(sectionAnchors[i] || "#")}
                className="text-gray-600 hover:text-brand-blue font-semibold transition"
                data-tina-field={tinaField(link, "label")}
              >
                {link.label}
              </a>
            ))}
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
            className="md:hidden text-gray-600 hover:text-brand-blue focus:outline-none p-2 -mr-2"
            aria-expanded={menuOpen}
            aria-label="Ouvrir le menu"
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
          {links.map((link: any, i: number) => (
            <a
              key={i}
              href={sectionAnchors[i] || "#"}
              onClick={smoothScroll(sectionAnchors[i] || "#")}
              className="mobile-nav-link block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50"
              data-tina-field={tinaField(link, "label")}
            >
              {link.label}
            </a>
          ))}
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

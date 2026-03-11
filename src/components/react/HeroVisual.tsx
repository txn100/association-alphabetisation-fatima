import { tinaField, useTina } from "tinacms/dist/react";

export default function HeroVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const hero = data?.hero;

  return (
    <section
      id="accueil"
      className="relative hero-bg h-screen min-h-[500px] flex items-center justify-center pt-20 md:pt-24"
    >
      <div className="relative z-10 text-center px-4 sm:px-5 max-w-4xl mx-auto">
        <img
          src="/images/logo-fatima-2019.png"
          alt="Logo Association d'Alphabétisation de Fatima"
          className="h-14 sm:h-20 md:h-24 w-auto mx-auto mb-2 sm:mb-3 md:mb-4 drop-shadow-lg"
          width={96}
          height={96}
        />
        <p className="text-[0.65rem] sm:text-sm md:text-lg tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/90 font-semibold mb-2 sm:mb-3 md:mb-4 drop-shadow">
          Association d'Alphabétisation de Fatima
        </p>
        <h1
          className="font-heading text-[1.7rem] sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 md:mb-6 drop-shadow-md"
          data-tina-field={hero ? tinaField(hero, "tagline") : undefined}
        >
          {hero?.tagline || "Ensemble, donnons à ces enfants une chance de réussir !"}
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl text-gray-100 mb-6 md:mb-8 max-w-2xl mx-auto font-light leading-relaxed"
          data-tina-field={hero ? tinaField(hero, "subtitle") : undefined}
        >
          {hero?.subtitle || ""}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="#apropos"
            className="px-8 py-3.5 sm:py-3 bg-white text-brand-blue font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-sm sm:text-base"
            data-tina-field={hero ? tinaField(hero, "primaryButton") : undefined}
          >
            {hero?.primaryButton || "Découvrir notre mission"}
          </a>
          <a
            href="#faire-un-don"
            className="px-8 py-3.5 sm:py-3 bg-brand-pink text-white font-bold rounded-lg hover:bg-pink-600 transition duration-300 shadow-lg text-sm sm:text-base"
            data-tina-field={hero ? tinaField(hero, "secondaryButton") : undefined}
          >
            <i className="fas fa-heart mr-2" />
            {hero?.secondaryButton || "Devenir Parrain"}
          </a>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="wave-bottom">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          />
        </svg>
      </div>
    </section>
  );
}

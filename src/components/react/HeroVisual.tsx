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
      className="relative hero-bg h-screen min-h-[500px] flex items-start sm:items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-32 sm:pb-40"
    >
      <div className="relative z-10 text-center px-4 sm:px-5 max-w-4xl mx-auto mt-4 sm:mt-0">
        <img
          src="/images/logo-fatima-2019.png"
          alt="Logo Association d'Alphabétisation de Fatima"
          className="h-16 sm:h-20 md:h-24 w-auto mx-auto mb-1.5 sm:mb-3 md:mb-4 drop-shadow-lg"
          width={96}
          height={96}
        />
        <p className="text-[0.65rem] sm:text-sm md:text-lg tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/90 font-semibold mb-1.5 sm:mb-3 md:mb-4 drop-shadow">
          Association d'Alphabétisation de Fatima
        </p>
        <h1
          className="font-heading text-[1.7rem] sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2 sm:mb-4 md:mb-6 drop-shadow-md"
          data-tina-field={hero ? tinaField(hero, "tagline") : undefined}
        >
          {hero?.tagline || "Ensemble, donnons à ces enfants une chance de réussir !"}
        </h1>
        <p
          className="text-sm sm:text-lg md:text-xl text-gray-100 mb-3 sm:mb-6 md:mb-8 max-w-2xl mx-auto font-light leading-relaxed"
          data-tina-field={hero ? tinaField(hero, "subtitle") : undefined}
        >
          {hero?.subtitle || ""}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
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

      {/* Ocean Wave Divider — Mauritius-inspired */}
      <div className="ocean-waves">
        {/* Deep ocean wave (back) */}
        <svg className="wave-deep" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path d="M0,80 C180,20 360,140 540,90 C720,40 900,160 1080,100 C1200,60 1320,120 1440,80 L1440,180 L0,180 Z" fill="#0e86b3" />
        </svg>
        {/* Turquoise lagoon wave (middle) */}
        <svg className="wave-mid" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path d="M0,100 C160,60 320,140 480,110 C640,80 800,150 960,120 C1120,90 1280,130 1440,100 L1440,180 L0,180 Z" fill="#3bb4d9" />
        </svg>
        {/* Shore/foam wave (front) — blends into stats section */}
        <svg className="wave-shore" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 180" preserveAspectRatio="none">
          <path d="M0,120 C200,90 400,150 600,130 C800,110 1000,145 1200,125 C1320,115 1380,135 1440,120 L1440,180 L0,180 Z" fill="#f3f4f6" />
        </svg>
      </div>
    </section>
  );
}

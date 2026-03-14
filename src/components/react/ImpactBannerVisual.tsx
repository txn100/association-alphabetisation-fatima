import { tinaField, useTina } from "tinacms/dist/react";

export default function ImpactBannerVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const impact = data?.impact;
  const images = impact?.images || [];

  return (
    <section className="relative h-64 md:h-80 overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3">
        {images.map((img: any, i: number) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            data-tina-field={tinaField(img, "src")}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/85 via-brand-dark/70 to-brand-pink/85 flex items-center justify-center">
        <div className="text-center px-4">
          <p
            className="text-white/80 text-sm uppercase tracking-widest font-bold mb-3"
            data-tina-field={impact ? tinaField(impact, "sinceLabel") : undefined}
          >
            {impact?.sinceLabel || "Depuis 1989"}
          </p>
          <h2
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4"
            data-tina-field={impact ? tinaField(impact, "headline") : undefined}
          >
            {impact?.headline || "Plus de 2 000 vies transformées"}
          </h2>
          <p
            className="text-white/90 max-w-xl mx-auto text-sm md:text-base"
            data-tina-field={impact ? tinaField(impact, "description") : undefined}
          >
            {impact?.description || ""}
          </p>
        </div>
      </div>
    </section>
  );
}

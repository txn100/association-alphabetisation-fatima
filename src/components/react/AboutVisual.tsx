import { tinaField, useTina } from "tinacms/dist/react";

export default function AboutVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const about = data?.about;
  const photos = about?.photos || [];

  return (
    <section id="apropos" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-yellow rounded-full opacity-20 blur-xl hidden md:block" />
            <img
              src={about?.mainImage || "/images/school-uodv3.webp"}
              alt={about?.mainImageAlt || "Le bâtiment de l'école"}
              className="relative rounded-2xl shadow-xl z-10 w-full object-cover h-56 sm:h-72 md:h-96"
              loading="lazy"
              decoding="async"
              width={880}
              height={680}
              data-tina-field={about ? tinaField(about, "mainImage") : undefined}
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-brand-blue rounded-full opacity-10 blur-xl z-0 hidden md:block" />
          </div>

          {/* Content */}
          <div>
            <h2
              className="font-heading text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-6 relative inline-block"
              data-tina-field={about ? tinaField(about, "heading") : undefined}
            >
              {about?.heading || "Notre Histoire"}
              <span className="block h-1 w-20 bg-brand-pink mt-2 rounded-full" />
            </h2>
            <p
              className="text-gray-600 mb-4 leading-relaxed"
              data-tina-field={about ? tinaField(about, "paragraph1") : undefined}
            >
              {about?.paragraph1 || ""}
            </p>
            <p
              className="text-gray-600 mb-4 leading-relaxed"
              data-tina-field={about ? tinaField(about, "paragraph2") : undefined}
            >
              {about?.paragraph2 || ""}
            </p>
            <p
              className="text-gray-600 mb-6 leading-relaxed"
              data-tina-field={about ? tinaField(about, "paragraph3") : undefined}
            >
              {about?.paragraph3 || ""}
            </p>

            <div className="bg-brand-light-pink/40 border-l-4 border-brand-pink p-4 rounded-r-lg mb-6">
              <p
                className="italic text-brand-pink text-sm"
                data-tina-field={about ? tinaField(about, "quote") : undefined}
              >
                "{about?.quote || ""}"
              </p>
            </div>

            {/* Mini photo strip */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo: any, i: number) => (
                  <img
                    key={i}
                    src={photo.src}
                    alt={photo.alt}
                    className="rounded-lg object-cover h-24 w-full"
                    loading="lazy"
                    decoding="async"
                    data-tina-field={tinaField(photo, "src")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

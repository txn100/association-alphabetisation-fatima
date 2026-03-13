import { tinaField, useTina } from "tinacms/dist/react";

export default function GalleryVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const { data: sectionData } = useTina({
    query: props.sectionQuery || "",
    variables: props.sectionVariables || {},
    data: props.sectionData || {},
  });

  const edges = data.galleryConnection?.edges || [];
  const allPhotos = edges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => a.order - b.order);

  // In TinaCMS admin (iframe), show placeholders; on production, hide them
  const isAdmin = typeof window !== "undefined" && window.self !== window.top;
  const photos = isAdmin ? allPhotos : allPhotos.filter((p: any) => p.src);

  const section = sectionData?.gallerySection;

  return (
    <section id="galerie" className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            <span data-tina-field={section ? tinaField(section, "heading") : undefined}>
              {section?.heading || "Notre Association en"}
            </span>{" "}
            <span
              className="text-brand-pink"
              data-tina-field={section ? tinaField(section, "headingHighlight") : undefined}
            >
              {section?.headingHighlight || "Images"}
            </span>
          </h2>
          <p
            className="text-gray-600 max-w-xl mx-auto"
            data-tina-field={section ? tinaField(section, "description") : undefined}
          >
            {section?.description ||
              "Decouvrez le quotidien de nos eleves et les moments forts de la vie associative."}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-row-dense gap-2 md:gap-3 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[180px]">
          {photos.map((photo: any) => (
            <div
              key={photo._sys?.filename}
              className={`overflow-hidden rounded-xl group ${photo.span || ""}`}
              data-tina-field={tinaField(photo, "src")}
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-300 bg-gray-100 flex flex-col items-center justify-center text-gray-400 rounded-xl">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs">Ajouter une photo</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

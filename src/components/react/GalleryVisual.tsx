import { tinaField, useTina } from "tinacms/dist/react";

export default function GalleryVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const edges = data.galleryConnection?.edges || [];
  const photos = edges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <section id="galerie" className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Notre Association en <span className="text-brand-pink">Images</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Decouvrez le quotidien de nos eleves et les moments forts de la vie associative.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[180px]">
          {photos.map((photo: any) => (
            <div
              key={photo._sys?.filename}
              className={`overflow-hidden rounded-xl group ${photo.span || ""}`}
              data-tina-field={tinaField(photo, "src")}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

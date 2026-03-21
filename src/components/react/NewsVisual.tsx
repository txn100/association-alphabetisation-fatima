import { tinaField, useTina } from "tinacms/dist/react";
import type { UIStrings } from "../../lib/i18n";

/** Map TinaCMS category enum values to uiStrings keys. */
const categoryKeys: Record<string, keyof UIStrings> = {
  Formation: "catFormation",
  Culture: "catCulture",
  "Vie Scolaire": "catVieScolaire",
  Environnement: "catEnvironnement",
};

function translateCategory(category: string, ui?: UIStrings): string {
  const key = categoryKeys[category];
  if (key && ui) return ui[key] as string;
  return category; // fallback to raw value for unknown categories
}

export default function NewsVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const { data: pedData } = useTina({
    query: props.sectionQuery || "",
    variables: props.sectionVariables || {},
    data: props.sectionData || {},
  });

  const ui: UIStrings | undefined = props.ui;
  const edges = data.newsConnection?.edges || [];
  const news = edges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 4);

  const ped = pedData?.pedagogy;
  const features = ped?.features || [];
  const photos = ped?.photos || [];

  return (
    <section id="pedagogie" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
          {/* Pedagogy */}
          <div className="flex flex-col">
            <h2
              className="font-heading text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-6"
              data-tina-field={ped ? tinaField(ped, "heading") : undefined}
            >
              {ped?.heading || "Une Pedagogie Differente"}
            </h2>
            <p
              className="text-gray-600 mb-8"
              data-tina-field={ped ? tinaField(ped, "description") : undefined}
            >
              {ped?.description ||
                "Notre ecole ne classe pas les eleves par age, mais par niveau de competence."}
            </p>

            <ul className="space-y-4">
              {features.map((feature: any, i: number) => (
                <li key={i} className="flex items-start">
                  <i className="fas fa-check-circle text-brand-pink mt-1 mr-3" />
                  <div>
                    <strong
                      className="block text-gray-800"
                      data-tina-field={tinaField(feature, "title")}
                    >
                      {feature.title}
                    </strong>
                    <span
                      className="text-sm text-gray-600"
                      data-tina-field={tinaField(feature, "description")}
                    >
                      {feature.description}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {photos.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-3 flex-1 min-h-32">
                {photos.map((photo: any, i: number) => (
                  <img
                    key={i}
                    src={photo.src}
                    alt={photo.alt}
                    className="rounded-lg object-cover w-full h-full"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={128}
                    data-tina-field={tinaField(photo, "src")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* News Feed */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3
              className="font-heading text-xl font-bold text-brand-pink mb-6 flex items-center"
              data-tina-field={ped ? tinaField(ped, "newsHeading") : undefined}
            >
              <i className="far fa-newspaper mr-2" /> {ped?.newsHeading || "Actualites Recentes"}
            </h3>

            <div className="space-y-6">
              {news.map((item: any, i: number) => (
                <div key={item._sys?.filename} className="flex gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <span
                      className="block text-xs font-bold text-gray-500 uppercase"
                      data-tina-field={tinaField(item, "month")}
                    >
                      {item.month}
                    </span>
                    <span
                      className="block text-xl font-bold text-brand-blue"
                      data-tina-field={tinaField(item, "day")}
                    >
                      {item.day}
                    </span>
                    {i < news.length - 1 && (
                      <div className="h-full w-px bg-gray-300 mt-2" />
                    )}
                  </div>
                  <div className="w-full">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        loading="lazy"
                        decoding="async"
                        width={400}
                        height={128}
                        data-tina-field={tinaField(item, "image")}
                      />
                    )}
                    <h4
                      className="font-bold text-gray-800 text-sm"
                      data-tina-field={tinaField(item, "title")}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      <span data-tina-field={tinaField(item, "year")}>{item.year}</span>
                      {" "}&bull;{" "}
                      <span data-tina-field={tinaField(item, "category")}>
                        {translateCategory(item.category, ui)}
                      </span>
                    </p>
                    <p
                      className="text-sm text-gray-600"
                      data-tina-field={tinaField(item, "description")}
                    >
                      {item.description}
                    </p>
                    {item.slug && (
                      <a
                        href={`${props.lang === "en" ? "/en/news" : "/actualites"}/${item.slug}/`}
                        className="inline-flex items-center mt-2 text-xs font-bold text-brand-blue hover:text-blue-700 transition"
                      >
                        {ui?.readMore || "Lire la suite"} <i className="fas fa-arrow-right ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { tinaField, useTina } from "tinacms/dist/react";

const features = [
  {
    title: "Approche Holistique",
    description: "Developpement intellectuel, emotionnel et social.",
  },
  {
    title: "Activites Valorisantes",
    description: "Natation, Football, Danse, Chant et Arts creatifs.",
  },
  {
    title: "Competences de Vie",
    description: "Preparation au CPE (PSAC) ou a la vie professionnelle selon le profil.",
  },
];

export default function NewsVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const edges = data.newsConnection?.edges || [];
  const news = edges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 4);

  return (
    <section id="pedagogie" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
          {/* Pedagogy */}
          <div className="flex flex-col">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
              Une Pedagogie Differente
            </h2>
            <p className="text-gray-600 mb-8">
              Notre ecole ne classe pas les eleves par age, mais par{" "}
              <strong>niveau de competence</strong>. Repartis en 5 niveaux, chaque
              enfant progresse a son propre rythme vers la maitrise de la lecture, de
              l'ecriture et du calcul.
            </p>

            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start">
                  <i className="fas fa-check-circle text-brand-pink mt-1 mr-3" />
                  <div>
                    <strong className="block text-gray-800">{feature.title}</strong>
                    <span className="text-sm text-gray-600">{feature.description}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Photo grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 flex-1 min-h-32">
              <img
                src="/images/school-uodv2.webp"
                alt="Batiment de l'ecole de Fatima"
                className="rounded-lg object-cover w-full h-full"
                loading="lazy"
                decoding="async"
                width={400}
                height={128}
              />
              <img
                src="/images/food-donation.webp"
                alt="Distribution alimentaire a l'ecole"
                className="rounded-lg object-cover w-full h-full"
                loading="lazy"
                decoding="async"
                width={400}
                height={128}
              />
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-heading text-xl font-bold text-brand-pink mb-6 flex items-center">
              <i className="far fa-newspaper mr-2" /> Actualites Recentes
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
                      <span data-tina-field={tinaField(item, "category")}>{item.category}</span>
                    </p>
                    <p
                      className="text-sm text-gray-600"
                      data-tina-field={tinaField(item, "description")}
                    >
                      {item.description}
                    </p>
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

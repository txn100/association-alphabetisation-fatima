import { tinaField, useTina } from "tinacms/dist/react";

export default function ProgramsVisual(props: any) {
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

  const edges = data.programsConnection?.edges || [];
  const steps = edges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => a.order - b.order);

  const section = sectionData?.programsSection;

  return (
    <section id="parcours" className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="font-heading text-2xl sm:text-3xl font-bold text-gray-800 mb-4"
            data-tina-field={section ? tinaField(section, "heading") : undefined}
          >
            {section?.heading || "Le Parcours de Nos Eleves"}
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto"
            data-tina-field={section ? tinaField(section, "description") : undefined}
          >
            {section?.description ||
              "Un chemin progressif adapte au rythme de chaque enfant, de l'alphabetisation a l'insertion professionnelle."}
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

          <div className="grid md:grid-cols-3 gap-5 md:gap-8 relative z-10">
            {steps.map((step: any, i: number) => (
              <div
                key={step._sys?.filename}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group relative"
              >
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-brand-blue group-hover:text-white transition z-20">
                  {i + 1}
                </div>

                <div className="h-40 overflow-hidden" data-tina-field={tinaField(step, "image")}>
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={160}
                  />
                </div>

                <div className={`h-1 ${step.color === "pink" ? "bg-brand-pink" : "bg-brand-blue"}`} />

                <div className="p-6">
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded mb-3 ${
                      step.color === "pink"
                        ? "bg-brand-light-pink text-brand-pink"
                        : "bg-blue-50 text-brand-blue"
                    }`}
                    data-tina-field={tinaField(step, "level")}
                  >
                    {step.level}
                  </span>

                  <h3
                    className="font-heading text-xl font-bold text-gray-800 mb-1"
                    data-tina-field={tinaField(step, "title")}
                  >
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-500 font-semibold mb-3" data-tina-field={tinaField(step, "ages")}>
                    <i className="fas fa-child mr-1" />
                    {step.ages}
                  </p>

                  <p
                    className="text-gray-600 text-sm leading-relaxed"
                    data-tina-field={tinaField(step, "description")}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 md:hidden">
          <span
            className="text-gray-500 text-sm font-semibold"
            data-tina-field={section ? tinaField(section, "mobileIndicator") : undefined}
          >
            <i className="fas fa-arrow-down mr-1" /> {section?.mobileIndicator || "Progression"}
          </span>
        </div>
      </div>
    </section>
  );
}

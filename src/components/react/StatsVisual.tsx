import { tinaField, useTina } from "tinacms/dist/react";

export default function StatsVisual(props: any) {
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

  const edges = data.statsConnection?.edges || [];
  const stats = edges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => a.order - b.order);

  const section = sectionData?.statsSection;
  const badges = section?.badges || [];

  return (
    <section className="py-8 md:py-12 bg-brand-light -mt-2 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center md:divide-x md:divide-gray-200">
          {stats.map((stat: any) => (
            <div key={stat._sys?.filename} className="p-3 md:p-4">
              <div
                className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-blue mb-1"
                data-tina-field={tinaField(stat, "value")}
              >
                {stat.value}
              </div>
              <div
                className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide"
                data-tina-field={tinaField(stat, "label")}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {badges.length > 0 && (
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-4 text-center">
            {badges.map((badge: any, i: number) => (
              <span
                key={i}
                className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-600 shadow-sm"
                data-tina-field={tinaField(badge, "label")}
              >
                <i className="fas fa-check-circle text-green-500 mr-2" />
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

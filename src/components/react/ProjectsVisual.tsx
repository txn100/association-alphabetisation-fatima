import { tinaField, useTina } from "tinacms/dist/react";

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: "Terminé", bg: "bg-emerald-100", text: "text-emerald-700" },
  "in-progress": { label: "En cours", bg: "bg-amber-100", text: "text-amber-700" },
  planned: { label: "Planifié", bg: "bg-blue-100", text: "text-blue-700" },
};

const categoryIcons: Record<string, string> = {
  "Éco-responsable": "fas fa-seedling",
  Infrastructure: "fas fa-tools",
  Communautaire: "fas fa-hands-helping",
};

export default function ProjectsVisual(props: any) {
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

  const edges = data.projectsConnection?.edges || [];
  const projects = edges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => a.order - b.order);

  const section = sectionData?.projectsSection;

  return (
    <section id="projets" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <i className="fas fa-seedling" /> Initiatives
          </div>
          <h2
            className="font-heading text-2xl sm:text-3xl font-bold text-gray-800 mb-4"
            data-tina-field={section ? tinaField(section, "heading") : undefined}
          >
            {section?.heading || "Nos Projets en"}{" "}
            <span
              className="text-emerald-600"
              data-tina-field={section ? tinaField(section, "headingHighlight") : undefined}
            >
              {section?.headingHighlight || "Action"}
            </span>
          </h2>
          <p
            className="text-gray-600 max-w-2xl mx-auto"
            data-tina-field={section ? tinaField(section, "description") : undefined}
          >
            {section?.description ||
              "Des initiatives concrètes pour améliorer le quotidien de nos élèves et préserver notre environnement."}
          </p>
        </div>

        {/* Projects Grid — 2 columns on desktop, 1 on mobile */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project: any) => {
            const status = statusConfig[project.status] || statusConfig.completed;
            const catIcon = categoryIcons[project.category] || "fas fa-project-diagram";

            return (
              <div
                key={project._sys?.filename}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition duration-300 group"
              >
                {/* Image */}
                <div className="relative h-52 sm:h-56 overflow-hidden" data-tina-field={tinaField(project, "image")}>
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={224}
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 ${status.bg} ${status.text} text-xs font-bold px-3 py-1 rounded-full shadow-sm`}
                    data-tina-field={tinaField(project, "status")}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  {/* Category Tag */}
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-3"
                    data-tina-field={tinaField(project, "category")}
                  >
                    <i className={catIcon} />
                    {project.category}
                  </span>

                  <h3
                    className="font-heading text-lg sm:text-xl font-bold text-gray-800 mb-2"
                    data-tina-field={tinaField(project, "title")}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-gray-600 text-sm leading-relaxed mb-4"
                    data-tina-field={tinaField(project, "description")}
                  >
                    {project.description}
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {project.completionDate && (
                      <span className="flex items-center gap-1" data-tina-field={tinaField(project, "completionDate")}>
                        <i className="far fa-calendar-check text-emerald-500" />
                        {project.completionDate}
                      </span>
                    )}
                    {project.beneficiaries && (
                      <span className="flex items-center gap-1" data-tina-field={tinaField(project, "beneficiaries")}>
                        <i className="fas fa-users text-emerald-500" />
                        {project.beneficiaries}
                      </span>
                    )}
                    {project.impact && (
                      <span className="flex items-center gap-1" data-tina-field={tinaField(project, "impact")}>
                        <i className="fas fa-chart-line text-emerald-500" />
                        {project.impact}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

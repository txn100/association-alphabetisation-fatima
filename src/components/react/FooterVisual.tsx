import { tinaField, useTina } from "tinacms/dist/react";

export default function FooterVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const footer = data?.footer;
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-brand-dark text-gray-300 pt-10 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white rounded-lg p-1 flex-shrink-0">
                <img
                  src="/images/logo-fatima-hq.webp"
                  alt="Logo Association d'Alphabétisation de Fatima"
                  className="h-10 w-auto"
                  width={40}
                  height={40}
                />
              </div>
              <h3 className="text-white font-bold text-lg">
                Association d'Alphabétisation de Fatima
              </h3>
            </div>
            <p
              className="text-sm leading-relaxed mb-6 opacity-80"
              data-tina-field={footer ? tinaField(footer, "orgDescription") : undefined}
            >
              {footer?.orgDescription || ""}
            </p>
            <div className="space-y-2">
              <p
                className="text-sm font-semibold text-brand-pink"
                data-tina-field={footer ? tinaField(footer, "president") : undefined}
              >
                Présidente : {footer?.president || ""}
              </p>
              <p
                className="text-sm font-semibold text-brand-light-blue"
                data-tina-field={footer ? tinaField(footer, "director") : undefined}
              >
                Directrice : {footer?.director || ""}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-white font-bold text-lg mb-6"
              data-tina-field={footer ? tinaField(footer, "contactHeading") : undefined}
            >
              {footer?.contactHeading || "Nous Contacter"}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-brand-blue" />
                <span
                  data-tina-field={footer ? tinaField(footer, "address") : undefined}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {footer?.address || ""}
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-brand-blue" />
                <a
                  href={`tel:${footer?.phone1Link || ""}`}
                  className="hover:text-white transition"
                  data-tina-field={footer ? tinaField(footer, "phone1") : undefined}
                >
                  {footer?.phone1 || ""}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3 text-brand-blue" />
                <a
                  href={`tel:${footer?.phone2Link || ""}`}
                  className="hover:text-white transition"
                  data-tina-field={footer ? tinaField(footer, "phone2") : undefined}
                >
                  {footer?.phone2 || ""}
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-brand-blue" />
                <a
                  href={`mailto:${footer?.email || ""}`}
                  className="hover:text-white transition"
                  data-tina-field={footer ? tinaField(footer, "email") : undefined}
                >
                  {footer?.email || ""}
                </a>
              </li>
            </ul>
          </div>

          {/* Accreditation */}
          <div>
            <h4
              className="text-white font-bold text-lg mb-6"
              data-tina-field={footer ? tinaField(footer, "transparencyHeading") : undefined}
            >
              {footer?.transparencyHeading || "Transparence"}
            </h4>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                Accréditations Officielles
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Reg. ONG:</span>
                  <span
                    className="text-white font-mono"
                    data-tina-field={footer ? tinaField(footer, "ngoRegistered") : undefined}
                  >
                    {footer?.ngoRegistered || "Oui"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>NSIF Code:</span>
                  <span
                    className="text-white font-mono"
                    data-tina-field={footer ? tinaField(footer, "nsifCode") : undefined}
                  >
                    {footer?.nsifCode || ""}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>CSR Code:</span>
                  <span
                    className="text-white font-mono"
                    data-tina-field={footer ? tinaField(footer, "csrCode") : undefined}
                  >
                    {footer?.csrCode || ""}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p data-tina-field={footer ? tinaField(footer, "copyright") : undefined}>
            &copy; {year} {footer?.copyright || "Association d'Alphabétisation de Fatima. Tous droits réservés."}
          </p>
        </div>
      </div>
    </footer>
  );
}

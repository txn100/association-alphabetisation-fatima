import { useState, useRef } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import type { UIStrings } from "../../lib/i18n";

export default function DonateVisual(props: any) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const { data: tiersData } = useTina({
    query: props.tiersQuery || "",
    variables: props.tiersVariables || {},
    data: props.tiersData || {},
  });
  const { data: footerData } = useTina({
    query: props.footerQuery || "",
    variables: props.footerVariables || {},
    data: props.footerData || {},
  });

  const ui: UIStrings | undefined = props.ui;
  const donate = data?.donate;
  const header = donate?.emotionalHeader;
  const socialProof = donate?.socialProof || [];
  const tabs = donate?.tabs;
  const don = donate?.donPonctuel;
  const parrain = donate?.parrainSection;
  const donAction = donate?.donEnAction;
  const csr = donate?.csr;

  // Contact info from footer (centralized source of truth)
  const footer = footerData?.footer;
  const whatsappNumber = footer?.whatsappNumber || "23052611030";
  const contactEmail = footer?.email || "direction@ecolefatima.com";
  const phone1 = footer?.phone1 || "261 30 32";
  const phone1Link = footer?.phone1Link || "+23026130032";

  const tiersEdges = tiersData?.tiersConnection?.edges || [];
  const tiers = tiersEdges
    .filter((e: any) => e?.node)
    .map((e: any) => e.node)
    .sort((a: any, b: any) => a.order - b.order);

  const [activeTab, setActiveTab] = useState<"don" | "parrain">("don");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleTierClick = (amount: number) => {
    setSelectedTier(amount);
    document.getElementById("parrain-form-wrapper")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const sendVia = (method: "email" | "whatsapp") => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    const nom = fd.get("nom") as string;
    const email = fd.get("email") as string;
    const tel = fd.get("telephone") || (ui?.formPhoneNotProvided || "Non renseigné");
    const formuleEl = formRef.current.querySelector("select") as HTMLSelectElement;
    const formule = formuleEl?.selectedOptions[0]?.text || "";
    const msg = fd.get("message") || (ui?.formMessageEmpty || "(aucun)");

    if (!nom || !email) {
      formRef.current.reportValidity();
      return;
    }

    const greeting = ui?.formGreeting || "Bonjour,";
    const intro = ui?.formIntro || "Je souhaite devenir parrain.";
    const nameL = ui?.formNameLabel || "Nom";
    const emailL = ui?.formEmailLabel || "Email";
    const phoneL = ui?.formPhoneLabel || "Téléphone";
    const formulaL = ui?.formFormulaLabel || "Formule";
    const msgL = ui?.formMessageLabel || "Message";
    const closing = ui?.formClosing || "Cordialement";
    const subjectPrefix = ui?.formSubjectPrefix || "Demande de Parrainage";

    if (method === "whatsapp") {
      const text = encodeURIComponent(
        `${greeting}\n\n${intro}\n\n${nameL} : ${nom}\n${emailL} : ${email}\n${phoneL} : ${tel}\n${formulaL} : ${formule}\n\n${msgL} : ${msg}`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
    } else {
      const subject = encodeURIComponent(`${subjectPrefix} — ${nom}`);
      const body = encodeURIComponent(
        `${greeting}\n\n${intro}\n\n${nameL} : ${nom}\n${emailL} : ${email}\n${phoneL} : ${tel}\n${formulaL} : ${formule}\n\n${msgL} :\n${msg}\n\n${closing}`
      );
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <>
      {/* Emotional lead-in */}
      <section className="relative py-10 md:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/school-uodv4.webp" alt="Élèves en classe" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-brand-blue/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-brand-yellow font-bold text-sm uppercase tracking-widest mb-3"
            data-tina-field={header ? tinaField(header, "badge") : undefined}
          >
            {header?.badge || "Votre impact"}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
            <span data-tina-field={header ? tinaField(header, "heading") : undefined}>
              {header?.heading || "Un geste simple, un avenir"}
            </span>{" "}
            <span
              className="text-brand-yellow"
              data-tina-field={header ? tinaField(header, "headingHighlight") : undefined}
            >
              {header?.headingHighlight || "transformé"}
            </span>
          </h2>
          <p
            className="text-white/85 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
            data-tina-field={header ? tinaField(header, "description") : undefined}
          >
            {header?.description || ""}
          </p>
        </div>
      </section>

      {/* Main donation area */}
      <section id="faire-un-don" className="py-12 md:py-20 bg-brand-light relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Social proof bar */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 mb-8 md:mb-12 text-center">
            {socialProof.map((item: any, i: number) => (
              <div key={i}>
                <span
                  className={`block text-2xl font-extrabold font-heading ${i % 2 === 0 ? "text-brand-blue" : "text-brand-pink"}`}
                  data-tina-field={tinaField(item, "value")}
                >
                  {item.value}
                </span>
                <span
                  className="text-xs text-gray-500 font-semibold uppercase tracking-wide"
                  data-tina-field={tinaField(item, "label")}
                >
                  {item.label}
                </span>
                {i < socialProof.length - 1 && (
                  <div className="hidden sm:block w-px bg-gray-300" />
                )}
              </div>
            ))}
          </div>

          {/* Tab Toggle */}
          <div className="flex rounded-xl bg-white shadow-md p-1.5 mb-8 border border-gray-100 max-w-md mx-auto" role="tablist" aria-label="Type de contribution">
            <button
              type="button"
              role="tab"
              id="tab-don"
              aria-selected={activeTab === "don"}
              aria-controls="tabpanel-don"
              data-tab-btn="don"
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
                activeTab === "don" ? "bg-brand-blue text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("don")}
              data-tina-field={tabs ? tinaField(tabs, "donLabel") : undefined}
            >
              <i className="fas fa-gift mr-1.5" />{tabs?.donLabel || "Don Ponctuel"}
            </button>
            <button
              type="button"
              role="tab"
              id="tab-parrain"
              aria-selected={activeTab === "parrain"}
              aria-controls="tabpanel-parrain"
              data-tab-btn="parrain"
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
                activeTab === "parrain" ? "bg-brand-pink text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("parrain")}
              data-tina-field={tabs ? tinaField(tabs, "parrainLabel") : undefined}
            >
              <i className="fas fa-hand-holding-heart mr-1.5" />{tabs?.parrainLabel || "Devenir Parrain"}
            </button>
          </div>

          {/* DON PONCTUEL TAB — always in DOM, toggled via CSS */}
          <div data-tab-content="don" role="tabpanel" id="tabpanel-don" aria-labelledby="tab-don" className={activeTab !== "don" ? "hidden" : ""}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-blue to-brand-light-blue p-5 sm:p-6 text-center">
                <h3
                  className="font-heading font-bold text-white text-lg sm:text-xl"
                  data-tina-field={don ? tinaField(don, "heading") : undefined}
                >
                  {don?.heading || "Faire un don maintenant"}
                </h3>
                <p
                  className="text-white/80 text-sm mt-1"
                  data-tina-field={don ? tinaField(don, "subtitle") : undefined}
                >
                  {don?.subtitle || "Par virement bancaire ou mobile"}
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-4">
                  {(don?.steps || []).map((step: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        i < (don?.steps?.length || 0) - 1 ? "bg-brand-blue/10" : "bg-green-100"
                      }`}>
                        {i < (don?.steps?.length || 0) - 1 ? (
                          <span className="text-brand-blue font-bold text-sm">{i + 1}</span>
                        ) : (
                          <i className="fas fa-check text-green-600 text-xs" />
                        )}
                      </div>
                      <div>
                        <p
                          className="font-bold text-gray-800 text-sm"
                          data-tina-field={tinaField(step, "title")}
                        >
                          {step.title}
                        </p>
                        {i === 1 && (
                          <div className="mt-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide block mb-0.5">{ui?.bankLabel || "Banque"}</span>
                                <span
                                  className="font-bold text-gray-800"
                                  data-tina-field={don ? tinaField(don, "bankName") : undefined}
                                >
                                  {don?.bankName || "MCB"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide block mb-0.5">{ui?.accountLabel || "N° de compte"}</span>
                                <span
                                  className="font-mono font-bold text-brand-blue text-base"
                                  data-tina-field={don ? tinaField(don, "accountNumber") : undefined}
                                >
                                  {don?.accountNumber || ""}
                                </span>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-gray-500 text-xs uppercase tracking-wide block mb-0.5">{ui?.holderLabel || "Titulaire"}</span>
                                <span
                                  className="font-bold text-gray-800"
                                  data-tina-field={don ? tinaField(don, "accountHolder") : undefined}
                                >
                                  {don?.accountHolder || ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        {i === 2 && (
                          <p
                            className="mt-1 font-mono bg-brand-blue/5 text-brand-blue font-bold px-3 py-1.5 rounded-lg inline-block text-sm"
                            data-tina-field={don ? tinaField(don, "referenceFormat") : undefined}
                          >
                            {don?.referenceFormat || "DON + votre nom"}
                          </p>
                        )}
                        {step.detail && i !== 1 && i !== 2 && (
                          <p className="text-gray-500 text-sm" data-tina-field={tinaField(step, "detail")}>{step.detail}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-5 text-center space-y-2">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                    <i className="fas fa-shield-alt text-green-500" />
                    <span data-tina-field={don ? tinaField(don, "trustSignal") : undefined}>
                      {don?.trustSignal || "100% de votre don est dédié aux élèves"}
                    </span>
                  </p>
                  <p
                    className="text-xs text-gray-500"
                    data-tina-field={don ? tinaField(don, "receiptNote") : undefined}
                  >
                    {don?.receiptNote || "Pour un reçu fiscal, contactez-nous au"}{" "}
                    <a href={`tel:${phone1Link}`} className="text-brand-blue underline hover:text-brand-dark">{phone1}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DEVENIR PARRAIN TAB — always in DOM, toggled via CSS */}
          <div data-tab-content="parrain" role="tabpanel" id="tabpanel-parrain" aria-labelledby="tab-parrain" className={activeTab !== "parrain" ? "hidden" : ""}>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-pink to-brand-blue p-5 sm:p-6 text-center">
                <h3
                  className="font-heading font-bold text-white text-lg sm:text-xl"
                  data-tina-field={parrain ? tinaField(parrain, "heading") : undefined}
                >
                  {parrain?.heading || "Devenez Parrain"}
                </h3>
                <p
                  className="text-white/80 text-sm mt-1"
                  data-tina-field={parrain ? tinaField(parrain, "subtitle") : undefined}
                >
                  {parrain?.subtitle || "Un engagement mensuel qui change une vie"}
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <p
                  className="text-sm text-gray-500 mb-4"
                  data-tina-field={parrain ? tinaField(parrain, "chooseLabel") : undefined}
                >
                  {parrain?.chooseLabel || "Choisissez votre formule de parrainage :"}
                </p>

                <div className="space-y-3 mb-8">
                  {tiers.map((tier: any) => (
                    <button
                      key={tier._sys?.filename}
                      type="button"
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group ${
                        tier.highlighted
                          ? "border-brand-pink bg-brand-light-pink/30 relative ring-1 ring-brand-pink/20"
                          : selectedTier === tier.amount
                          ? "border-brand-pink ring-2 ring-brand-pink"
                          : "border-gray-200 hover:border-brand-blue hover:shadow-sm"
                      }`}
                      onClick={() => handleTierClick(tier.amount)}
                      data-tina-field={tinaField(tier, "label")}
                    >
                      {tier.highlighted && (
                        <span
                          className="absolute -top-2.5 right-4 bg-brand-pink text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-sm"
                          data-tina-field={parrain ? tinaField(parrain, "highlightedBadge") : undefined}
                        >
                          {parrain?.highlightedBadge || "Le plus choisi"}
                        </span>
                      )}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        tier.highlighted ? "bg-brand-pink/10" : "bg-brand-blue/10"
                      }`}>
                        <i className={`${tier.icon} ${tier.highlighted ? "text-brand-pink" : "text-brand-blue"}`} />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-gray-800">
                          {tier.label}<span className="font-normal text-gray-500 text-sm"> {tier.period}</span>
                        </span>
                        <span className="block text-sm text-gray-500 mt-0.5" data-tina-field={tinaField(tier, "description")}>
                          {tier.description}
                        </span>
                      </div>
                      <i className={`fas fa-chevron-right text-sm transition-transform group-hover:translate-x-0.5 ${
                        tier.highlighted ? "text-brand-pink/40" : "text-gray-300"
                      }`} />
                    </button>
                  ))}
                </div>

                <div id="parrain-form-wrapper" className="border-t border-gray-100 pt-6">
                  <h4
                    className="font-bold text-gray-800 text-sm mb-4 flex items-center"
                    data-tina-field={parrain ? tinaField(parrain, "formHeading") : undefined}
                  >
                    <i className="fas fa-paper-plane text-brand-pink mr-2" />
                    {parrain?.formHeading || "Vos coordonnées"}
                  </h4>

                  <form ref={formRef} id="parrain-form" className="space-y-3" onSubmit={(e) => { e.preventDefault(); sendVia("email"); }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="parrain-nom" className="sr-only">Nom complet</label>
                        <input
                          id="parrain-nom"
                          type="text"
                          name="nom"
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition text-sm"
                          placeholder={parrain?.namePlaceholder || "Nom complet *"}
                        />
                      </div>
                      <div>
                        <label htmlFor="parrain-tel" className="sr-only">Téléphone</label>
                        <input
                          id="parrain-tel"
                          type="tel"
                          name="telephone"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition text-sm"
                          placeholder={parrain?.phonePlaceholder || "Téléphone"}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="parrain-email" className="sr-only">Email</label>
                      <input
                        id="parrain-email"
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition text-sm"
                        placeholder={parrain?.emailPlaceholder || "Email *"}
                      />
                    </div>

                    <div>
                      <label htmlFor="parrain-formule" className="sr-only">Formule de parrainage</label>
                      <select
                        id="parrain-formule"
                        name="formule"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition text-sm bg-white"
                        value={selectedTier ?? tiers.find((t: any) => t.highlighted)?.amount ?? ""}
                        onChange={(e) => setSelectedTier(Number(e.target.value) || null)}
                      >
                        {tiers.map((tier: any) => (
                          <option key={tier._sys?.filename} value={tier.amount}>
                            {tier.label}{tier.period} — {tier.description}
                          </option>
                        ))}
                        <option value="libre">{parrain?.freeAmountOption || "Montant libre"}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="parrain-message" className="sr-only">Message</label>
                      <textarea
                        id="parrain-message"
                        name="message"
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition text-sm resize-none"
                        placeholder={parrain?.messagePlaceholder || "Message (optionnel)"}
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        data-send="whatsapp"
                        onClick={() => sendVia("whatsapp")}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#1fb855] transition shadow-md text-sm"
                        data-tina-field={parrain ? tinaField(parrain, "whatsappButton") : undefined}
                      >
                        <i className="fab fa-whatsapp text-lg" />
                        {parrain?.whatsappButton || "Envoyer via WhatsApp"}
                      </button>
                      <button
                        type="submit"
                        data-send="email"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white text-gray-600 font-semibold rounded-xl border border-gray-200 hover:border-brand-pink hover:text-brand-pink transition text-sm"
                        data-tina-field={parrain ? tinaField(parrain, "emailButton") : undefined}
                      >
                        <i className="fas fa-envelope" />
                        {parrain?.emailButton || "Ou envoyer par email"}
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-2">
                      <span className="flex items-center text-[11px] text-gray-500">
                        <i className="fas fa-clock mr-1" />
                        <span data-tina-field={parrain ? tinaField(parrain, "responseTime") : undefined}>
                          {parrain?.responseTime || "Réponse sous 48h"}
                        </span>
                      </span>
                      <span className="flex items-center text-[11px] text-gray-500">
                        <i className="fas fa-receipt mr-1" />
                        <span data-tina-field={parrain ? tinaField(parrain, "receiptLabel") : undefined}>
                          {parrain?.receiptLabel || "Reçu fiscal NSIF"}
                        </span>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Votre Don en Action */}
          {donAction && (
            <div className="mt-10 bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <h4
                className="font-bold text-gray-800 mb-5 flex items-center justify-center"
                data-tina-field={tinaField(donAction, "heading")}
              >
                <i className="fas fa-chart-pie mr-2 text-brand-pink" />
                {donAction.heading || "Votre Don en Action"}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {(donAction.items || []).map((item: any, i: number) => (
                  <div key={i} className="p-3">
                    <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                      i % 2 === 0 ? "bg-blue-50" : "bg-pink-50"
                    }`}>
                      <i className={`${item.icon} ${i % 2 === 0 ? "text-brand-blue" : "text-brand-pink"}`} />
                    </div>
                    <span
                      className="block text-xs font-bold text-gray-700"
                      data-tina-field={tinaField(item, "title")}
                    >
                      {item.title}
                    </span>
                    <span
                      className="block text-[11px] text-gray-500"
                      data-tina-field={tinaField(item, "subtitle")}
                    >
                      {item.subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CSR Info */}
          {csr && (
            <div className="mt-12 text-center max-w-2xl mx-auto">
              <h4
                className="font-bold text-gray-600 mb-2"
                data-tina-field={tinaField(csr, "heading")}
              >
                {csr.heading || "Pour les entreprises (CSR)"}
              </h4>
              <p className="text-sm text-gray-500">
                {ui?.csrCodeLabel || "Code CSR"} : <strong data-tina-field={tinaField(csr, "csrCode")}>{csr.csrCode || ""}</strong>.{" "}
                <span data-tina-field={tinaField(csr, "text")}>{csr.text || ""}</span>
                <br />
                {ui?.csrContactLabel || "Contactez"} <strong data-tina-field={tinaField(csr, "contactName")}>{csr.contactName || ""}</strong>{" "}
                (<span data-tina-field={tinaField(csr, "contactRole")}>{csr.contactRole || ""}</span>)
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

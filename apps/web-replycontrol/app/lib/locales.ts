export const supportedLocales = ["en", "uk", "bg", "de", "es", "pt-br", "tr"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const localeNames: Record<SupportedLocale, string> = {
  en: "English",
  bg: "Български",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  "pt-br": "Português",
  tr: "Türkçe",
  uk: "English (UK)",
};

type Card = { title: string; body: string; action: string };
type Copy = {
  localeLabel: string;
  nav: { estate: string; discipline: string; substrate: string; begin: string };
  eyebrow: string;
  title: string;
  lead: string;
  primaryAction: string;
  secondaryAction: string;
  signal: { title: string; rule: string; proof: string; authority: string; release: string };
  estate: { eyebrow: string; title: string; cards: Card[] };
  principles: { eyebrow: string; title: string; items: Array<[string, string]> };
  closing: { eyebrow: string; title: string; body: string; action: string };
};

export const copy: Record<SupportedLocale, Copy> = {
  en: {
    localeLabel: "Country & language",
    nav: { estate: "Estate", discipline: "Discipline", substrate: "Substrate", begin: "Begin" },
    eyebrow: "Answerable systems · owner-led",
    title: "Make the work answerable to the people who own it.",
    lead: "MindReply turns costly operational knots into calm, measurable circuits. Judgment stays human. Every important action carries a named hand and every result leaves a proof trail.",
    primaryAction: "Start with repository clarity",
    secondaryAction: "Walk the A11-K estate",
    signal: { title: "Signal window", rule: "Responsibility follows evidence.", proof: "Visible", authority: "Named", release: "Reversible" },
    estate: { eyebrow: "The estate", title: "Different rooms. One discipline.", cards: [
      { title: "Crownwork", body: "Operating circuits for teams who need measurable value without handing over the last word.", action: "Map the first knot" },
      { title: "A11-K", body: "A public estate of local-first rooms: brief the work, see the route, forge a reversible release, frame the truth without theatre.", action: "Enter the estate" },
      { title: "Repository Clarity", body: "Seven days. Read-only. Your GitHub and Python estate sorted into exposure, drag, and paths worth automating—with named stop rules.", action: "Book the €3,000 audit" },
    ] },
    principles: { eyebrow: "Operating discipline", title: "Quiet systems. Visible command.", items: [
      ["Proof before permission", "Authority widens only after performance is accepted. It is never assumed from a demo or a slide."],
      ["People keep the last word", "Every consequential action has a named hand and a stop rule. Machines wait; people decide."],
      ["Private machinery stays private", "Public surfaces show value and boundary—not credentials, not internal levers, not the room where the switches live."],
    ] },
    closing: { eyebrow: "A clear first passage", title: "Start with what already exists.", body: "One bounded, read-only review of the repository estate. No merges, deployments, billing changes, or external messages without explicit approval.", action: "Book the seven-day audit — €3,000" },
  },
  bg: {
    localeLabel: "Държава и език",
    nav: { estate: "Екосистема", discipline: "Дисциплина", substrate: "Основа", begin: "Начало" },
    eyebrow: "Проверими системи · водени от собственика",
    title: "Направете работата отговорна пред хората, които я притежават.",
    lead: "MindReply превръща скъпите оперативни затруднения в спокойни и измерими процеси. Преценката остава човешка. Всяко важно действие има посочен отговорник и проследима доказателствена следа.",
    primaryAction: "Започнете с яснота за хранилището",
    secondaryAction: "Разгледайте A11-K",
    signal: { title: "Оперативен сигнал", rule: "Отговорността следва доказателствата.", proof: "Видимо", authority: "Посочено", release: "Обратимо" },
    estate: { eyebrow: "Екосистемата", title: "Различни пространства. Една дисциплина.", cards: [
      { title: "Crownwork", body: "Оперативни процеси за екипи, които търсят измерима стойност без да предават последната дума.", action: "Картографирайте първата пречка" },
      { title: "A11-K", body: "Публична екосистема от локални пространства за бриф, маршрути, обратими издания и доказуемо позициониране.", action: "Влезте в екосистемата" },
      { title: "Яснота за хранилището", body: "Седем дни. Само четене. GitHub и Python средата ви са подредени по риск, затруднения и възможности за автоматизация.", action: "Резервирайте одит за €3 000" },
    ] },
    principles: { eyebrow: "Оперативна дисциплина", title: "Тихи системи. Видим контрол.", items: [
      ["Доказателство преди разрешение", "Обхватът на правомощията расте само след прието изпълнение; не се предполага от демо или презентация."],
      ["Хората пазят последната дума", "Всяко последователно действие има посочен отговорник и правило за спиране. Машините изчакват; хората решават."],
      ["Частната механика остава частна", "Публичните повърхности показват стойност и граница, а не идентификационни данни или вътрешни механизми."],
    ] },
    closing: { eyebrow: "Ясен първи ход", title: "Започнете с наличното.", body: "Един ограничен преглед само за четене на хранилището. Без сливания, разгръщания, промени по плащания или външни съобщения без изрично одобрение.", action: "Резервирайте седемдневния одит — €3 000" },
  },
  de: {
    localeLabel: "Land & Sprache",
    nav: { estate: "Bereiche", discipline: "Disziplin", substrate: "Grundlage", begin: "Start" },
    eyebrow: "Nachvollziehbare Systeme · inhabergeführt",
    title: "Machen Sie die Arbeit gegenüber den Menschen verantwortbar, denen sie gehört.",
    lead: "MindReply verwandelt kostspielige operative Knoten in ruhige, messbare Abläufe. Das Urteil bleibt menschlich. Jede wichtige Handlung hat eine benannte Verantwortung und eine überprüfbare Spur.",
    primaryAction: "Mit Repository-Klarheit beginnen",
    secondaryAction: "A11-K erkunden",
    signal: { title: "Signalfenster", rule: "Verantwortung folgt der Evidenz.", proof: "Sichtbar", authority: "Benannt", release: "Umkehrbar" },
    estate: { eyebrow: "Die Bereiche", title: "Verschiedene Räume. Eine Disziplin.", cards: [
      { title: "Crownwork", body: "Operative Kreisläufe für Teams, die messbaren Wert brauchen, ohne das letzte Wort abzugeben.", action: "Den ersten Knoten abbilden" },
      { title: "A11-K", body: "Ein öffentliches Ensemble lokaler Räume: Arbeit briefen, Route sehen, reversible Veröffentlichung schmieden und Wahrheit klar formulieren.", action: "Das Ensemble betreten" },
      { title: "Repository-Klarheit", body: "Sieben Tage. Nur Lesen. GitHub- und Python-Bestand nach Risiken, Reibung und verantwortbaren Automatisierungspfaden sortiert.", action: "€3.000-Audit buchen" },
    ] },
    principles: { eyebrow: "Operative Disziplin", title: "Ruhige Systeme. Sichtbare Führung.", items: [
      ["Nachweis vor Erlaubnis", "Befugnisse erweitern sich erst nach abgenommener Leistung—nicht durch Demo oder Folie."],
      ["Menschen behalten das letzte Wort", "Jede folgenreiche Handlung hat eine benannte Hand und eine Abbruchregel. Maschinen warten; Menschen entscheiden."],
      ["Private Mechanik bleibt privat", "Öffentliche Flächen zeigen Wert und Grenze, nicht Zugangsdaten oder interne Hebel."],
    ] },
    closing: { eyebrow: "Ein klarer erster Durchgang", title: "Mit dem beginnen, was bereits da ist.", body: "Ein begrenzter, schreibgeschützter Blick auf den Repository-Bestand. Keine Merges, Deployments, Abrechnungsänderungen oder externen Nachrichten ohne ausdrückliche Freigabe.", action: "Sieben-Tage-Audit buchen — €3.000" },
  },
  uk: { localeLabel: "Country & language", nav: { estate: "Estate", discipline: "Discipline", substrate: "Substrate", begin: "Begin" }, eyebrow: "Answerable systems · owner-led", title: "Make the work answerable to the people who own it.", lead: "MindReply turns costly operational knots into calm, measurable circuits. Judgment stays human, with clear responsibility and a proof trail for important work.", primaryAction: "Start with repository clarity", secondaryAction: "Walk the A11-K estate", signal: { title: "Signal window", rule: "Responsibility follows evidence.", proof: "Visible", authority: "Named", release: "Reversible" }, estate: { eyebrow: "The estate", title: "Different rooms. One discipline.", cards: [{ title: "Crownwork", body: "Operating circuits for teams that need measurable value without giving away the last word.", action: "Map the first knot" }, { title: "A11-K", body: "Owner-led operating rooms for briefing work, seeing the route and releasing changes reversibly.", action: "Enter the estate" }, { title: "Repository Clarity", body: "Seven days. Read-only. Your GitHub and Python estate sorted into exposure, drag and responsible automation paths.", action: "Book the £3,000 audit" }] }, principles: { eyebrow: "Operating discipline", title: "Quiet systems. Visible command.", items: [["Proof before permission", "Authority widens only after accepted evidence."], ["People keep the last word", "Consequential actions retain a named owner and stop rule."], ["Private machinery stays private", "Public surfaces show value and boundary, not internal controls."]] }, closing: { eyebrow: "A clear first passage", title: "Start with what already exists.", body: "One bounded, read-only review of the repository estate. No merges, deployments, billing changes or external messages without explicit approval.", action: "Book the seven-day audit — £3,000" },
  },
  "pt-br": { localeLabel: "País e idioma", nav: { estate: "Ecossistema", discipline: "Disciplina", substrate: "Base", begin: "Começar" }, eyebrow: "Sistemas responsáveis · orientados pelo proprietário", title: "Faça o trabalho responder às pessoas que são responsáveis por ele.", lead: "A MindReply transforma problemas operacionais caros em fluxos calmos e mensuráveis. O julgamento continua humano, com responsabilidade clara e trilha de evidências.", primaryAction: "Começar pela clareza do repositório", secondaryAction: "Explorar o A11-K", signal: { title: "Janela de sinal", rule: "A responsabilidade segue a evidência.", proof: "Visível", authority: "Nomeada", release: "Reversível" }, estate: { eyebrow: "O ecossistema", title: "Espaços diferentes. Uma disciplina.", cards: [{ title: "Crownwork", body: "Circuitos operacionais para equipes que precisam de valor mensurável sem perder a palavra final.", action: "Mapear o primeiro ponto" }, { title: "A11-K", body: "Espaços operacionais para definir o trabalho, visualizar a rota e liberar mudanças de forma reversível.", action: "Entrar no ecossistema" }, { title: "Clareza do repositório", body: "Sete dias. Somente leitura. GitHub e Python organizados por exposição, atrito e automação responsável.", action: "Reservar a auditoria de R$ 3.000" }] }, principles: { eyebrow: "Disciplina operacional", title: "Sistemas tranquilos. Comando visível.", items: [["Evidência antes da permissão", "A autoridade aumenta somente após evidência aceita."], ["As pessoas mantêm a palavra final", "Ações relevantes têm responsável e regra de parada."], ["A mecânica privada permanece privada", "As superfícies públicas mostram valor e limites, não controles internos."]] }, closing: { eyebrow: "Um primeiro passo claro", title: "Comece pelo que já existe.", body: "Uma revisão limitada e somente leitura do patrimônio de repositórios. Sem merges, deploys, alterações de cobrança ou mensagens externas sem aprovação explícita.", action: "Reservar a auditoria de sete dias — R$ 3.000" },
  },
  tr: { localeLabel: "Ülke ve dil", nav: { estate: "Ekosistem", discipline: "Disiplin", substrate: "Temel", begin: "Başla" }, eyebrow: "Hesap verebilir sistemler · sahip odaklı", title: "İşi, ona sahip olan insanların kararlarına hesap verebilir hale getirin.", lead: "MindReply maliyetli operasyonel düğümleri sakin ve ölçülebilir akışlara dönüştürür. Karar insanlarda kalır; önemli işler açık sorumluluk ve kanıt izi taşır.", primaryAction: "Depo netliğiyle başlayın", secondaryAction: "A11-K ekosistemini inceleyin", signal: { title: "Sinyal penceresi", rule: "Sorumluluk kanıtı izler.", proof: "Görünür", authority: "Tanımlı", release: "Geri alınabilir" }, estate: { eyebrow: "Ekosistem", title: "Farklı alanlar. Tek disiplin.", cards: [{ title: "Crownwork", body: "Son sözü devretmeden ölçülebilir değer isteyen ekipler için operasyonel devreler.", action: "İlk düğümü haritalayın" }, { title: "A11-K", body: "İşi tanımlamak, rotayı görmek ve değişiklikleri geri alınabilir biçimde yayımlamak için sahip odaklı çalışma alanları.", action: "Ekosisteme girin" }, { title: "Depo Netliği", body: "Yedi gün. Salt okunur. GitHub ve Python varlığınız risk, sürtünme ve sorumlu otomasyon yollarına göre düzenlenir.", action: "£3.000 denetimi ayırtın" }] }, principles: { eyebrow: "Operasyon disiplini", title: "Sessiz sistemler. Görünür komuta.", items: [["İzin öncesi kanıt", "Yetki yalnızca kabul edilmiş kanıttan sonra genişler."], ["Son söz insanlarda", "Sonuç doğuran işlemlerde sorumlu kişi ve durdurma kuralı bulunur."], ["Özel mekanizma özel kalır", "Herkese açık yüzeyler iç kontrolleri değil, değeri ve sınırı gösterir."]] }, closing: { eyebrow: "Net bir ilk adım", title: "Mevcut olanla başlayın.", body: "Depo varlığının sınırlı, salt okunur incelemesi. Açık onay olmadan merge, dağıtım, faturalama değişikliği veya harici mesaj yok.", action: "Yedi günlük denetimi ayırtın — £3.000" },
  },
  fr: {
    localeLabel: "Pays et langue",
    nav: { estate: "Écosystème", discipline: "Discipline", substrate: "Fondation", begin: "Commencer" },
    eyebrow: "Systèmes responsables · dirigés par leur propriétaire",
    title: "Rendez le travail redevable aux personnes qui en sont responsables.",
    lead: "MindReply transforme les nœuds opérationnels coûteux en circuits calmes et mesurables. Le jugement reste humain. Chaque action importante porte un responsable désigné et une piste de preuve.",
    primaryAction: "Commencer par la clarté du dépôt",
    secondaryAction: "Explorer A11-K",
    signal: { title: "Fenêtre de signal", rule: "La responsabilité suit la preuve.", proof: "Visible", authority: "Nommée", release: "Réversible" },
    estate: { eyebrow: "L'écosystème", title: "Des espaces différents. Une discipline.", cards: [
      { title: "Crownwork", body: "Des circuits opérationnels pour les équipes qui recherchent une valeur mesurable sans céder le dernier mot.", action: "Cartographier le premier nœud" },
      { title: "A11-K", body: "Un ensemble public d'espaces locaux : cadrer le travail, voir la route, forger une publication réversible et formuler la vérité sans théâtre.", action: "Entrer dans l'ensemble" },
      { title: "Clarté du dépôt", body: "Sept jours. Lecture seule. Votre environnement GitHub et Python trié selon l'exposition, les frictions et les voies d'automatisation.", action: "Réserver l'audit à 3 000 €" },
    ] },
    principles: { eyebrow: "Discipline opérationnelle", title: "Systèmes calmes. Commandement visible.", items: [
      ["La preuve avant l'autorisation", "L'autorité ne s'élargit qu'après acceptation de la performance, jamais sur la base d'une démo."],
      ["Les personnes gardent le dernier mot", "Chaque action conséquente a une main désignée et une règle d'arrêt. Les machines attendent ; les personnes décident."],
      ["La mécanique privée reste privée", "Les surfaces publiques montrent la valeur et la limite, pas les identifiants ni les leviers internes."],
    ] },
    closing: { eyebrow: "Un premier passage clair", title: "Commencez par l'existant.", body: "Une revue limitée en lecture seule du patrimoine de dépôts. Aucune fusion, mise en production, modification de facturation ou communication externe sans accord explicite.", action: "Réserver l'audit de sept jours — 3 000 €" },
  },
  es: {
    localeLabel: "País e idioma",
    nav: { estate: "Ecosistema", discipline: "Disciplina", substrate: "Base", begin: "Empezar" },
    eyebrow: "Sistemas responsables · liderados por su propietario",
    title: "Haga que el trabajo responda ante las personas que lo poseen.",
    lead: "MindReply convierte los nudos operativos costosos en circuitos serenos y medibles. El juicio sigue siendo humano. Cada acción importante tiene una persona responsable y una pista de evidencia.",
    primaryAction: "Empezar con claridad del repositorio",
    secondaryAction: "Recorrer el ecosistema A11-K",
    signal: { title: "Ventana de señal", rule: "La responsabilidad sigue a la evidencia.", proof: "Visible", authority: "Nombrada", release: "Reversible" },
    estate: { eyebrow: "El ecosistema", title: "Espacios distintos. Una disciplina.", cards: [
      { title: "Crownwork", body: "Circuitos operativos para equipos que necesitan valor medible sin entregar la última palabra.", action: "Mapear el primer nudo" },
      { title: "A11-K", body: "Un conjunto público de espacios locales: definir el trabajo, ver la ruta, forjar una liberación reversible y expresar la verdad sin teatro.", action: "Entrar en el ecosistema" },
      { title: "Claridad del repositorio", body: "Siete días. Solo lectura. Su entorno de GitHub y Python ordenado por exposición, fricción y rutas de automatización responsables.", action: "Reservar la auditoría de 3.000 €" },
    ] },
    principles: { eyebrow: "Disciplina operativa", title: "Sistemas tranquilos. Mando visible.", items: [
      ["Prueba antes que permiso", "La autoridad se amplía solo después de aceptar el rendimiento; nunca se supone a partir de una demostración."],
      ["Las personas conservan la última palabra", "Toda acción consecuente tiene una mano nombrada y una regla de parada. Las máquinas esperan; las personas deciden."],
      ["La maquinaria privada sigue siendo privada", "Las superficies públicas muestran valor y límite, no credenciales ni controles internos."],
    ] },
    closing: { eyebrow: "Un primer paso claro", title: "Empiece por lo que ya existe.", body: "Una revisión limitada y de solo lectura del patrimonio de repositorios. Sin fusiones, despliegues, cambios de facturación ni mensajes externos sin aprobación explícita.", action: "Reservar la auditoría de siete días — 3.000 €" },
  },
};

export function normalizeLocale(value?: string | null): SupportedLocale {
  const candidate = value?.toLowerCase() || "";\n  if (candidate === "pt-br" || candidate.startsWith("pt-br-")) return "pt-br";\n  if (candidate === "en-gb" || candidate === "en-ie") return "uk";\n  const base = candidate.split("-")[0];
  return supportedLocales.includes(candidate as SupportedLocale)
    ? (candidate as SupportedLocale)
    : "en";
}

export const siteConfig = {
  name: "DuplexSoft",
  legalName: "DuplexSoft Sistemas",
  tagline: "Gestão para postos de combustíveis no Triângulo Mineiro",
  description:
    "A DuplexSoft, em Uberaba-MG, é revenda autorizada WebPosto: implantação, treinamento e suporte para postos de combustíveis no Triângulo Mineiro. Também disponibilizamos o DX Web, sistema de gestão em nuvem da DuplexSoft.",
  url: "https://www.duplexsoft.com.br",
  appUrl: "https://app.duplexsoft.com.br",
  locale: "pt-BR",
  location: {
    city: "Uberaba",
    state: "MG",
    region: "Triângulo Mineiro",
    label: "Uberaba-MG · Triângulo Mineiro",
  },
  contactEmail: process.env.CONTACT_TO_EMAIL ?? "contato@duplexsoft.com.br",
  phone: {
    display: "(34) 99706-0684",
    e164: "5534997060684",
    whatsappUrl: "https://wa.me/5534997060684",
  },
  links: {
    kb: process.env.NEXT_PUBLIC_DESKRUDDER_KB_URL ?? "",
    chatSrc: process.env.NEXT_PUBLIC_DESKRUDDER_CHAT_SRC ?? "",
    instagram: "https://www.instagram.com/duplexsoft",
  },
  qr: {
    whatsapp: "/qr/whatsapp.png",
    instagram: "/qr/instagram.png",
  },
  nav: [
    { href: "/", label: "Início" },
    { href: "/sobre", label: "Sobre" },
    { href: "/solucoes", label: "Soluções" },
    { href: "/contato", label: "Contato" },
  ],
} as const;

/** Módulos do WebPosto (referência pública: webposto.com.br) — comercializados pela DuplexSoft. */
export const webPostoModules = [
  {
    name: "Pista",
    group: "operacao",
    text: "Atendimento ágil na pista, com gestão em tempo real e operação mais segura.",
    scene: "/scenes/pista-rodovia-v7.jpg",
    sceneAlt:
      "Posto com canopy amarelo, conveniência e baia de troca de óleo mais ao fundo com carro no elevador, caminhões no pátio — sem marca de bandeira.",
    sceneRole: "photo",
  },
  {
    name: "Conveniência",
    group: "operacao",
    text: "Operação da loja mais rápida para o cliente e mais prática para a equipe.",
    scene: "/scenes/conveniencia-loja-v3.jpg",
    sceneAlt:
      "Interior de conveniência com parede amarela, geladeiras e gôndolas, no estilo de loja de posto.",
    sceneRole: "photo",
  },
  {
    name: "Frota",
    group: "operacao",
    text: "Controle de frotas com histórico de consumo e relatórios por cliente.",
    sceneRole: "text",
  },
  {
    name: "Troca de óleo",
    group: "operacao",
    text: "Rotina de lubrificação e troca de óleo mais organizada, com processos automáticos.",
    scene: "/scenes/troca-oleo-v3.jpg",
    sceneAlt:
      "Baia de troca de óleo com pickup no elevador e canopy amarelo do posto ao fundo.",
    sceneRole: "photo",
  },
  {
    name: "Restaurante",
    group: "operacao",
    text: "Gestão do restaurante do posto integrada à operação.",
    scene: "/scenes/restaurante-posto-v3.jpg",
    sceneAlt:
      "Restaurante de posto com buffet, parede amarela e caminhões no pátio pela janela.",
    sceneRole: "photo",
  },
  {
    name: "Administrativo",
    group: "retaguarda",
    text: "Rotinas de escritório e administrativas com dados confiáveis.",
    sceneRole: "text",
  },
  {
    name: "Financeiro",
    group: "retaguarda",
    text: "Financeiro e contábil centralizados, com processos mais automatizados.",
    sceneRole: "text",
  },
] as const;

/** Hero = DuplexSoft (empresa de sistemas); cenas de posto ficam nos cards. */
export const homeHeroScene = {
  src: "/scenes/duplex-hero-sistemas-v1.jpg",
  alt: "Ambiente de trabalho da DuplexSoft: monitores com painéis de gestão e a marca da empresa no escritório.",
} as const;

export const sobreHeroScene = {
  src: "/scenes/duplex-sobre-escritorio-v1.jpg",
  alt: "Escritório da DuplexSoft com mesa de trabalho e marca na parede — empresa de sistemas em Uberaba.",
} as const;

/** Agrupamento para a home: prova de cobertura sem grade de cards iguais. */
export const webPostoModuleGroups = [
  {
    id: "operacao",
    title: "Na operação",
    modules: webPostoModules.filter((module) => module.group === "operacao"),
  },
  {
    id: "retaguarda",
    title: "No escritório e financeiro",
    modules: webPostoModules.filter((module) => module.group === "retaguarda"),
  },
] as const;

/** Ordem de vitrine: WebPosto primeiro. */
export const solutions = [
  {
    id: "webposto",
    name: "WebPosto",
    badge: "Revenda autorizada",
    summary:
      "Revenda autorizada WebPosto com a DuplexSoft: implantação, treinamento e suporte local no Triângulo Mineiro — feito para a operação do posto.",
    bullets: [
      "Pista, conveniência, frota, troca de óleo e restaurante no mesmo ecossistema",
      "Gestão administrativa, financeira e contábil integradas",
      "Operação em nuvem, com acompanhamento e decisões à distância",
      "Implantação e suporte local pela DuplexSoft, em Uberaba",
    ],
    primaryCta: {
      label: "Falar conosco",
      href: "/contato?interesse=webposto",
    },
    secondaryCta: { label: "Conhecer a DuplexSoft", href: "/sobre" },
    focus: "Da pista ao escritório, tudo integrado",
  },
  {
    id: "dx-web",
    name: "DX Web",
    badge: "Sistema de gestão em nuvem · DuplexSoft",
    summary:
      "Sistema de gestão em nuvem da DuplexSoft (app.duplexsoft.com.br): PDV, fiscal, estoque, financeiro e relatórios para o dia a dia do negócio. Escolha o DX Web quando precisa da plataforma própria DuplexSoft — não do sistema de posto WebPosto.",
    bullets: [
      "Gestão em nuvem com PDV (web, desk e mobile)",
      "Emissão fiscal, boletos e rotinas financeiras",
      "Estoque, dashboards e relatórios em um só lugar",
      "Implantação, treinamento e suporte pela DuplexSoft — valores sob consulta",
    ],
    primaryCta: {
      label: "Falar sobre o DX Web",
      href: "/contato?interesse=dx-web",
    },
    secondaryCta: { label: "Acessar o sistema", href: "https://app.duplexsoft.com.br" },
    focus: "Sistema de gestão em nuvem da DuplexSoft",
  },
] as const;

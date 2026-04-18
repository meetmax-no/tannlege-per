// Mock data for Tannlege Måreid website

export const clinicInfo = {
  name: "Tannlegene Måreid",
  tagline: "Din tannhelse i trygge hender",
  description: "Sentralt beliggende allmennpraksis med fokus på hyggelig og trygg atmosfære. Vi er her for deg!",
  address: "Waldemar Thranes gate 68, 0173 Oslo",
  phone: "22 35 57 00",
  email: "post@tannlegemaareid.no",
  transport: "Bussforbindelser: 34, 54, 21",
  parking: "Alexander Kiellands hus / Falck Ytters Nærsenter"
};

export const openingHours = [
  { day: "Mandag", hours: "08:00 - 16:00" },
  { day: "Tirsdag", hours: "08:00 - 16:00" },
  { day: "Onsdag", hours: "08:00 - 16:00" },
  { day: "Torsdag", hours: "08:00 - 16:00" },
  { day: "Fredag", hours: "08:00 - 15:00" },
  { day: "Lørdag", hours: "Stengt" },
  { day: "Søndag", hours: "Stengt" }
];

export const services = [
  {
    id: 1,
    title: "Allmenn tannbehandling",
    description: "Regelmessige kontroller, tannrens og forebyggende behandling for hele familien.",
    icon: "Stethoscope"
  },
  {
    id: 2,
    title: "Fast og løs protetikk",
    description: "Kroner, broer og proteser tilpasset dine behov med høy kvalitet og presisjon.",
    icon: "Smile"
  },
  {
    id: 3,
    title: "Tannkjøttsbehandling",
    description: "Spesialisert behandling av tannkjøttsykdommer med mulighet for Helfo-refusjon.",
    icon: "HeartPulse"
  },
  {
    id: 4,
    title: "Estetisk tannbehandling",
    description: "Tannbleking, fasetter og andre kosmetiske løsninger for et vakkert smil.",
    icon: "Sparkles"
  },
  {
    id: 5,
    title: "Akuttbehandling",
    description: "Rask hjelp ved tannverk, brudd eller andre akutte problemer.",
    icon: "AlertCircle"
  },
  {
    id: 6,
    title: "Studenttilbud",
    description: "Spesielle priser for studenter. Kontakt oss for mer informasjon.",
    icon: "GraduationCap"
  }
];

export const teamMembers = [
  {
    id: 1,
    name: "Per Eivind Måreid",
    role: "Tannlege",
    education: "Universitetet i Oslo, 1991",
    specialization: "Fast og løs protetikk",
    description: "Med over 30 års erfaring har Per spesialisert seg på protetikk og komplekse tannrestaureringar.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400"
  },
  {
    id: 2,
    name: "Zena Alani",
    role: "Tannlege",
    education: "Autorisert tannlege",
    specialization: "Allmenn tannbehandling",
    description: "Zena har bred erfaring innen allmenn tannbehandling og er spesielt opptatt av forebyggende behandling.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Anna Larsen",
    rating: 5,
    text: "Fantastisk tannlege! Per er utrolig dyktig og tar seg god tid. Kan varmt anbefales!",
    date: "2024-11-15"
  },
  {
    id: 2,
    name: "Martin Johansen",
    rating: 5,
    text: "Har vært redd for tannlegen i mange år, men teamet her fikk meg til å føle meg trygg. Tusen takk!",
    date: "2024-10-28"
  },
  {
    id: 3,
    name: "Kari Olsen",
    rating: 5,
    text: "Profesjonell og hyggelig betjening. Moderne klinikk med god atmosfære. Anbefales på det sterkeste!",
    date: "2024-09-12"
  }
];

export const priceList = [
  {
    category: "Undersøkelse og kontroll",
    items: [
      { service: "Ordinær kontroll", price: "Fra kr 950,-" },
      { service: "Akutt konsultasjon", price: "Fra kr 1.200,-" },
      { service: "Røntgen (bitewing)", price: "Fra kr 350,-" }
    ]
  },
  {
    category: "Forebyggende behandling",
    items: [
      { service: "Tannrens", price: "Fra kr 1.100,-" },
      { service: "Fluorbehandling", price: "Fra kr 450,-" }
    ]
  },
  {
    category: "Fyllinger",
    items: [
      { service: "Enkel fylling", price: "Fra kr 1.500,-" },
      { service: "Større fylling", price: "Fra kr 2.200,-" }
    ]
  },
  {
    category: "Protetikk",
    items: [
      { service: "Krone (keramikk)", price: "Fra kr 9.500,-" },
      { service: "Bro (per ledd)", price: "Fra kr 8.500,-" }
    ]
  }
];

export const helfoInfo = {
  title: "Helfo-refusjoner",
  description: "Mange har krav på refusjon fra Helfo. Det er flere tilstander som gir refusjon, for eksempel tannkjøttsykdom.",
  link: "https://www.helsedirektoratet.no/rundskriv/kapittel-5-stonad-ved-helsetjenester/takster-for-tannbehandling-"
};

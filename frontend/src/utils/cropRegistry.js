/**
 * ============================================================
 * AgriDirect - Professional Crop Image Registry
 * ============================================================
 *
 * - Stable crop keys
 * - Professional crop images
 * - English + Tamil names
 * - Automatic crop-name normalization
 * - Canonical crop images always get priority
 * ============================================================
 */


/* ============================================================
   CROP IMAGE MAP
   ============================================================ */

export const CROP_IMAGE_MAP = {

  /* =========================
     VEGETABLES
     ========================= */

  tomato:
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=85",

  onion:
    "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=85",

  shallot:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shallot.jpg",

  potato:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=85",

  brinjal:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Aubergine.jpg",

  eggplant:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Aubergine.jpg",

  cabbage:
    "https://images.unsplash.com/photo-1508302730834-a3786a6c951d?w=800&auto=format&fit=crop&q=85",

  carrot:
    "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=800&auto=format&fit=crop&q=85",

  chilli:
    "https://images.unsplash.com/photo-1597115580039-b849ed2d6398?w=800&auto=format&fit=crop&q=85",


  /* =========================
     DRUMSTICK / MORINGA
     ========================= */

  drumstick:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Moringa_oleifera_pods_NP.JPG",

  moringa:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Moringa_oleifera_pods_NP.JPG",


  /* =========================
     GRAINS
     ========================= */

  paddy:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Paddy_field_in_Tamilnadu.jpg",

  rice:
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=85",

  wheat:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Wheat_close-up.JPG",


  /* =========================
     FRUITS
     ========================= */

  mango:
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=85",

  banana:
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=85",

  coconut:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kokosnuss.JPG",


  /* =========================
     SPICES
     ========================= */

  turmeric:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Turmeric_rhizomes.jpg",

  garlic:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Garlic.jpg",

  ginger:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Ginger-Whole-Root.jpg",


  /* =========================
     COMMERCIAL CROPS
     ========================= */

  sugarcane:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sugarcane_field.jpg",

  cotton:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cotton_flower.jpg",

  groundnut:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Peanuts_in_shell.jpg"
};


/* ============================================================
   TAMIL CROP NAMES
   ============================================================ */

export const CROP_TAMIL_NAMES = {

  tomato: "தக்காளி",
  onion: "வெங்காயம்",
  shallot: "சின்ன வெங்காயம்",
  potato: "உருளைக்கிழங்கு",

  brinjal: "கத்தரிக்காய்",
  eggplant: "கத்தரிக்காய்",

  cabbage: "முட்டைக்கோஸ்",
  carrot: "கேரட்",
  chilli: "பச்சை மிளகாய்",

  drumstick: "முருங்கைக்காய்",
  moringa: "முருங்கைக்காய்",

  banana: "வாழைப்பழம்",
  turmeric: "மஞ்சள்",

  paddy: "நெல்",
  rice: "அரிசி",

  mango: "மாம்பழம்",
  coconut: "தேங்காய்",

  garlic: "பூண்டு",
  ginger: "இஞ்சி",

  sugarcane: "கரும்பு",
  wheat: "கோதுமை",

  cotton: "பருத்தி",
  groundnut: "நிலக்கடலை"
};


/* ============================================================
   ENGLISH CROP NAMES
   ============================================================ */

export const CROP_ENGLISH_NAMES = {

  tomato: "Tomato",
  onion: "Onion",
  shallot: "Small Shallots",
  potato: "Potato",

  brinjal: "Brinjal",
  eggplant: "Eggplant",

  cabbage: "Cabbage",
  carrot: "Carrot",
  chilli: "Green Chilli",

  drumstick: "Drumstick",
  moringa: "Moringa",

  banana: "Banana",
  turmeric: "Raw Turmeric",

  paddy: "Samba Paddy",
  rice: "Rice",

  mango: "Mango",
  coconut: "Coconut",

  garlic: "Garlic",
  ginger: "Ginger",

  sugarcane: "Sugarcane",
  wheat: "Wheat",

  cotton: "Cotton",
  groundnut: "Groundnut"
};


/* ============================================================
   DEFAULT IMAGE
   ============================================================ */

export const DEFAULT_CROP_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=85";


/* ============================================================
   CROP KEY RESOLVER
   ============================================================ */

export const getCropKey = (rawName = "") => {

  if (!rawName) {
    return "default";
  }

  const name = String(rawName)
    .toLowerCase()
    .trim();


  /* DRUMSTICK / MORINGA */

  if (
    name.includes("drumstick") ||
    name.includes("moringa") ||
    name.includes("முருங்கை")
  ) {
    return "drumstick";
  }


  /* BRINJAL / EGGPLANT */

  if (
    name.includes("brinjal") ||
    name.includes("eggplant") ||
    name.includes("aubergine") ||
    name.includes("கத்தரி") ||
    name.includes("கத்திரி")
  ) {
    return "brinjal";
  }


  /* TOMATO */

  if (
    name.includes("tomato") ||
    name.includes("தக்காளி")
  ) {
    return "tomato";
  }


  /* SHALLOT / SMALL ONION */

  if (
    name.includes("shallot") ||
    name.includes("small onion") ||
    name.includes("small onions") ||
    name.includes("சின்ன வெங்காயம்")
  ) {
    return "shallot";
  }


  /* ONION */

  if (
    name.includes("onion") ||
    name.includes("வெங்காயம்")
  ) {
    return "onion";
  }


  /* POTATO */

  if (
    name.includes("potato") ||
    name.includes("உருளை") ||
    name.includes("உருளைக்கிழங்கு")
  ) {
    return "potato";
  }


  /* CHILLI */

  if (
    name.includes("chilli") ||
    name.includes("chili") ||
    name.includes("green chilli") ||
    name.includes("green chili") ||
    name.includes("green chillies") ||
    name.includes("மிளகாய்")
  ) {
    return "chilli";
  }


  /* CABBAGE */

  if (
    name.includes("cabbage") ||
    name.includes("முட்டைக்கோஸ்")
  ) {
    return "cabbage";
  }


  /* CARROT */

  if (
    name.includes("carrot") ||
    name.includes("carrots") ||
    name.includes("கேரட்")
  ) {
    return "carrot";
  }


  /* BANANA */

  if (
    name.includes("banana") ||
    name.includes("bananas") ||
    name.includes("வாழை") ||
    name.includes("வாழைப்பழம்")
  ) {
    return "banana";
  }


  /* TURMERIC */

  if (
    name.includes("turmeric") ||
    name.includes("raw turmeric") ||
    name.includes("மஞ்சள்")
  ) {
    return "turmeric";
  }


  /* PADDY / SAMBA PADDY */

  if (
    name.includes("samba paddy") ||
    name.includes("paddy") ||
    name.includes("paddy rice") ||
    name.includes("samba") ||
    name.includes("நெல்") ||
    name.includes("சம்பா")
  ) {
    return "paddy";
  }


  /* RICE */

  if (
    name.includes("rice") ||
    name.includes("அரிசி")
  ) {
    return "rice";
  }


  /* MANGO */

  if (
    name.includes("mango") ||
    name.includes("மாம்பழம்")
  ) {
    return "mango";
  }


  /* COCONUT */

  if (
    name.includes("coconut") ||
    name.includes("தேங்காய்")
  ) {
    return "coconut";
  }


  /* GARLIC */

  if (
    name.includes("garlic") ||
    name.includes("பூண்டு")
  ) {
    return "garlic";
  }


  /* GINGER */

  if (
    name.includes("ginger") ||
    name.includes("இஞ்சி")
  ) {
    return "ginger";
  }


  /* SUGARCANE */

  if (
    name.includes("sugarcane") ||
    name.includes("கரும்பு")
  ) {
    return "sugarcane";
  }


  /* WHEAT */

  if (
    name.includes("wheat") ||
    name.includes("கோதுமை")
  ) {
    return "wheat";
  }


  /* COTTON */

  if (
    name.includes("cotton") ||
    name.includes("பருத்தி")
  ) {
    return "cotton";
  }


  /* GROUNDNUT / PEANUT */

  if (
    name.includes("groundnut") ||
    name.includes("peanut") ||
    name.includes("peanuts") ||
    name.includes("நிலக்கடலை")
  ) {
    return "groundnut";
  }


  return "default";
};


/* ============================================================
   GET CROP IMAGE
   ============================================================ */

export const getCropImage = (
  cropKeyOrName = "",
  fallbackUrl = null
) => {

  const key = getCropKey(cropKeyOrName);


  /*
   * Always use canonical crop image.
   */

  if (CROP_IMAGE_MAP[key]) {
    return CROP_IMAGE_MAP[key];
  }


  /*
   * Use backend image only if crop is unknown.
   */

  if (
    fallbackUrl &&
    typeof fallbackUrl === "string" &&
    fallbackUrl.startsWith("http") &&
    !fallbackUrl.toLowerCase().includes("placeholder")
  ) {
    return fallbackUrl;
  }


  return DEFAULT_CROP_IMAGE;
};


/* ============================================================
   GET LOCALIZED CROP DISPLAY NAME
   ============================================================ */

export const getCropDisplayName = (
  cropKeyOrName = "",
  language = "en"
) => {

  const key = getCropKey(cropKeyOrName);


  if (language === "ta") {
    return CROP_TAMIL_NAMES[key] || cropKeyOrName;
  }


  return CROP_ENGLISH_NAMES[key] || cropKeyOrName;
};
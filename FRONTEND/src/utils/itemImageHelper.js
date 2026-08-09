import haworthiaImg from "../assets/Haworthia.jpg";
import Anthurium from "../assets/Anthurium.png";
import peaceLily from "../assets/Peace Lily (Spathiphyllum).jpg";
import succulent from "../assets/Crassula Ovata Green Succulent.jpg";
import snakePlant from "../assets/Golden Hahnii Snake Plant Seeds Sansevieria Birds Nest.jpg";
import rubberPlant from "../assets/_dark leaf rubber plant (ficus elastica) - indoor decorative tree_.jpg";
import parlorPalm from "../assets/Indoors_ Discover the Timeless Elegance of the Parlor Palm.jpg";
import avocado from "../assets/From Seed to Tree_ The Beauty of Home-Grown Organic Avocado.jpg";

import starJasmine from "../assets/climbersandcreapers/image copy 2.png";
import wisteriaVine from "../assets/climbersandcreapers/image copy 5.png";
import honeysuckle from "../assets/climbersandcreapers/image copy 7.png";
import bougainvillea from "../assets/climbersandcreapers/image copy 4.png";
import orangeJasmine from "../assets/FRAGRANTPLANTS/Orange Jasmine.jpg";
import mograJasmine from "../assets/FRAGRANTPLANTS/mogra flower.jpg";
import tuberose from "../assets/FRAGRANTPLANTS/tuberose_flowers.jpg";

import { plantProducts } from "../PAGES/Plants";

export const getItemImage = (item) => {
  // 1. Direct valid image string on item
  if (item?.image && typeof item.image === 'string' && item.image.trim() !== '' && !item.image.includes('placeholder')) {
    return item.image;
  }

  const name = (item?.name || '').toLowerCase();

  // 2. Direct catalog match from plantProducts array by name or ID
  if (plantProducts && Array.isArray(plantProducts)) {
    const match = plantProducts.find(p => 
      (p.name && p.name.toLowerCase() === name) || 
      p.id === item?.product || 
      p.id === item?._id
    );
    if (match && match.image) {
      return match.image;
    }
  }

  // 3. Keyword asset fallback mappings
  if (name.includes('star jasmine') || (name.includes('jasmine') && name.includes('climber'))) {
    return starJasmine;
  }
  if (name.includes('orange jasmine') || name.includes('kamini')) {
    return orangeJasmine;
  }
  if (name.includes('mogra') || name.includes('fragrant plant')) {
    return mograJasmine;
  }
  if (name.includes('tuberose') || name.includes('rajanigandha')) {
    return tuberose;
  }
  if (name.includes('wisteria') || (name.includes('vine') && name.includes('flowering'))) {
    return wisteriaVine;
  }
  if (name.includes('honeysuckle')) {
    return honeysuckle;
  }
  if (name.includes('bougainvillea') || name.includes('creeper')) {
    return bougainvillea;
  }
  if (name.includes('black rose') || name.includes('rose') || name.includes('shrub')) {
    return snakePlant;
  }
  if (name.includes('avocado') || name.includes('tree')) {
    return avocado;
  }
  if (name.includes('snake') || name.includes('sansevieria')) {
    return snakePlant;
  }
  if (name.includes('succulent') || name.includes('crassula') || name.includes('haworthia')) {
    return haworthiaImg;
  }
  if (name.includes('rubber') || name.includes('ficus') || name.includes('dark')) {
    return rubberPlant;
  }
  if (name.includes('palm') || name.includes('parlor')) {
    return parlorPalm;
  }
  if (name.includes('anthurium')) {
    return Anthurium;
  }
  if (name.includes('lily') || name.includes('spathiphyllum')) {
    return peaceLily;
  }

  // 4. Deterministic hash fallback
  const imageList = [starJasmine, wisteriaVine, orangeJasmine, peaceLily, rubberPlant, avocado, succulent, parlorPalm, Anthurium, haworthiaImg, bougainvillea];
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return imageList[charCodeSum % imageList.length];
};

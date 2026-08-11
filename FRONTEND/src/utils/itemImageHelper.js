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

import cac1 from "../assets/catus/image.png";
import fr1 from "../assets/fruitplants/image.png";

import { plantProducts } from "../PAGES/Plants";

export const getItemImage = (item) => {
  const name = (item?.name || item?.product?.name || '').toLowerCase();

  // 1. High-priority keyword asset overrides (e.g. Golden Barrel Cactus)
  if (name.includes('golden barrel') || name.includes('cactus') || name.includes('catus') || name.includes('barrel')) {
    return cac1;
  }
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
  if (name.includes('mango') || name.includes('fruit')) {
    return fr1;
  }

  // 2. Direct catalog match from plantProducts array by name or ID
  if (plantProducts && Array.isArray(plantProducts)) {
    const match = plantProducts.find(p => 
      (p.name && p.name.toLowerCase() === name) || 
      (p.name && p.name.toLowerCase().includes(name)) ||
      (name && name.includes((p.name || '').toLowerCase())) ||
      p.id === item?.product || 
      p.id === item?._id ||
      p.id === item?.product?._id
    );
    if (match && match.image) {
      return match.image;
    }
  }

  // 3. Direct valid image string on item
  if (item?.image && typeof item.image === 'string' && item.image.trim() !== '' && !item.image.includes('placeholder')) {
    return item.image;
  }
  
  if (Array.isArray(item?.images) && item.images.length > 0) {
    const firstImg = item.images[0]?.url || item.images[0];
    if (typeof firstImg === 'string' && firstImg.trim() !== '' && !firstImg.includes('placeholder')) {
      return firstImg;
    }
  }

  if (item?.product) {
    if (typeof item.product.image === 'string' && item.product.image.trim() !== '') {
      return item.product.image;
    }
    if (Array.isArray(item.product.images) && item.product.images.length > 0) {
      const prodImg = item.product.images[0]?.url || item.product.images[0];
      if (typeof prodImg === 'string' && prodImg.trim() !== '') {
        return prodImg;
      }
    }
  }

  // 4. Fallback default
  return cac1;
};

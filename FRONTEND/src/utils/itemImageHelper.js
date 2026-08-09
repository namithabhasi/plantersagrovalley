import haworthiaImg from "../assets/Haworthia.jpg";
import Anthurium from "../assets/Anthurium.png";
import peaceLily from "../assets/Peace Lily (Spathiphyllum).jpg";
import succulent from "../assets/Crassula Ovata Green Succulent.jpg";
import snakePlant from "../assets/Golden Hahnii Snake Plant Seeds Sansevieria Birds Nest.jpg";
import rubberPlant from "../assets/_dark leaf rubber plant (ficus elastica) - indoor decorative tree_.jpg";
import parlorPalm from "../assets/Indoors_ Discover the Timeless Elegance of the Parlor Palm.jpg";
import avocado from "../assets/From Seed to Tree_ The Beauty of Home-Grown Organic Avocado.jpg";

export const getItemImage = (item) => {
  if (item?.image && typeof item.image === 'string' && item.image.trim() !== '' && !item.image.includes('placeholder')) {
    return item.image;
  }

  const name = (item?.name || '').toLowerCase();
  
  if (name.includes('black rose') || name.includes('rose') || name.includes('shrub')) {
    return snakePlant;
  }
  if (name.includes('wisteria') || name.includes('vine') || name.includes('flowering')) {
    return peaceLily;
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

  // Consistent index-based fallback using item name character hash so every distinct product name gets a unique picture
  const imageList = [snakePlant, peaceLily, rubberPlant, avocado, succulent, parlorPalm, Anthurium, haworthiaImg];
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return imageList[charCodeSum % imageList.length];
};

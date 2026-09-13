import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../redux/auth/authSlice';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import axios from '../api/axiosInstance';
import './Suggestions.css';
import { 
  FiMapPin, FiSun, FiDroplet, FiCloudRain, FiWind, 
  FiCheckCircle, FiTruck, FiHeart, FiShoppingCart, 
  FiNavigation, FiArrowRight, FiClock 
} from 'react-icons/fi';
import { FaSeedling, FaStar, FaLeaf, FaMagic } from 'react-icons/fa';

// Product Image Assets - 8 Distinct Real Plant Images & Hero Background
import heroBgImg from '../assets/hero-green-bg.jpg';
import robotGif from '../assets/cute_robot_watering_plant.gif';
import anthuriumImg from '../assets/Anthurium.png';
import snakePlantImg from '../assets/Golden Hahnii Snake Plant Seeds Sansevieria Birds Nest.jpg';
import peaceLilyImg from '../assets/Peace Lily (Spathiphyllum).jpg';
import birdOfParadiseImg from '../assets/BIRD OF PARADISE (1).jpg';
import rubberPlantImg from '../assets/_dark leaf rubber plant (ficus elastica) - indoor decorative tree_.jpg';
import crassulaImg from '../assets/Crassula Ovata Green Succulent.jpg';
import haworthiaImg from '../assets/Haworthia.jpg';
import palmImg from '../assets/Indoors_ Discover the Timeless Elegance of the Parlor Palm.jpg';

// 8 Curated Climate Recommendation Benchmark Plants (Strictly 2 Rows on Desktop Grid)
const defaultClimatePlants = [
  {
    _id: 'rec-plant-1',
    name: 'Anthurium Pink Plant',
    price: 399,
    salePrice: 349,
    rating: 4.8,
    reviewsCount: 120,
    climateBadge: 'Best for Your Climate',
    sunlight: 'Partial shade',
    water: 'Moderate water',
    image: anthuriumImg
  },
  {
    _id: 'rec-plant-2',
    name: 'Bird of Paradise',
    price: 699,
    salePrice: 599,
    rating: 4.9,
    reviewsCount: 145,
    climateBadge: 'Tropical Favorite',
    sunlight: 'Full sun',
    water: 'Regular water',
    image: birdOfParadiseImg
  },
  {
    _id: 'rec-plant-3',
    name: 'Golden Hahnii Snake Plant',
    price: 349,
    salePrice: 299,
    rating: 4.8,
    reviewsCount: 156,
    climateBadge: 'Air Purifying',
    sunlight: 'Low light',
    water: 'Low water',
    image: snakePlantImg
  },
  {
    _id: 'rec-plant-4',
    name: 'Peace Lily Spathiphyllum',
    price: 399,
    salePrice: 329,
    rating: 4.7,
    reviewsCount: 110,
    climateBadge: 'Indoor Blossom',
    sunlight: 'Partial shade',
    water: 'Moderate water',
    image: peaceLilyImg
  },
  {
    _id: 'rec-plant-5',
    name: 'Ficus Rubber Plant',
    price: 499,
    salePrice: 429,
    rating: 4.9,
    reviewsCount: 210,
    climateBadge: 'Popular Choice',
    sunlight: 'Bright indirect light',
    water: 'Moderate water',
    image: rubberPlantImg
  },
  {
    _id: 'rec-plant-6',
    name: 'Parlor Palm Indoor Plant',
    price: 449,
    salePrice: 379,
    rating: 4.8,
    reviewsCount: 95,
    climateBadge: 'Air Purifying',
    sunlight: 'Low light',
    water: 'Moderate water',
    image: palmImg
  },
  {
    _id: 'rec-plant-7',
    name: 'Crassula Ovata Jade',
    price: 299,
    salePrice: 249,
    rating: 4.7,
    reviewsCount: 88,
    climateBadge: 'Easy to Grow',
    sunlight: 'Full sun',
    water: 'Low water',
    image: crassulaImg
  },
  {
    _id: 'rec-plant-8',
    name: 'Zebra Haworthia Succulent',
    price: 279,
    salePrice: 219,
    rating: 4.6,
    reviewsCount: 76,
    climateBadge: 'Compact Desk Plant',
    sunlight: 'Bright indirect light',
    water: 'Low water',
    image: haworthiaImg
  }
];

function Suggestions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const { user } = useSelector((state) => state.auth);

  // Location State - Default to North Paravur (683513)
  const [pincode, setPincode] = useState(() => localStorage.getItem('planters_user_pincode') || '683513');
  const [locationName, setLocationName] = useState(() => localStorage.getItem('planters_user_city') || 'North Paravur, Ernakulam, Kerala');
  const [inputPincode, setInputPincode] = useState(pincode);
  const [coords, setCoords] = useState({ lat: 10.1425, lon: 76.2312 });
  
  // Real-time Weather State
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    condition: 'Partly cloudy',
    humidity: 82,
    rainfall: '10 mm',
    tempRange: '26°C - 30°C',
    soilType: 'Loamy Soil',
    climateTitle: 'Tropical Humid Climate',
    climateDesc: 'Warm temperatures with high humidity and good rainfall. Ideal for a wide range of tropical and subtropical plants.',
    updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    loading: true
  });

  // Recommended Products State - 8 Items (2 Rows)
  const [displayProducts, setDisplayProducts] = useState(defaultClimatePlants);
  const [wishlist, setWishlist] = useState([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // 1. Fetch Location Coordinates & City from Pincode
  const fetchLocationFromPincode = async (targetPin) => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${targetPin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const city = po.District || po.Name || 'North Paravur';
        const state = po.State || 'Kerala';
        const formattedLoc = `${city}${state ? ', ' + state : ''}`;
        
        setLocationName(formattedLoc);
        setPincode(targetPin);
        localStorage.setItem('planters_user_pincode', targetPin);
        localStorage.setItem('planters_user_city', formattedLoc);

        geocodeCity(`${city}, ${state}, India`);
      } else {
        const formattedLoc = targetPin === '683513' ? 'North Paravur, Ernakulam, Kerala' : `PIN ${targetPin}`;
        setLocationName(formattedLoc);
        setPincode(targetPin);
        localStorage.setItem('planters_user_pincode', targetPin);
        localStorage.setItem('planters_user_city', formattedLoc);
        fetchWeatherData(10.1425, 76.2312, formattedLoc);
      }
    } catch (err) {
      console.error('Pincode fetch error:', err);
    }
  };

  // 2. Geocode City Name to Lat/Lon via Nominatim
  const geocodeCity = async (cityName) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoords({ lat, lon });
        fetchWeatherData(lat, lon, cityName);
      } else {
        fetchWeatherData(10.1425, 76.2312, cityName);
      }
    } catch (e) {
      fetchWeatherData(10.1425, 76.2312, cityName);
    }
  };

  // 3. Fetch Real-time Weather from Open-Meteo API
  const fetchWeatherData = async (lat, lon, locLabel) => {
    setWeatherData((prev) => ({ ...prev, loading: true }));
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.current) {
        const currentTemp = Math.round(data.current.temperature_2m);
        const humidity = Math.round(data.current.relative_humidity_2m);
        const weatherCode = data.current.weather_code;

        const minTemp = data.daily?.temperature_2m_min ? Math.round(data.daily.temperature_2m_min[0]) : currentTemp - 2;
        const maxTemp = data.daily?.temperature_2m_max ? Math.round(data.daily.temperature_2m_max[0]) : currentTemp + 2;
        const rainfallSum = data.daily?.precipitation_sum ? Math.round(data.daily.precipitation_sum.reduce((a, b) => a + b, 0)) : 10;

        let conditionText = 'Partly cloudy';
        if (weatherCode === 0) conditionText = 'Clear & Sunny';
        else if ([1, 2, 3].includes(weatherCode)) conditionText = 'Partly cloudy';
        else if ([45, 48].includes(weatherCode)) conditionText = 'Foggy & Hazy';
        else if (weatherCode >= 51 && weatherCode <= 67) conditionText = 'Light Rain';
        else if (weatherCode >= 80 && weatherCode <= 82) conditionText = 'Rain Showers';
        else if (weatherCode >= 95) conditionText = 'Thunderstorm';

        let climateTitle = 'Tropical Humid Climate';
        let climateDesc = 'Warm temperatures with high humidity and good rainfall. Ideal for a wide range of tropical and subtropical plants.';
        let soil = 'Loamy Soil';

        if (humidity > 75 && currentTemp > 26) {
          climateTitle = 'Tropical Humid Climate';
          climateDesc = 'Warm temperatures with high humidity and good rainfall. Ideal for a wide range of tropical and subtropical plants.';
          soil = 'Loamy Soil';
        } else if (currentTemp > 31) {
          climateTitle = 'Warm Arid Climate';
          climateDesc = 'High ambient temperatures with moderate humidity. Excellent for succulents, hardy trees, and drought-tolerant foliage.';
          soil = 'Sandy Loam';
        } else if (currentTemp < 20) {
          climateTitle = 'Cool Subtropical Climate';
          climateDesc = 'Mild temperatures with cool breeze. Perfect for temperate flowers, indoor foliage, and winter crops.';
          soil = 'Black Clay Soil';
        }

        setWeatherData({
          temp: currentTemp,
          condition: conditionText,
          humidity: humidity,
          rainfall: `${rainfallSum} mm`,
          tempRange: `${minTemp}°C - ${maxTemp}°C`,
          soilType: soil,
          climateTitle: climateTitle,
          climateDesc: climateDesc,
          updatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          loading: false
        });
      } else {
        setWeatherData((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Weather API fetch error:', error);
      setWeatherData((prev) => ({ ...prev, loading: false }));
    }
  };

  // 4. Detect GPS Location via Browser Geolocation API
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setPincodeError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    setPincodeError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setCoords({ lat, lon });

          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();

          const detectedPin = data.address?.postcode?.replace(/\s+/g, '').slice(0, 6) || pincode;
          const city = data.address?.city || data.address?.town || data.address?.state_district || 'My Location';
          const state = data.address?.state || '';
          const locStr = `${city}${state ? ', ' + state : ''}`;

          setPincode(detectedPin);
          setInputPincode(detectedPin);
          setLocationName(locStr);
          localStorage.setItem('planters_user_pincode', detectedPin);
          localStorage.setItem('planters_user_city', locStr);

          fetchWeatherData(lat, lon, locStr);
        } catch (e) {
          setPincodeError('Could not resolve location address. Please enter pincode.');
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        setGeoLoading(false);
        setPincodeError('Location access denied or unavailable. Please enter pincode manually.');
      }
    );
  };

  // 5. Submit Pincode
  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (!inputPincode || !/^\d{6}$/.test(inputPincode.trim())) {
      setPincodeError('Please enter a valid 6-digit Indian Pincode.');
      return;
    }
    setPincodeError('');
    fetchLocationFromPincode(inputPincode.trim());
  };

  // 6. Fetch Store Products (Preserving Distinct Real Plant Images)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        if (data && data.success && Array.isArray(data.products) && data.products.length >= 8) {
          const enriched = data.products.slice(0, 8).map((p, idx) => ({
            ...p,
            climateBadge: defaultClimatePlants[idx % defaultClimatePlants.length].climateBadge,
            sunlight: p.sunlight || defaultClimatePlants[idx % defaultClimatePlants.length].sunlight,
            water: p.waterRequirement || defaultClimatePlants[idx % defaultClimatePlants.length].water,
            rating: p.averageRating || p.rating || 4.8,
            reviewsCount: p.numOfReviews || (85 + idx * 15),
            // Prefer valid remote image URL, otherwise preserve each item's unique imported asset picture
            image: (p.images?.[0]?.url && p.images[0].url.startsWith('http')) 
              ? p.images[0].url 
              : defaultClimatePlants[idx % defaultClimatePlants.length].image
          }));
          setDisplayProducts(enriched);
        }
      } catch (err) {
        console.error('Using curated 8-plant recommendation set:', err);
      }
    };

    fetchLocationFromPincode(pincode);
    loadProducts();
  }, []);

  const toggleWishlist = (id) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProductAddToCart = (product) => {
    if (!user) {
      toast.info("Please sign in or register to add items to your cart!");
      sessionStorage.setItem('pendingAddToCart', JSON.stringify(product));
      sessionStorage.setItem('postLoginRedirect', '/cart');
      navigate('/signin');
    } else {
      addToCart(product, 1);
      toast.success(`🛒 ${product.name || 'Product'} added to your cart!`);
    }
  };

  return (
    <div className="suggestions-page-wrapper" style={{ backgroundColor: '#ffffff' }}>
      
      {/* SECTION 1: HERO & WEATHER DASHBOARD (Pure White BG) */}
      <section style={{ backgroundColor: '#ffffff', paddingTop: '20px', paddingBottom: '36px' }}>
        <div className="container">
          <div className="suggestions-hero-container">
            
            {/* Left Title Block with hero-green-bg.jpg Background */}
            <div 
              className="suggestions-hero-left"
              style={{ 
                backgroundImage: `url("${heroBgImg}")`
              }}
            >
              <span style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#86efac', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(4px)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', display: 'inline-block', width: 'fit-content', padding: '4px 10px', marginBottom: '12px' }}>
                GROW SMARTER
              </span>
              <h1 style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '32px', fontWeight: 300, color: '#ffffff', lineHeight: 1.2, letterSpacing: '0.6px', textTransform: 'uppercase', margin: '0 0 12px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Plants that<br />love your place
              </h1>
              <p style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '15px', color: '#f1f5f9', fontWeight: 400, lineHeight: 1.5, maxWidth: '380px', margin: 0, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                Get plant recommendations based on your local climate and growing conditions.
              </p>
            </div>

            {/* Right Weather Dashboard Card */}
            <div className="suggestions-weather-card">
              
              {/* Location Header Row */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FiMapPin color="#06492D" size={22} style={{ flexShrink: 0 }} />
                  <div>
                    <h2 style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '20px', fontWeight: 500, color: '#06492D', margin: 0, lineHeight: 1.25, textTransform: 'uppercase' }}>
                      {locationName.toUpperCase()}
                    </h2>
                    <p style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '11px', color: '#64748b', fontWeight: 500, margin: '2px 0 0 0' }}>
                      Updated today, {weatherData.updatedTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* PINCODE FORM & USE GPS BUTTON */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <form onSubmit={handlePincodeSubmit} style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode (e.g. 683513)"
                    value={inputPincode}
                    onChange={(e) => setInputPincode(e.target.value.replace(/\D/g, ''))}
                    style={{
                      flex: '1 1 180px',
                      padding: '8px 12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontFamily: "var(--font-family-base, 'Assistant', sans-serif)",
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      borderRadius: '0px'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 20px',
                      backgroundColor: '#06492D',
                      color: '#ffffff',
                      border: 'none',
                      fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)",
                      fontWeight: 600,
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      borderRadius: '0px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                  >
                    CHECK
                  </button>
                </form>

                {/* Dotted GPS Button */}
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={geoLoading}
                  style={{
                    width: '100%',
                    padding: '7px 12px',
                    border: '1px dashed #06492D',
                    backgroundColor: '#f0fdf4',
                    color: '#06492D',
                    fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)",
                    fontWeight: 600,
                    fontSize: '12px',
                    borderRadius: '0px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <FiNavigation size={14} />
                  <span>{geoLoading ? 'Detecting Location...' : 'Use My Current Location'}</span>
                </button>

                {pincodeError && (
                  <p style={{ color: '#dc2626', fontSize: '11px', fontWeight: 600, margin: 0 }}>{pincodeError}</p>
                )}
              </div>

              {/* 5 Weather Metric Boxes */}
              <div className="suggestions-weather-grid">
                
                {/* Temp & Condition */}
                <div className="suggestions-metric-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <FiSun color="#f59e0b" size={14} />
                    <span style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{weatherData.temp}°C</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '10px', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>{weatherData.condition}</span>
                </div>

                {/* Humidity */}
                <div className="suggestions-metric-box">
                  <FiDroplet color="#0ea5e9" size={14} />
                  <span style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{weatherData.humidity}%</span>
                  <span style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Humidity</span>
                </div>

                {/* Rainfall */}
                <div className="suggestions-metric-box">
                  <FiCloudRain color="#3b82f6" size={14} />
                  <span style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{weatherData.rainfall}</span>
                  <span style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Rainfall</span>
                </div>

                {/* Temp Range */}
                <div className="suggestions-metric-box">
                  <FiWind color="#0d9488" size={14} />
                  <span style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{weatherData.tempRange}</span>
                  <span style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Temp</span>
                </div>

                {/* Soil Type */}
                <div className="suggestions-metric-box">
                  <FaSeedling color="#059669" size={14} />
                  <span style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>{weatherData.soilType}</span>
                  <span style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Soil</span>
                </div>

              </div>

              {/* Climate Classification Box */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '0px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#06492D', color: '#ffffff', borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaLeaf size={14} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '15px', fontWeight: 500, color: '#06492D', margin: '0 0 2px 0' }}>
                    {weatherData.climateTitle}
                  </h4>
                  <p style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '12px', color: '#166534', fontWeight: 500, lineHeight: 1.3, margin: 0 }}>
                    {weatherData.climateDesc}
                  </p>
                </div>
              </div>

              {/* Delivery Info Sub-Card */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '0px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontWeight: 600, color: '#0f172a' }}>
                    <FiTruck color="#06492D" size={16} />
                    <span>Delivery to {locationName.toUpperCase()} ({pincode})</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", backgroundColor: '#06492D', color: '#ffffff', fontSize: '10px', fontWeight: 600, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ACTIVE
                  </span>
                </div>

                <div className="suggestions-delivery-badges">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiTruck color="#06492D" size={13} />
                    <span>Standard 2-3 Days</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheckCircle color="#06492D" size={13} />
                    <span>COD Available</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiCheckCircle color="#06492D" size={13} />
                    <span>Free Shipping &gt; ₹499</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: RECOMMENDED FOR YOUR CLIMATE (Soft Light Green BG) */}
      <section style={{ backgroundColor: 'var(--color-primary-bg, #f3f8f3)', paddingTop: '44px', paddingBottom: '52px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h3 
              className="section-title" 
              style={{ 
                fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", 
                fontSize: '28px', 
                fontWeight: 300, 
                letterSpacing: '0.6px', 
                textTransform: 'uppercase', 
                color: '#06492D', 
                margin: '0 0 6px 0', 
                textAlign: 'center' 
              }}
            >
              Recommended for Your Climate
            </h3>
            <p 
              style={{ 
                fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#475569', 
                maxWidth: '680px', 
                margin: '0 auto 12px auto',
                textAlign: 'center'
              }}
            >
              These plants grow well in {locationName.split(',')[0].toUpperCase()}'s climate. Explore our wide variety of indoor, flowering, bonsai, and fruit plants.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link 
                to="/plants" 
                className="section-header-link suggestions-sec2-header-link" 
                style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", textTransform: 'none', fontWeight: 600, fontSize: '14px', color: '#06492D' }}
              >
                View All Plants &rarr;
              </Link>
            </div>
          </div>

          {/* Global product-grid: Displays Exactly 8 Items (Strictly 2 Rows of 4 Cards on Desktop) */}
          <div className="product-grid">
            {displayProducts.slice(0, 8).map((product) => {
              const hasDiscount = product.salePrice && product.salePrice < product.price;
              const originalPrice = hasDiscount ? product.price : null;
              const displayPrice = hasDiscount ? product.salePrice : product.price;
              const rating = product.rating || 4.8;

              return (
                <div key={product._id || product.name} className="product-card-wrapper">
                  <div className="product-card" style={{ flexGrow: 1, borderRadius: '0px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    
                    {/* Climate Badge */}
                    <span 
                      className="card-badge" 
                      style={{ backgroundColor: '#ffffff99', backdropFilter: 'blur(4px)', color: '#06492D', border: '1px solid #cbd5e1', textTransform: 'none', fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '11px', fontWeight: 600, borderRadius: '0px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '0px' }}></span>
                      {product.climateBadge}
                    </span>

                    {/* Product Card Image */}
                    <div className="product-card-image" style={{ borderRadius: '0px' }}>
                      <img src={product.image} alt={product.name} />
                    </div>

                    {/* Card Content Details */}
                    <div className="product-card-content" style={{ padding: '16px' }}>
                      <h4 className="product-title" title={product.name} style={{ fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '15px', fontWeight: 500, color: '#1F2937' }}>
                        {product.name}
                      </h4>

                      <div className="product-price-row" style={{ marginTop: 'auto', marginBottom: '8px', fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)" }}>
                        {originalPrice ? (
                          <>
                            <span className="price-original">Rs. {originalPrice}.00</span>
                            <span className="price-current sale" style={{ fontWeight: 600 }}>Rs. {displayPrice}.00</span>
                          </>
                        ) : (
                          <span className="price-current" style={{ fontWeight: 600 }}>Rs. {displayPrice}.00</span>
                        )}
                      </div>

                      {/* Stars Rating */}
                      <div className="product-rating" style={{ marginBottom: '10px', gap: '2px', alignItems: 'center' }}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            color={i < Math.floor(rating) ? 'var(--color-gold)' : '#e2e8f0'}
                            size={13}
                          />
                        ))}
                        <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px', fontWeight: 600 }}>
                          ({product.reviewsCount})
                        </span>
                      </div>

                      {/* Care info tags */}
                      <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiSun color="#f59e0b" size={13} />
                          <span className="truncate">{product.sunlight}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiDroplet color="#0ea5e9" size={13} />
                          <span className="truncate">{product.water}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Add to Cart Button matching Home.jsx */}
                  <button
                    onClick={() => handleProductAddToCart(product)}
                    className="btn btn-primary"
                    style={{ borderRadius: '0px', fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", fontSize: '12px', padding: '12px 14px', fontWeight: 600, display: 'flex', alignItems: 'center', justify: 'center', gap: '8px', letterSpacing: '0.5px' }}
                  >
                    <FiShoppingCart size={14} />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 3: NOT SURE WHAT TO GROW? CTA (PURE WHITE BG, NO BORDER, ROBOT GIF HIGHER & TALLER) */}
      <section style={{ backgroundColor: '#ffffff', paddingTop: '36px', paddingBottom: '36px' }}>
        <div className="container">
          <div className="suggestions-notsure-box">
            
            <div className="suggestions-notsure-content">
              <img 
                src={robotGif} 
                alt="Agro Robot Assistant" 
                className="suggestions-robot-gif"
              />
              <div>
                <h3 
                  style={{ 
                    fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", 
                    fontSize: '24px', 
                    fontWeight: 300, 
                    letterSpacing: '0.6px', 
                    textTransform: 'uppercase', 
                    color: '#06492D', 
                    margin: '0 0 6px 0', 
                    lineHeight: 1.2 
                  }}
                >
                  NOT SURE WHAT TO GROW?
                </h3>
                <p style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontSize: '14px', color: '#475569', fontWeight: 400, margin: 0, lineHeight: 1.5 }}>
                  Tell us your space and purpose to get a personalized garden kit tailored to your location.
                </p>
              </div>
            </div>

            <div className="suggestions-notsure-btn-wrap">
              <Link
                to="/custom-plant"
                className="btn btn-primary"
                style={{ 
                  position: 'relative',
                  borderRadius: '0px', 
                  padding: '14px 28px', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)",
                  fontWeight: 600,
                  fontSize: '13px',
                  letterSpacing: '0.5px',
                  background: 'linear-gradient(135deg, #06492D 0%, #16a34a 50%, #052e1d 100%)',
                  color: '#ffffff',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(6, 73, 45, 0.35)',
                  overflow: 'visible'
                }}
              >
                {/* Glowing Stars Decorative Overlay */}
                <div style={{ position: 'absolute', top: '-10px', right: '-8px', display: 'flex', alignItems: 'flex-start', pointerEvents: 'none', zIndex: 10 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#FACC15" style={{ filter: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.9))' }}>
                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                  </svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FACC15" style={{ marginTop: '6px', marginLeft: '-4px', filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.9))' }}>
                    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                  </svg>
                </div>

                <FaMagic size={14} color="#FACC15" style={{ filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.8))' }} />
                <span>BUILD YOUR GARDEN KIT</span>
                <FiArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: PLANTERS AGRO VALLEY EXPERIENCE CENTER & MAP (Soft Light Green BG) */}
      <section style={{ backgroundColor: 'var(--color-primary-bg, #f3f8f3)', paddingTop: '44px', paddingBottom: '60px', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="suggestions-experience-container">
            <div className="suggestions-experience-row">
              
              {/* Left Column: Interactive Google Map Embed */}
              <div className="suggestions-map-col">
                <iframe
                  title="Planters Agro Valley Location Map"
                  src="https://maps.google.com/maps?q=Planters+Agro+Valley,+Ernakulam,+Kerala,+India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '340px', width: '100%', display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              {/* Right Column: In-House Store Invitation Details */}
              <div className="suggestions-experience-details">
                <span 
                  style={{ 
                    fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", 
                    backgroundColor: '#f0fdf4', 
                    color: '#06492D', 
                    border: '1px solid #bbf7d0', 
                    fontWeight: 600, 
                    fontSize: '11px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.2px', 
                    display: 'inline-block', 
                    width: 'fit-content', 
                    padding: '4px 10px', 
                    marginBottom: '12px' 
                  }}
                >
                  VISIT OUR IN-HOUSE NURSERY
                </span>

                <h3 
                  style={{ 
                    fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", 
                    fontSize: '24px', 
                    fontWeight: 300, 
                    letterSpacing: '0.6px', 
                    textTransform: 'uppercase', 
                    color: '#06492D', 
                    margin: '0 0 12px 0', 
                    lineHeight: 1.25 
                  }}
                >
                  PLANTERS AGRO VALLEY EXPERIENCE CENTER
                </h3>

                <p 
                  style={{ 
                    fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", 
                    fontSize: '14px', 
                    color: '#475569', 
                    fontWeight: 400, 
                    lineHeight: 1.6, 
                    margin: '0 0 20px 0' 
                  }}
                >
                  Step into our lush green paradise! Explore over 1,000+ live plant species, custom planter setups, organic soils, and get expert face-to-face consultation from our resident horticulturists.
                </p>

                {/* Store Address & Contact Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '13px', color: '#1f2937' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiMapPin color="#06492D" size={18} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontWeight: 600 }}>
                      Planters Agro Valley, Ernakulam, Kerala, India
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiClock color="#06492D" size={18} style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "var(--font-family-base, 'Assistant', sans-serif)", fontWeight: 500 }}>
                      Open Daily: 10:00 AM - 6:00 PM (Monday - Saturday)
                    </span>
                  </div>
                </div>

                {/* Action Button: Get Directions */}
                <div>
                  <a
                    href="https://maps.google.com/?q=Planters+Agro+Valley,+Ernakulam,+Kerala,+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ 
                      borderRadius: '0px', 
                      padding: '12px 24px', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontFamily: "var(--font-family-heading, 'Poppins', sans-serif)", 
                      fontWeight: 600, 
                      fontSize: '12px', 
                      letterSpacing: '0.5px', 
                      backgroundColor: '#06492D',
                      color: '#ffffff'
                    }}
                  >
                    <FiNavigation size={14} />
                    <span>GET DIRECTIONS TO STORE</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Suggestions;

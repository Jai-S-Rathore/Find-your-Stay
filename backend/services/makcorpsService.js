const axios = require('axios');

async function getHotelComparison(hotelName, city) {
  const options = {
    method: 'GET',
    url: `https://${process.env.MAKCORPS_HOST}/hotel`,
    params: {
      name: hotelName,
      location: city,
      cur: 'INR' // You can change this to 'USD' if needed
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': process.env.MAKCORPS_HOST
    }
  };

  try {
    const response = await axios.request(options);
    // Makcorps usually returns a 'comparison' array with vendor names and prices
    return response.data; 
  } catch (error) {
    console.error("Makcorps API Error:", error.response ? error.response.data : error.message);
    return null;
  }
}

module.exports = { getHotelComparison };
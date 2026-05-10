const express = require("express");

const app = express();

const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
const { initializeDatabase } = require("./db/db.connect");

const Hotel = require("./models/hotel.models");

initializeDatabase();

const newHotel = {
  name: "New Hotel 1",
  category: ["Resort"],
  location: "222 Main Street, Sheen Town",
  rating: 3.5,
  reviews: [],
  website: "https://dresort-example.com",
  phoneNumber: "+1673552392",
  checkInTime: "2:00 PM",
  checkOutTime: "11:00 AM",
  amenities: [
    "Room Service",
    "Horse riding",
    "Boating",
    "Kids Play Area",
    "Bar",
  ],
  priceRange: "$$ (11-30)",
  reservationsNeeded: true,
  isParkingAvailable: true,
  isWifiAvailable: true,
  isPoolAvailable: true,
  isSpaAvailable: true,
  isRestaurantAvailable: true,
  photos: [
    "https://example.com/newhotel1-photo1.jpg",
    "https://example.com/newhotel1-photo2.jpg",
  ],
};

async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);

    const savedHotel = await hotel.save();

    console.log("New Hotel data:", savedHotel);

    return savedHotel;
  } catch (error) {
    throw error;
  }
}

//####BE4.2_HW2###
//1. Create an API with route "/hotels" to create a new hotel data in the Database. Test your API with Postman.

app.post("/hotels", async (req, res) => {
  try {
    const savedHotel = await createHotel(req.body);
    res
      .status(201)
      .json({ message: "Hotel added successfully.", hotel: savedHotel });
  } catch (error) {
    res.status(500).json({ error: "Error to add hotel." });
  }
});

//1. Create an API with route "/hotels" to read all hotels from the Database. Test your API with Postman.

async function findAllHotels() {
  try {
    const allHotels = await Hotel.find();
    //console.log(allHotels);
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const allHotels = await findAllHotels();
    if (allHotels) {
      res.json(allHotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load hotels." });
  }
});

//2. Create an API with route "/hotels/:hotelName" to read a hotel by its name. Test your API with Postman.

async function findHotelByName(hotelName) {
  try {
    const hotel = await Hotel.findOne({ name: hotelName });
    //console.log(hotel);
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await findHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load hotel." });
  }
});

//3. Create an API with route "/hotels/directory/:phoneNumber" to read a hotel by phone number. Test your API with Postman.

async function findHotelByPhone(phoneNumber) {
  try {
    const hotelByPhoneNumber = await Hotel.findOne({
      phoneNumber: phoneNumber,
    });
    //console.log(hotelByPhoneNumber);
    return hotelByPhoneNumber;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await findHotelByPhone(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load hotel." });
  }
});

//4. Create an API with route "/hotels/rating/:hotelRating" to read all hotels by rating. Test your API with Postman.

async function findHotelsByRating(rating) {
  try {
    const hotelsByRating = await Hotel.find({ rating: rating });
    //console.log(hotelsByRating);
    return hotelsByRating;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await findHotelsByRating(req.params.hotelRating);
    if (hotels.length != 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ error: "Hotels not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to load hotel." });
  }
});

//5. Create an API with route "/hotels/category/:hotelCategory" to read all hotels by category. Test your API with Postman.

async function findHotelsByCategory(category) {
  try {
    const hotelsByCategory = await Hotel.find({ category: category });
    //console.log(hotelsByCategory);
    return hotelsByCategory;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await findHotelsByCategory(req.params.hotelCategory);
    if (hotels.length != 0) {
      res.status(200).json(hotels);
    } else {
      res.status(404).json({ error: "No hotels found." });
    }
  } catch (error) {
    res.status(500).json({ error: "No hotels found." });
  }
});

//####BE4.3_HW2####

async function deleteHotel(hotelId) {
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    return deletedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotel(req.params.hotelId);
    if (deletedHotel) {
      res
        .status(200)
        .json({ message: "Hotel deleted successfully.", hotel: deletedHotel });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel." });
  }
});

// ###BE4.4_HW2###
//1. Create an API to update a hotel data by their ID in the Database. Update the rating of an existing hotel. Test your API with Postman.

async function updateHotelById(hotelId, dateToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dateToUpdate, {
      returnDocument: "after",
    });
    console.log(updatedHotel);
    return updatedHotel;
  } catch (error) {
    console.log(error);
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelById(req.params.hotelId, req.body);
    if (updatedHotel) {
      res.status(200).json({
        message: "Hotel updated successfully.",
        updatedHotel: updatedHotel,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel." });
  }
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Admin = require('./models/Admin.js');
const Ride = require('./models/Ride.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const cloudinary = require('cloudinary').v2;
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime-types');
const axios = require('axios');


require('dotenv').config();
const app = express();
mongoose.set('strictQuery', false);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const bucket = 'dawid-booking-app';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173','http://localhost:5000']
}));
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.get('/get-coordinates', async (req, res) => {
  const { placeName } = req.query;

  if (!placeName) {
    return res.status(400).json({ error: 'Invalid place name' });
  }

  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`);

    if (response.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const coordinates = {
      latitude: response.data[0].lat,
      longitude: response.data[0].lon,
    };

    console.log('Coordinates:', coordinates);
    res.json(coordinates);
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    res.status(500).json({ error: 'Failed to fetch coordinates' });
  }
});

app.get('/get-place-name', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );

    const placeName = response.data.display_name;
    console.log('Place Name:', placeName);
    res.json({ placeName });
  } catch (error) {
    console.error('Error fetching place name:', error.message);
    res.status(500).json({ error: 'Failed to fetch place name' });
  }
});




app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;

  try {
    const result = await cloudinary.uploader.upload(link);
    res.json(result.secure_url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Middleware to handle file uploads
const photosMiddleware = multer({ dest: '/tmp/uploads/' });

// Endpoint to upload images from a file
app.post('/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const file = req.files[i];

    try {
      const result = await cloudinary.uploader.upload(file.path);
      uploadedFiles.push(result.secure_url);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }

  res.json(uploadedFiles);
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/test', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { nom, prenom, gender, phone, datenaissance, email, password } = req.body;

  try {
    const userDoc = await User.create({
      nom,
      prenom,
      gender,
      phone,
      datenaissance,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});


app.post('/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;

  const userDoc = await User.findOne({email}).exec({ maxTimeMS: 60000 });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id).exec({ maxTimeMS: 60000 });
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});
app.get('/allbookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const options = {
      // Increase the value of `maxTimeMS` to increase the timeout
      maxTimeMS: 60000, // 60,000 ms (60 seconds) for example
    };
    const bookings = await Booking.find()
      .populate('ride')
      .populate('chauffeur')
      .populate('user')

      
      .exec(options);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true);
});
app.get('/allusers', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
app.post('/adminlogin', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
    
  const {email,password} = req.body;
  const userDoc = await Admin.findOne({email});
  if (userDoc) {
    
    if (password === userDoc.password) {
      jwt.sign({email:userDoc.email,id:userDoc._id},jwtSecret,{},(err,token)=>{
          if (err) throw err;
          res.cookie('token',token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
          }).json(userDoc)

      })
      
    } else {
      res.status(422).json('pass not ok')
    }
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/bookings/ridesreservations/:rideId', async (req, res) => {
  const rideId = req.params.rideId;

  try {
    // Find all bookings for the specified ride
    const bookings = await Booking.find({ ride: rideId }).populate('user').populate('chauffeur');

    // Send the bookings as a response
    res.json(bookings);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Updated route for creating a ride
app.put('/rides', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id, voiture, startingLocation, destination,slongitude ,slatitude,dlongitude ,dlatitude, availableSeats, departureTime, price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const rideDoc = await Ride.findById(id);
    if (userData.id === rideDoc.driver.toString()) {
      rideDoc.set({
        voiture, startingLocation, destination,slongitude ,slatitude,dlongitude ,dlatitude, availableSeats, departureTime, price,
      });
      await rideDoc.save();
      res.json('ok');
    }
  });
});
app.post('/rides', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    voiture, startingLocation, destination,slongitude ,slatitude,dlongitude ,dlatitude, availableSeats, departureTime, price, addedPhotos,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    // Check if addedPhotos is defined and is an array
    const uploadedPhotos = Array.isArray(addedPhotos)
      ? await Promise.all(addedPhotos.map(async (public_id) => {
          const result = await cloudinary.uploader.upload(public_id, {
            resource_type: 'image',
            overwrite: true,
          });
          return result.secure_url;
        }))
      : [];

    const rideDoc = await Ride.create({
      driver: userData.id,
      price,
      voiture,
      startingLocation,
      destination,
      slongitude ,slatitude,dlongitude ,dlatitude,
      availableSeats,
      photos: uploadedPhotos,
      departureTime,
    });
    res.json(rideDoc);
  });
});


// Updated route for getting user rides
app.get('/user-rides', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Ride.find({ driver: id }).exec({ maxTimeMS: 60000 }));

  });
});

// Updated route for getting ride details
app.get('/rides/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Ride.findById(id).populate('driver').exec({ maxTimeMS: 60000 }));
});

// Updated route for updating ride details


// Updated route for getting all rides
app.get('/rides', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Ride.find().exec({ maxTimeMS: 60000 }));
});

// Updated route for creating a booking for a ride
app.post('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { ride, numberOfGuests, phone, price } = req.body;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    // Create a booking
    // Create a booking
const rideDocs = await Ride.findById(ride).populate('driver');
const booking = await Booking.create({
  ride,
  chauffeur: rideDocs.driver._id,
  numberOfGuests,
  phone,
  price,
  user: userData.id,
});


    // Update available seats on the ride
    const rideDoc = await Ride.findById(ride);
    rideDoc.availableSeats -= numberOfGuests;
    await rideDoc.save();

    await session.commitTransaction();
    session.endSession();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Updated route for getting user bookings
app.get('/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('ride').populate('chauffeur').exec({ maxTimeMS: 60000 }))
});

app.delete('/delete-ride/:id', async (req, res) => {
  const rideId = req.params.id;

  try {
    // Find and delete associated bookings
    const deletedBookings = await mongoose.model('Booking').deleteMany({ ride: rideId });

    // Delete the ride itself
    const deletedRide = await Ride.findOneAndDelete({ _id: rideId });

    res.json({
      message: 'Ride and associated bookings deleted successfully',
      deletedRide,
      deletedBookings,
    });
  } catch (error) {
    console.error('Error deleting ride:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(4000);
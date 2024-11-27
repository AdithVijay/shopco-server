require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require("./routes/userRoutes");
const adminRoute = require("./routes/adminRoute");
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');

app.use(cookieParser());

app.use(cors({
    origin: 'https://shop-com-wekt.vercel.app', // Change this to your frontend's URL if different
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Replace previous module.exports with this
module.exports.handler = serverless(app);
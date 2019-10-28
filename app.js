const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDB connection established');
});

// Routes
app.use('/api/users', authRoute);
app.use('/api/posts', postRoute);

app.listen(port, () => {
	console.log(`Server listening at port ${port}`);
});

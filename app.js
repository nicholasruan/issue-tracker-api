const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const projRoute = require('./routes/project');
const listRoute = require('./routes/list');
const cardRoute = require('./routes/card');
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
app.use('/api/projects', projRoute);
app.use('/api/lists', listRoute);
app.use('/api/cards', cardRoute);
// app.use('/api/posts', postRoute);

app.listen(port, () => {
	console.log(`Server listening at port ${port}`);
});

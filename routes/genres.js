const validateObjectId = require('../middleware/validateObjectId');
const { Genre, validateGenre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validate');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// getting all genres
router.get('/', async (req, res) => {
	const genres = await Genre.find().sort('name');
	res.send(genres);
});

// adding a new genre
router.post('/', [auth, validate(validateGenre)], async (req, res) => {
	const genre = new Genre({ name: req.body.name });
	await genre.save();

	res.send(genre);
});

// updating a genre
router.put('/:id', [auth, validateObjectId, validate(validateGenre)], async (req, res) => {
	const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
	if (!genre) return res.status(404).send('The genre with the given ID was not found');
	res.send(genre);
});

//delete a genre
router.delete('/:id', [auth, admin], async (req, res) => {
	const genre = await Genre.findByIdAndRemove(req.params.id);
	if (!genre) return res.status(404).send('The genre with the given ID was not found');

	res.send(genre);
});

// get a particular genre with the given id
router.get('/:id', validateObjectId, async (req, res) => {
	const genre = await Genre.findById(req.params.id);

	if (!genre) return res.status(404).send('The genre with the given ID was not found');

	res.send(genre);
});

module.exports = router;
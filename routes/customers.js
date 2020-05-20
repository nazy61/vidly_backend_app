const { Customer, validateCustomer } = require('../models/customer');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// getting all customers
router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

// adding a new customer
router.post('/', [auth, validate(validateCustomer)], async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  await customer.save();

  res.send(customer);
});

// updating a customer
router.put('/:id', [auth, validate(validateCustomer)], async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  }, { new: true });
  if (!customer) return res.status(404).send('The customer with the given ID was not found');

  res.send(customer);
});

//delete a customer
router.delete('/:id', [auth, admin], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found');

  res.send(customer);
});

// get a particular customer with the given id
router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found');
  res.send(customer);
});

module.exports = router;
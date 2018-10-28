const { Router } = require('express');
const httperrors = require('httperrors');
const Thing = require('../models/thing');
const pagination = require('../lib/pagination');

module.exports = new Router()
  .get('', async (req, res) => {
    const query = pagination(req.query);
    const results = await Thing.findAll(query);
    res.json(results);
  })
  .get('/:id', async (req, res) => {
    const thing = await Thing.findById(req.params.id);

    if (!thing) throw httperrors.NotFound();

    res.json(thing);
  })
  .post('', async (req, res) => {

    // Only admin allowed past this point
    if(!req.auth.isAdmin){
      throw httperrors.Forbidden("Only authorised administrators are allowed to alter dangerous Things!");
    }

    const payload = req.body;
console.log(payload.name.split(':').length)
    if(payload.name.split(':').length < 2){
      throw httperrors.NotAcceptable("Thing name must be ':' delimited");
    }
    const created = await Thing.create(payload);

    // Check created for any errors
    if(created.quantity && created.quantity === -1){
      throw httperrors.BadRequest(created.msg);
    }

    res.json(created);
  });

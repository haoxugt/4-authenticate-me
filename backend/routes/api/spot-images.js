const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { SpotImage } = require('../../db/models');
// const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
});


module.exports = router;

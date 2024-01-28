const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Spot } = require('../../db/models');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    console.log("find all spots")
    const spots = await Spot.findAll();
    // console.log(spots)
    res.json({
        Spots: spots
    });
});


module.exports = router;

const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Spot, SpotImage } = require('../../db/models');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    const spots = await Spot.findAll();
    res.json({
        Spots: spots
    });
});

router.delete('/:id', async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);
    await spot.destroy();
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
})


module.exports = router;

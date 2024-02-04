const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Spot, SpotImage } = require('../../db/models');
const { validateSpotImageId } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');
const { checkAuthorization } = require('../../utils/authorization.js');


// routers
// Get all Spot images
router.get('/', async (req, res) => {
    const spotImages = await SpotImage.findAll();
    res.json(spotImages);
});

// Delete a Spot Image
router.delete('/:imageId', requireAuth, validateSpotImageId,
  checkAuthorization, async (req, res) => {
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    await spotImage.destroy();
    res.json({ "message": "Successfully deleted" });
});


module.exports = router;

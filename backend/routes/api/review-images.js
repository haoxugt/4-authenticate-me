const express = require('express')
const router = express.Router();

const { Op } = require('sequelize');
const { Review, ReviewImage } = require('../../db/models');
const { validateReviewImageId } = require('../../utils/validation');
// const bcrypt = require('bcryptjs');
const { requireAuth } = require('../../utils/auth');
const { checkAuthorization } = require('../../utils/authorization.js');


//router
// Delete a Spot Image
router.delete('/:imageId', requireAuth, validateReviewImageId,
  checkAuthorization, async (req, res) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    await reviewImage.destroy();
    res.json({
        "message": "Successfully deleted"
    });
});

module.exports = router;

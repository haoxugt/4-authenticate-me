const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Email must be a string.')
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('username must be a string.')
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('First name must be a string.')
        .isAlpha()
        .withMessage('Please provide a valid alphabetical first name.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Last name must be a string.')
        .isAlpha()
        .withMessage('Please provide a valid alphabetical last name.'),
    check('password')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Password must be a string.')
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

//sign up
router.post('/', validateSignup, async (req, res, next) => {
    const { username, email, password, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
        username,
        firstName,
        lastName,
        email,
        hashedPassword
    });

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

// Used for debugging
// router.get ('/', async (req, res) => {
//     const users = await User.findAll({
//         attributes: ["id","username", "email", "hashedPassword"]
//     });
//     console.log(typeof users[0].dataValues.hashedPassword)
//     res.json(users);
// });


module.exports = router;

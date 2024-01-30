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
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isAlpha()
        .withMessage('Please provide a valid alphabetical first name.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isAlpha()
        .withMessage('Please provide a valid alphabetical last name.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

//sign up
router.post('/', validateSignup, async (req, res, next) => {
    const { username, email, password, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    console.log("11111111111", hashedPassword);
    const user = await User.create({
        username,
        firstName,
        lastName,
        email,
        hashedPassword
    });
    console.log("222222222222", user.hashedPassword);
    console.log("333333333333", (user.hashedPassword).toString());

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser,
        password,
        hashedPassword
    });
});

router.get ('/', async (req, res) => {
    const users = await User.findAll({
        attributes: ["id","username", "email", "hashedPassword"]
    });
    console.log(typeof users[0].dataValues.hashedPassword)
    res.json(users);
})


module.exports = router;

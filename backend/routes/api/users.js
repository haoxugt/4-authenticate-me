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
        .withMessage('Invalid email'),
    check('username')
        .exists({ checkFalsy: true })
        .isString()
        .withMessage('Username must be a string')
        .isLength({ min: 4 })
        .withMessage('Username is required'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('firstName')
        .isAlpha()
        .withMessage('First Name is required')
        .isString()
        .withMessage('First Name must be a string')
        .exists({ checkFalsy: true })
        .withMessage('First Name is required'),
    check('lastName')
        .isAlpha()
        .withMessage('Last Name is required')
        .isString()
        .withMessage('Last Name must be a string')
        .exists({ checkFalsy: true })
        .withMessage('Last Name is required'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more')
        .isString()
        .withMessage('Password must be a string'),
    handleValidationErrors
];

// middleware
// check duplicate user
async function checkDuplicateUser(req, res, next) {
    const { username, email } = req.body;
    const userByUsername = await User.findOne({
        where: { username: username }
    });
    if (userByUsername) {
        const err = new Error('User already exists');
        err.title = 'Duplicate user signup';
        err.errors = { username: "User with that username already exists" };
        err.status = 500;
        return next(err);
    }
    const userByEmail = await User.findOne({
        where: { email: email }
    });
    if (userByEmail) {
        const err = new Error('User already exists');
        err.title = 'Duplicate user signup';
        err.errors = { email: "User with that email already exists" };
        err.status = 500;
        return next(err);
    }
    return next();
}

//sign up
router.post('/', validateSignup, checkDuplicateUser, async (req, res, next) => {
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

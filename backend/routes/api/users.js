const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { validateSignup } = require('../../utils/validateInput.js');
const { checkDuplicateUser }  = require('../../utils/othermiddlewares.js');

const router = express.Router();

// routers
// Sign up
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
//     return res.json(users);
// });


module.exports = router;

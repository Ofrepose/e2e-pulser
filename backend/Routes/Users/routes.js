const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../Middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const logger = require('@ofrepose/logtastic');

const User = require('../../Models/Users');

const Main = require('../../Main');

router.use('/screenshots', express.static(path.join(__dirname, '..', '..', 'screenshots')));

router.get('/isUp', async (req, res) => {
    res.send('Users is up');
});

/**
 * Retrieves information about the currently authenticated user, including their projects.
 * Requires user authentication.
 *
 * @route GET /
 * @access Private
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
router.get('/', auth, async (req, res) => {
    console.log('inside get user')

    try {
        const thisUser = await Main.Routes.Users.Helpers.getUser(req.body.user.id);
        if (!thisUser) {
            return res.status(404).json({ msg: 'User not found' });
        };
        await Main.Routes.Projects.Helpers.getAllUsersProjectsAndUpdatePackagesList(thisUser.id);

        let currentUserProjects = await Main.Routes.Projects.Helpers.getCurrentUserProjects(thisUser.id);

        currentUserProjects = await Main.Routes.Projects.Helpers.getCurrentUserProjects(thisUser.id);
        const currentUserComplete = { ...thisUser._doc, currentUserProjects }
        res.send(currentUserComplete);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Unauthorized - err' });
        }
        // console.log(err)
        logger.err(err, {
            color: 'red', // optional else default values are used
            style: 'bold', // optional else default values are used
            bgStyle: 'white', // optional else default values are used
            time: true, // optional
            override: true, // optional
            trace: true, // optional
            escape: false // optional
        });
        res.status(500).send('Server Error');
    }

});

/**
 * Retrieves and serves an image file from the specified screenshots directory.
 *
 * @route GET /image/:filename
 * @access Private
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
router.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', '..', 'screenshots', filename);
    res.sendFile(filePath);
});

/**
 * Handles user authentication by verifying email and password, then generating and returning a JSON web token (JWT).
 *
 * @route POST /
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
router.post('/',
    [
        check('email', 'Please include a valid Email Address')
            .isEmail(),
        check('password', 'Password is required to continue')
            .exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let password = req.body.password;
        const email = req.body.email.toLowerCase();

        try {
            let thisUser = await User.findOne({ email: email });


            if (!thisUser) {
                return res.status(400).json({ errors: [{ msg: 'Username and/or password are no good.' }] });
            };

            const isMatch = await bcrypt.compare(password, thisUser.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Username and/or password are no good.' }] });
            };
            const currentUser = await User.findOne({ email: email }).select('-password');
            // await Main.Routes.Projects.Helpers.getAllUsersProjectsAndUpdatePackagesList(thisUser.id);
            const currentUserProjects = await Main.Routes.Projects.Helpers.getCurrentUserProjects(currentUser.id);
            const currentUserComplete = { ...currentUser._doc, currentUserProjects }

            const payload = {
                user: {
                    id: thisUser.id
                }
            };

            jwt.sign(payload, config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, ...currentUserComplete });
                });

        } catch (err) {
            console.log(err)
            res.status(500).send('Server Error');
        };
    }
);

/**
 * Handles user registration by validating input data, creating a new user in the database,
 * and returning a JSON web token (JWT) for the newly registered user.
 *
 * @route POST /register
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
router.post('/register', [
    check('email', 'Valid Email Address is required')
        .isEmail(),
    check('firstname', 'First Name is Required')
        .not()
        .isEmpty(),
    check('lastname', 'Last Name is Required')
        .not()
        .isEmpty(),
    check('password', 'Valid password is required')
        .isLength({ min: 6 }),
    check('password2', 'Valid password is required')
        .isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (req.body.password !== req.body.password2) {
        return res.status(400).json({ errors: [{ msg: 'Your passwords dont match.' }] });
    }
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        firstname,
        lastname,
        password,
    } = req.body;

    const email = req.body.email.toLowerCase();

    const thisUser = await User.findOne({ email: email });

    if (thisUser) return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    try {
        const newUser = new User({
            firstname,
            lastname,
            password,
            email
        });

        const salt = await bcrypt.genSalt(10);

        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

        const payload = {
            user: {
                id: newUser.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, ...newUser._doc });
            });
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error');
    };
});

module.exports = router;
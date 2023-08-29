const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../Middleware/auth');
const axios = require('axios');

const Main = require('../../Main');

router.get('/idUp', async (req, res) => {
    res.send('projects is up');
});


/**
 * Handles the creation of a new project.
 * Requires user authentication and validates input data.
 *
 * @route POST /add
 * @access Private
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
router.post('/add', auth,
    [
        check('projectName', 'Project Name is Required').not().isEmpty(),
        check('json', 'JSON file is Required').not().isEmpty(),
        check('user', 'Make sure you are signed in').not().isEmpty()
    ], async (req, res) => {
        let newProject;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const currentUser = await Main.Routes.Users.Helpers.getUser(req.body.user.id);
        let {
            projectName, tech, url, json
        } = req.body;

        if (typeof json === 'string' && json.startsWith('http')) {
            try {
                const response = await axios.get(json);
                json = response.data;
            } catch (err) {
                console.log(err);
            }
        }
        const userId = currentUser.id;
        const projectAlreadyExists = await Main.Routes.Projects.Helpers.projectAlreadyExists(projectName, userId);
        if (projectAlreadyExists) {
            return res.status(400).json({ errors: [{ msg: 'Project already exists' }] });
        }
        try {
            // sort out the dependencies. ugh
            if (!json?.dependencies) {
                return res.status(400).json({ errors: [{ msg: 'No dependencies found in json' }] });
            }
            const depends = Object.keys(json?.dependencies)
            const updates = await Promise.all(depends.map(async (item) => {
                const packageInfo = await Main.Routes.Projects.Helpers.getLibraryInfo(item);
                // TODO: Decide if this is A. doable and B. Worth doing. Simply would add logos of all dependencies. Good for UI but thats about it.
                // let logo;
                // if (packageInfo?.documentation) {
                //     logo = await Main.Routes.Projects.Helpers.findLogo(item, packageInfo?.documentation)
                //     console.log(`LOGO IS: ${logo}`)
                // }
                return {
                    name: item,
                    version: json.dependencies[item].replace(/\^/g, ''),
                    updatedVersion: packageInfo?.latestVersion || null,
                    updateAvailable: json.dependencies[item].replace(/\^/g, '') !== packageInfo?.latestVersion,
                    description: packageInfo?.description || null,
                    repoUrl: packageInfo?.repoUrl || null,
                    documentation: packageInfo?.documentation || null,
                    // logo: logo || null
                };
            }));
            newProject = Main.Routes.Projects.Helpers.createNewProject({ projectName, tech, url, json, userId, updates: updates });
            return res.send(newProject);
        } catch (err) {
            console.log(err);
        }
    })

module.exports = router;
const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../Middleware/auth');
const axios = require('axios');

const Main = require('../../Main');

router.get('/idUp', async (req, res) => {
    res.send('projects is up');
});

router.delete('/delete', auth,
    [
        check('projectId', 'Project id is Required').not().isEmpty(),
    ], async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const currentUser = await Main.Routes.Users.Helpers.getUser(req.body.user.id);

            await Main.Routes.Projects.Helpers.deleteProject(currentUser.id, req.body.projectId);
            const currentUserProjects = await Main.Routes.Projects.Helpers.getCurrentUserProjects(currentUser.id);
            return res.send(currentUserProjects);
        } catch (err) {
            console.log(err);
        }

    })


router.post(
    '/edit',
    auth,
    [
        check('projectName', 'Project Name is Required').not().isEmpty(),
        check('json', 'JSON file is Required').not().isEmpty(),
        check('user', 'Make sure you are signed in').not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id: userId } = req.body.user;
            const {
                projectName,
                tech,
                url,
                json,
                projectId,
            } = req.body;
            let jsonLocation = 'file';

            const currentUser = await Main.Routes.Users.Helpers.getUser(userId);
            const currentProject = await Main.Routes.Projects.Helpers.getProject(projectId, userId);

            if (!currentProject) {
                return res.status(400).json({ errors: [{ msg: 'Project not found' }] });
            }

            // Check if a URL to raw JSON is given and fetch it using axios
            if (typeof json === 'string' && json.startsWith('http')) {
                jsonLocation = json;

                try {
                    const response = await axios.get(json);
                    json = response.data;
                } catch (err) {
                    console.error(err);
                }
            }

            if (!json?.dependencies && !json.devDependencies) {
                return res.status(400).json({ errors: [{ msg: 'No dependencies found in json' }] });
            }

            // Extract dependencies and devDependencies
            const depends = json?.dependencies ? Object.keys(json.dependencies) : [];
            const devDepends = json?.devDependencies ? Object.keys(json.devDependencies) : [];

            // Fetch information for each library in parallel
            const updates = await Promise.all([...depends, ...devDepends].map(async (item) => {
                const packageInfo = await Main.Routes.Projects.Helpers.getLibraryInfo(item);
                const currentJson = json.dependencies?.[item] || json.devDependencies?.[item];
                return {
                    name: item,
                    version: currentJson?.replace(/\^/g, ''),
                    updatedVersion: packageInfo?.latestVersion || null,
                    updateAvailable: currentJson?.replace(/\^/g, '') !== packageInfo?.latestVersion,
                    description: packageInfo?.description || null,
                    repoUrl: packageInfo?.repoUrl || null,
                    documentation: packageInfo?.documentation || null,
                    dev: !!json?.devDependencies?.[item],
                    license: packageInfo?.license || null,
                };
            }));

            // Update project information and save it
            currentProject.projectName = projectName || currentProject.projectName;
            currentProject.tech = tech || currentProject.tech;
            currentProject.url = url || currentProject.url;
            currentProject.json = json || currentProject.json;
            currentProject.updates = updates || currentProject.updates;

            await currentProject.save();

            return res.send(currentProject);
        } catch (err) {
            console.error(err);
            res.status(500).json({ errors: [{ msg: 'Internal Server Error' }] });
        }
    }
);

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
        let jsonLocation;
        // if url to raw json given - grab it using axios.
        if (typeof json === 'string' && json.startsWith('http')) {
            jsonLocation = json;
            try {
                const response = await axios.get(json);
                json = response.data;
            } catch (err) {
                console.log(err);
            }
        } else {
            jsonLocation = 'file';
        }
        const userId = currentUser.id;
        const projectAlreadyExists = await Main.Routes.Projects.Helpers.projectAlreadyExists(projectName, userId);
        if (projectAlreadyExists) {
            return res.status(400).json({ errors: [{ msg: 'Project already exists' }] });
        }
        try {
            if (!json?.dependencies && !json.devDependencies) {
                return res.status(400).json({ errors: [{ msg: 'No dependencies found in json' }] });
            }
            json.jsonLocation = jsonLocation;
            const depends = json?.dependencies && Object.keys(json?.dependencies) || [];
            const devDepends = json?.devDependencies && Object.keys(json?.devDependencies) || [];
            const peerDepends = json?.peerDependencies && Object.keys(json?.peerDependencies) || [];
            const updates = await Promise.all([...depends, ...devDepends, ...peerDepends].map(async (item) => {
                const packageInfo = await Main.Routes.Projects.Helpers.getLibraryInfo(item);
                const currentJson = json?.dependencies?.[item] ?? json?.devDependencies?.[item] ?? json?.peerDependencies?.[item];
                return {
                    name: item,
                    version: currentJson?.replace(/\^/g, ''),
                    updatedVersion: packageInfo?.latestVersion || null,
                    updateAvailable: currentJson?.replace(/\^/g, '') !== packageInfo?.latestVersion,
                    description: packageInfo?.description || null,
                    repoUrl: packageInfo?.repoUrl || null,
                    documentation: packageInfo?.documentation || null,
                    dev: !!json?.devDependencies?.[item],
                    peer: !!json?.peerDependencies?.[item],
                    license: packageInfo?.license || null,
                };
            }));
            newProject = Main.Routes.Projects.Helpers.createNewProject({ projectName, tech, url, json, userId, updates });
            return res.send(newProject);
        } catch (err) {
            console.log(err);
        }
    })

module.exports = router;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../Middleware/auth');

const Main = require('../../Main');

router.get('/isUp', async (req, res) => {
    res.send('Tests are up');
});

/**
 * Handles the execution and recording of a test for a specific project.
 * Validates input data and requires user authentication.
 *
 * @route POST /test
 * @access Private
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
router.post('/test',
    [
        check('projectId', 'Project id is requird')
            .exists(),
        check('testName', 'Test Name is required')
            .exists()
    ],
    auth, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { user, projectId, testName } = req.body;
        let currentProject;
        let results;
        let runTime = new Date();

        try {
            currentProject = await Main.Routes.Projects.Helpers.getProject(projectId, user.id);
            let currentTestBind = currentProject.tests.filter(item => item.name === testName)[0];
            if (currentTestBind.testType === 'Can see text on page') {
                results = await Main.Tester.testTextOnPage({ test: currentTestBind, projectId });
                results = { ...results[0], runTime }
            } else if (currentTestBind.testType === 'Can log in') {
                results = await Main.Tester.testCanLogIn({ test: currentTestBind, projectId });
                results = { ...results[0], runTime }
            } else if (currentTestBind.testType === 'Custom Form') {
                results = await Main.Tester.testDynamicForm({ test: currentTestBind, projectId });
                results = { ...results[0], runTime }
            }
            currentProject = await Main.Routes.Projects.Helpers.getProject(projectId, user.id);
            const testToUpdate = currentProject.tests.find(item => item.name === testName);
            testToUpdate.runs.push(results);
            await currentProject.save();

            const dataToReturn = {
                current: results,
                projectData: await Main.Routes.Projects.Helpers.getCurrentUserProjects(user.id)
            }
            res.send(dataToReturn)

        } catch (err) {
            // add db error logging here
            console.log(err);
            return res.status(500).send('Server Error - run test');
        }


    }
)

/**
 * Handles the addition or editing of a test configuration for a specific project.
 * Validates input data and requires user authentication.
 *
 * @route POST /add
 * @access Private
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
router.post('/add',
    [
        check('projectId', 'Project id is required')
            .exists(),
        check('testType', 'Please include a valid Test Type')
            .exists(),
        check('testName', 'Please include a valid Test Name')
            .exists(),
        check('data', 'Please include a valid Test Name')
            .exists()
    ],
    auth, async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { projectId, testType, testName, user, data } = req.body;
        let currentProject;

        try {
            currentProject = await Main.Routes.Projects.Helpers.getProject(projectId, user.id);
            // if this is an edit - sort it out
            if (req.body.testId) {
                currentProject.tests = currentProject.tests.map((item) => {
                    return item.id === req.body.testId ?

                        {
                            ...item,
                            name: testName,
                            testType,
                            args: data && data || item.args
                        }
                        : item
                });
                await currentProject.save();
                currentProject = await Main.Routes.Projects.Helpers.getProject(projectId, user.id);
                return res.send(currentProject);
            } else {
                const projectTestNames = currentProject.tests.map((item) => item.name);
                if (projectTestNames.includes(testName) && !req.body.testId) {
                    return res.status(403).json({ errors: ['Test Name already exists for this project'] });
                }
                // get all user tests for that project
                // validate unique test name for that project
                // if all validation passes, add test to project.
                const newTest = {
                    name: testName,
                    testType,
                    args: data

                };
                currentProject.tests.push(newTest);
                await currentProject.save();
            }
        } catch (err) {
            // add db error logging here
            console.log(err);
            return res.status(500).send('Server Error - add test');
        }
        return res.send(currentProject);

    })

module.exports = router;

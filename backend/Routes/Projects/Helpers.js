const Project = require('../../Models/Project');
const Errors = require('../../ErrorHandling/Errors');
// for getting latest version of library
const fetch = require('npm-registry-fetch');
const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('@ofrepose/logtastic');
const semver = require('semver');

/**
 * A utility class that provides various helper methods for working with projects, libraries, and package information.
 *
 * @class Helpers
 */
class Helpers {
    constructor() {
        this.Errors = new Errors();
    };


    /**
     * Checks the online status of a given website URL by sending a GET request.
     *
     * @param {string} websiteUrl - The URL of the website to check for online status.
     * @returns {Promise<boolean>} A promise that resolves to true if the website is online (status 200),
     * and false if it's not reachable or returns a non-200 status.
     */
    async onlineStatus(websiteUrl) { // Replace with the website URL you want to check
        if (!websiteUrl.startsWith('http') && !websiteUrl.startsWith('localhost')) {
            websiteUrl = 'https://' + websiteUrl;
        }
        try {
            const response = await axios.get(websiteUrl, { timeout: 1500 });
            if (response.status === 200) {
                return true
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    /**
     * Retrieves projects associated with the given user ID from the database.
     *
     * @param {string} userId - The ID of the user whose projects are being queried.
     * @returns {Promise<Array>} A promise that resolves to an array of project objects
     * associated with the provided user ID.
     */
    async getCurrentUserProjects(userId) {
        const projects = await Project.find({ userId: userId });
        return projects;
    }

    async deleteProject(userId, projectId) {
        await Project.deleteOne({ userId: userId, _id: projectId });
    }

    /**
     * Checks whether a project with the given name and user ID already exists in the database.
     *
     * @param {string} projectName - The name of the project being checked.
     * @param {string} userId - The ID of the user who owns the project.
     * @returns {Promise<boolean>} A promise that resolves to true if a project with the given
     * name and user ID already exists, and false otherwise.
     */
    async projectAlreadyExists(projectName, userId) {
        const project = await Project.findOne({ projectName, userId });
        if (project) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Retrieves a project with the given ID and associated user ID from the database.
     *
     * @param {string} id - The ID of the project to retrieve.
     * @param {string} userId - The ID of the user who owns the project.
     * @returns {Promise<Object|null>} A promise that resolves to the project object if found,
     * or null if no project is found with the given ID and user ID.
     */
    async getProject(id, userId) {
        const project = await Project.findOne({ _id: id, userId: userId });
        return project;
    }

    /**
     * Creates a new project record in the database with the provided data.
     *
     * @param {Object} data - The data for the new project.
     * @returns {Promise<Object>} A promise that resolves to the newly created project object.
     */
    async createNewProject(data) {
        const newProject = new Project(data);
        try {
            newProject.save()
        } catch (err) {
            console.log(err);
        }
        return newProject;
    }

    /**
     * Retrieves the latest version of a given package from a package registry.
     *
     * @param {string} packageName - The name of the package to fetch information for.
     * @returns {Promise<string|null>} A promise that resolves to the latest version of the package,
     *                                or null if an error occurs during the fetch operation.
     */
    async getLatestVersion(packageName) {
        try {
            const packageInfo = await fetch.json(packageName);
            const latestVersion = packageInfo['dist-tags'].latest;

            return latestVersion;
        } catch (error) {
            console.error('Error fetching package information:', error);
            return null;
        }
    }

    /**
     * Retrieves information about a library/package from a package registry.
     *
     * @param {string} packageName - The name of the package to fetch information for.
     * @returns {Promise<Object|null>} A promise that resolves to an object containing the
     * latest version, description, repository URL, and documentation URL
     * of the package. Returns null if an error occurs during the fetch.
     */
    async getLibraryInfo(packageName) {
        try {
            const packageInfo = await fetch.json(packageName);
            const latestVersion = packageInfo['dist-tags'].latest || null;
            const description = packageInfo.description || null;
            const repoUrl = packageInfo.repository?.url || null;
            const documentation = packageInfo.homepage || packageInfo.repository && packageInfo.repository.url || null;
            const license = packageInfo.license || null;
            // console.log(Object.keys(packageInfo))
            // console.log(packageInfo.versions)
            return { latestVersion, description, repoUrl, documentation, license }

        } catch (error) {
            console.error('Error fetching package information:', error);
            return null;
        }
    }

    normalizeVersion(version) {
        // Check if the version contains a dot
        if (version.indexOf(".") !== -1) {
            const parts = version.split(".");
            // Check if the version has two parts and the second part has only one digit
            if (parts.length === 2 && parts[1].length === 1) {
                return version + ".0";
            }
        } else {
            // If the version has no dot, add ".0.0" to it
            return version + ".0.0";
        }
        return version;
    }

    doesConflictExist({ dependencyA, dependencyB }) {
        return !semver.intersects(dependencyA, dependencyB);
    }

    comparePackages({ packageOne, packageTwo }) {
        const pack1DepKeys = packageOne?.dependencies && Object.keys(packageOne?.dependencies) || [];
        const pack1PeerDepKeys = packageOne?.peerDependencies && Object.keys(packageOne?.peerDependencies) || [];

        // Create an array to store conflict messages
        const conflictMessages = [];

        // Use forEach instead of map to iterate
        [...pack1DepKeys, ...pack1PeerDepKeys].forEach((item) => {
            if (
                packageTwo?.dependencies?.[item] ||
                packageTwo?.peerDependencies?.[item]
            ) {
                const thisItem =
                    packageOne?.dependencies?.[item] || packageOne?.peerDependencies?.[item];
                const packageTwoItem =
                    packageTwo?.dependencies?.[item] || packageTwo?.peerDependencies?.[item];

                if (this.doesConflictExist({
                    dependencyA: thisItem,
                    dependencyB: packageTwoItem,
                })) {
                    const conflictMessage = {
                        message: `conflict with ${item}. ${packageOne.packageName} is using ${thisItem} and ${packageTwo.packageName} is looking for ${packageTwoItem}`,
                        item: item,
                        packageOne: packageOne.packageName,
                        packageOneUsing: thisItem,
                        packageTwo: packageTwo.packageName,
                        packageTwoUsing: packageTwoItem,

                    };


                    // Push the conflict message to the result array
                    conflictMessages.push(conflictMessage);
                }
            }
        });

        // Return the array of conflict messages
        return conflictMessages;
    }

    async getDependenciesByPackageNameAndVersion({ packageName, version }) {
        if (!packageName || !version) {
            logger.warn('packageName || version missing inside getDependenciesByPackageNameAndVersion()', { trace: true, time: true })
            return { dependencies: null, peerDependencies: null, devDependencies: null };
        }
        try {
            const packageInfo = await fetch.json(packageName);
            const dependencies = packageInfo.versions[version].dependencies || null;
            const peerDependencies = packageInfo.versions[version].peerDependencies || null;
            // less important as generally only effects conflicts when it leads to build or test failures 
            // if one package relies on a specific version of a tool or library for its build or test scripts
            const devDependencies = packageInfo.versions[version].devDependencies || null;
            return { dependencies, peerDependencies, devDependencies, packageName };
        } catch (err) {
            logger.warn(err);
        }
    }

    async conflictForecaster({ project }) {
        logger.log('conflictForecaster Start');
        const depends = project.updates;
        let conflicts = []
        for (let x = 0; x < depends.length; x++) {
            if (depends?.[x + 1]) {
                const packageOne = await this.getDependenciesByPackageNameAndVersion({ packageName: depends[x].name, version: depends[x].updatedVersion });
                const packageTwo = await this.getDependenciesByPackageNameAndVersion({ packageName: depends[x + 1].name, version: depends[x + 1].updatedVersion });
                // console.log('return is')
                const results = this.comparePackages({ packageOne, packageTwo });
                // console.log(results)
                conflicts.push(this.comparePackages({ packageOne, packageTwo }));
            }
        }
        console.log();
        const finalConflicts = conflicts.filter((item) => item.length > 0);
        project.conflicts = finalConflicts;
        await project.save();

    }

    /**
     * Retrieves all projects of a user and updates the package list for each project.
     *
     * @param {string} userId - The ID of the user whose projects and packages are being updated.
     * @returns {Promise<void>} A promise that resolves when all projects' package lists have been updated.
     */
    async getAllUsersProjectsAndUpdatePackagesList(userId) {

        const projects = await this.getCurrentUserProjects(userId);

        if (projects.length > 0) {

            await Promise.allSettled(projects.forEach(async (project) => {

                await this.updatePackagesList(project);
                await project.save()
            })).catch((err) => {
                logger.warn(err, {
                    time: true,
                    override: true,
                    trace: true,
                    escape: false
                });
            });
        }
    }

    /**
     * Updates the packages list of a project with the latest information about package updates.
     *
     * @param {Object} project - The project object to update.
     * @returns {Promise<Object>} A promise that resolves to the updated project object.
     */
    async updatePackagesList(project) {
        await this.conflictForecaster({ project });
        const depends = project.json?.dependencies && Object.keys(project.json?.dependencies) || [];
        const devDepends = project.json?.devDependencies && Object.keys(project.json?.devDependencies) || [];
        const peerDepends = project.json?.peerDependencies && Object.keys(project.json?.peerDependencies) || [];

        try {
            const newUpdates = await Promise.all([...depends, ...devDepends, ...peerDepends].map(async (item) => {
                const packageInfo = await this.getLibraryInfo(item);
                const currentJson = project.json?.dependencies?.[item] ?? project.json?.devDependencies?.[item] ?? project.json?.peerDependencies?.[item];

                if (item) {
                    return {
                        name: item || '',
                        version: currentJson?.replace(/\^/g, ''),
                        updatedVersion: packageInfo?.latestVersion || null,
                        updateAvailable: currentJson?.replace(/\^/g, '') !== packageInfo?.latestVersion,
                        description: packageInfo?.description || null,
                        repoUrl: packageInfo?.repoUrl || null,
                        documentation: packageInfo?.documentation || null,
                        dev: !!project.json?.devDependencies?.[item],
                        peer: !!project.json?.peerDependencies?.[item],
                        license: packageInfo?.license || null,
                    };
                }
            }))
            project.updates = newUpdates;
            // this.findConflicts(newUpdates);
            await project.save()
            return project;
        } catch (err) {
            console.log(err)
        }

    }

    /**
     * Finds and retrieves the logo URL for a given library from its documentation page.
     *
     * @param {string} libraryName - The name of the library to find the logo for.
     * @param {string} docUrl - The URL of the library's documentation page.
     * @returns {Promise<string|null>} A promise that resolves to the URL of the logo image,
     * or null if an error occurs during the fetching process.
     */
    async findLogo(libraryName, docUrl) {
        const altName = libraryName.replace(/-/g, ' ').replace(/@/g, '');

        try {
            const response = await axios.get(docUrl);
            const html = response.data;
            const $ = cheerio.load(html);

            // refactor this. put them all in an array [ altName, libraryName, altName.replace(/\s+/g, ''), `${altName} icon`, `${libraryName} icon`,
            // `${altName.replace(/\s+/g, '')} icon`, imageLogo ]

            const options = [altName, libraryName, altName.replace(/\s+/g, ''), `${altName} icon`, `${libraryName} icon`,
                `${altName.replace(/\s+/g, '')} icon`, `${altName} logo`, `${libraryName} logo`,
                `${altName.replace(/\s+/g, '')} logo`, 'logo'];

            const results = options.map((item) => {
                const getImage = (keyword) => $('img[alt="' + keyword + '" i]').first();
                let finalUrl;
                const imageTemp = getImage(item);
                if (imageTemp.length > 0 && !finalUrl) {
                    const tempValue = imageTemp.attr('src');
                    return finalUrl = tempValue.startsWith('https') ? tempValue : null;
                } else {
                    return
                }
            });

            if (results.length > 0) {
                return results[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching website:', error.message);
            return null;
        }
    }


}

module.exports = Helpers;
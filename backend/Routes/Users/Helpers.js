const User = require('../../Models/Users');
const Errors = require('../../ErrorHandling/Errors');


class Helpers {
    constructor() {
        this.Errors = new Errors();
    }

    /**
     * Retrieves a user's information by their unique ID.
     *
     * @param {string} id - The unique ID of the user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the user object, or null if the user is not found.
     */
    async getUser(id) {
        this.Errors.notNullAnyArgs(id);
        let user;
        try {
            user = await User.findById(id).select('-password');
            if (!user) {
                this.Errors.newError({
                    name: 'user not found',
                    data: user,
                    severity: 'warn',
                    tag: 'users',
                    msg: 'no user found',
                    loc: 'Routes.Users.Helpers.getUser'
                })
            }
            return user;
        } catch (err) {
            this.Errors.newError({
                name: 'error getting user',
                data: user,
                severity: 'warn',
                tag: 'users',
                msg: err.message,
                loc: 'Routes.Users.Helpers.getUser'
            })
        }
    }

    /**
     * Retrieves information about all registered users.
     *
     * @returns {Promise<Array>} A promise that resolves to an array of user objects representing all registered users.
     */
    async getAllUsers() {
        return await User.find();
    }
}

module.exports = Helpers;
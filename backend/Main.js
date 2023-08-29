// Users
const Users = new(require('./Routes/Users/Helpers'))({});

// Projects
const Projects = new(require('./Routes/Projects/Helpers'))({});

// Tests
const Tester = new(require('./Tester/Index'))({});

// Logger
const Logger = new(require('./Logger/Index'))({});

module.exports = {
    Routes: {
        Users: {
            Helpers: Users
        },
        Projects: {
            Helpers: Projects,
        }
    },
    Tester: Tester,
    Logger: Logger,

}
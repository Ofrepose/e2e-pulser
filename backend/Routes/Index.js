const Main = require('../Main');

class Routes{
    constructor(app){
        this.app = app;
    }

    starter(){
       // Define the root route
       this.app.get('/', (req, res) => res.send('API Running'));

       // Use the user routes
       this.app.use('/api/users', require('./Users/routes'));

       // Use the project routes
       this.app.use('/api/projects', require('./Projects/routes'));

       // Use the test routes
       this.app.use('/api/test', require('./Tests/routes'));
    }
}

module.exports = Routes;
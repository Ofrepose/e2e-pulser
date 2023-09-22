const express = require('express');
const Routes = require('./Routes/Index');
const connectDB = require('./config/db');

const app = express();
const cors = require('cors');

const logger = require('@ofrepose/logtastic');


// environment variables
require('dotenv').config();

// helpers


// console styling

// connect database
connectDB();

// handle JSON requests
app.use(express.json({ extended: false }));
app.use(cors());
app.use(express.static('screenshots')); // Replace 'public' with the actual directory name


const PORT = process.env.PORT || 5001;

// ROUTES
const routes = new Routes(app);
routes.starter();

(async () => {  
  logger.log(
    `Backend server starting...
`, { color: 'yellow', style: 'bold', time: true })
  // repeatChecks();

})();

// async function CheckSiteStatus() {
//   const users = await Main.Routes.Users.Helpers.getAllUsers();
//   if (users) {
//     for (let user of users) {
//       const currentUserProjects = await Main.Routes.Projects.Helpers.getCurrentUserProjects(user.id);
//       await Promise.all(currentUserProjects.map(async (project) => {
//         project.status = await Main.Routes.Projects.Helpers.onlineStatus(project.url) && 'Online' || 'Offline';
//         await project.save()
//       }));
//     }
//   }
// }

// function repeatChecks() {
  // CheckSiteStatus();
  // setTimeout(repeatChecks, 50000); // 5 minutes in milliseconds
// }




app.listen(PORT, () => {
  try {
    logger.log(`Starting server on port: ${PORT}`, { color: 'white', bgStyle: 'green' });
  } catch (err) {
    logger.err(err, { escape: true })

  }
})




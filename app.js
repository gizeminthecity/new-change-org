// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

const projectName = "New Change.org";
const capitalized = (string) =>
    string[0].toUpperCase() + string.slice(1).toLowerCase();
app.locals.title = `${capitalized(projectName)}`;

app.use((req, res, next) => {
    if (req.session.user) {
        // if there is a logged in user
        res.locals.user = req.session.user;
        // in every response we are sending a `user` which is the logged in user
    }
    next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const petitionRoutes = require("./routes/petitions");
app.use("/petitions", petitionRoutes);

const updatePetitionRoutes = require("./routes/updatePetition");
app.use("/updatePetition", updatePetitionRoutes);

const profileRoutes = require("./routes/profile");
app.use("/profile", profileRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;

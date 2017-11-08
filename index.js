const express = require("express");
const session = require("express-session");
const passport = require("passport");
const { secret } = require("./config");

const strategy = require("./strategy");

const app = express();

app.use(
  session({
    secret,
    saveUninitialized: false,
    resave: false
  })
);

//copy and paste this for AUTH0;
app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

//this is fired once, locks the users data
passport.serializeUser(function(user, done) {
  done(null, user);
});

//this is fired for every request back to the server, unlocks the users data allowing us to augment it
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get(
  "/login",
  passport.authenticate("auth0", {
    successRedirect: "/me",
    failureRedirect: "/login",
    failureFlash: true
  })
);

//res.redirect built into express to redirect to other endpoint;
app.get("/me", (req, res, next) => {
  req.user ? res.status(200).json(req.user.displayName) : res.redirect("login");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { ValidationError } = require("sequelize");

const { environment } = require("./config");
const isProduction = environment === "production";

const routes = require("./routes"); // import from index file in routes directory

const app = express();

app.use(morgan("dev"));
app.use(cookieParser()); // access csurf tokens and jwts
app.use(express.json()); // allows us to read json request bodies

//! Route for testing phase 0 of frontent AuthenticateMe CSRFRestore

app.post("/api/test", (req, res) => {
  const { credential, password } = req.body;
  res.json({ requestBody: { credential, password } });
});

//! Security / Global Middleware

if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

app.use(routes); // Connect all the routes

//! Error Handling

//^ Error generating middleware

// This middleware catches routes that are not handled within the application, generates a 404 error, then passes the error to the next error - handling middleware.This is actually not an error handler because it does not take in an error, but handles any routes which are not specifed and then generates an error that indicates the resource in question does not exist / cannot be found

// backend/app.js
// ...
// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

//^ Error-handler specifically for Sequelize validation errors.

// This error - handler catches any validation errors that come from Sequelize, loops through them and adds their messages into an array, returns that array of error messages in a single error titled 'Validation error', then passes the error to the next error - handler.

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

//^ Error Formatter

// This formatter is our final error-handler. It sends a json response with all of the error data included, and will conditionally show the stack trace of the error based on whether we are working in a production or development environment.

// backend/app.js
// ...
// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;

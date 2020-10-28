const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const config = require("./config/config");
const bodyParser = require("body-parser");

//for view engine
const Handlebars = require("handlebars");

//to be able to use put and delete later on
const methodOverride = require("method-override");
//for csrf token
const session = require("express-session");

//set a port
const PORT = process.env.PORT || 3000;

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

//load mongoose
mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
//set a DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to the database");
});

//set app and public files for javascript

const app = express();
app.use(express.static("public"));

//method override for put and delete
app.use(methodOverride("_method"));

//session - to make passport-local possible
app.use(
  session({ secret: "sessionsecret", resave: false, saveUninitialized: false })
);

//allow bodyParser to recognize a body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//load handlebars and set .handlebars to .hbs
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", ".hbs");

//login data
app.use(morgan("dev"));

//routes
app.use("/", require("./routes/index"));
app.use("/list", require("./routes/list"));
app.use("/user/signup", require("./routes/user"));

//start listening
app.listen(PORT, () => console.log(`Server has started on: ${PORT}`));

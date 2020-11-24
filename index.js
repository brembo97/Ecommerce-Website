const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const adminAuthRouter = require('./routes/admin/auth');


const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieSession({
    name: "session",
    keys: ["azsmqertimzcndqwekdkp"]
}))
app.use(adminAuthRouter)

app.listen(3000, () => {
    console.log("Listening on port 3000")
});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));


var routes = require('./api/routes/appRoutes'); //importing route
routes(app); //register the route


app.listen(port, () => console.log(`Customer API listening on port ${port}`))

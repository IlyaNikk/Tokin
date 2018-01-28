'use strict';

const express = require('express');
// const parser = require('body-parser');
const compression = require('compression');

const app = express();
app.use(compression());
app.use('/', express.static('dist'));

app.listen(process.env.PORT || 3000, () =>{
    console.log(`App started on port ${process.env.PORT || 3000}`);
});
const mongoose = require('mongoose');
mongoose.connect((process.env.MONGOLAB_URI || 'mongodb://localhost/test'), {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = mongoose
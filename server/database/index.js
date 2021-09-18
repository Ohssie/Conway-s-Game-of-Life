const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/simulation', { useNewUrlParser: true })
        .catch(error => {
          console.error('Connection error,', error.message);
        })

const db = mongoose.connection
module.exports = db;
const express = require('express');
const router = require('./routes/route.js');
const  mongoose = require('mongoose');
const app = express();
const multer = require("multer")
app.use(multer().any())

app.use(express.json());

mongoose.connect("mongodb+srv://pallavi_90:eh5J7PzhYvWnStqo@cluster0.hznxhdd.mongodb.net/group60Database", {
  useNewUrlParser: true
})
  .then(() => console.log("MongoDb is connected"))
  .catch(err => console.log(err))


app.use('/', router);

app.all('/**', (req, res) => {
  res.status(404).send({ status: false, message: 'The api you requested is not available' });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Express app running on port ' + (process.env.PORT || 3000));
});

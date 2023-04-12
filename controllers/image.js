const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'b4f74c7cfa714ef1bc048820c65660ee'
   });
  
const handleClarifai = (req,res) => {
    app.models
    .predict('face-detection', req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('inable to work with Api'));
}

const handleImage = (req, res, db) => {

    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get image'));
    }

module.exports = {
    handleImage: handleImage,
    handleClarifai: handleClarifai
}
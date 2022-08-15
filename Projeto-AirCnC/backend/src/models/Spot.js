const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
    thumbnail:String,
    company:String,
    price: Number,
    techs:[String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    toJSON:{
        virtuals:true,
    },
});

//erro com a linha a baixo
SpotSchema.virtual('thumbnail_url').get(function(){
    return `https://localhost:3000/files/${this.thumbnail}`
})

module.exports = mongoose.model('Spot', SpotSchema);
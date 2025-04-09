import {model, Schema} from 'mongoose';

const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }, 
}, {
    timestamps: true,
});

const Exercise = model('Exercise', exerciseSchema);
export default Exercise;
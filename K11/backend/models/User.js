import {model, Schema} from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    profileImage: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    firebaseUID: {
        type: String,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

const User = model('User', userSchema);
export default User;
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        required: true,
    },
});


let user = mongoose.model('User', UserSchema);
export default user;

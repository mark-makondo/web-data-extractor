import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const User = Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            default: 'normal',
        },
    },
    {
        timestamps: true,
    }
);

User.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);

    this.password = bcrypt.hashSync(this.password, salt);

    return next();
});

export default model('users', User);

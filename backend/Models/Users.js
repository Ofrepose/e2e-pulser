const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Apartment',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    lastSignOn: {
        type: Date,
        default: Date.now
    },
    address: {
        street1: {
            type: String,
        },
        street2: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    phone: {
        type: String
    },
    accessKey: {
        type: String,
    },
    onboarded: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
    },
    restricted: {
        type: Boolean,
        default: false
    },
    opts: {
        pushNotifications: {
            type: Boolean,
            default: true
        },
        emails: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false,
        }
    }
});

module.exports = Users = mongoose.model('Users', UserSchema);
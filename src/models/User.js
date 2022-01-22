import mongoose from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    shippingDetails: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postCode: {
            type: String,
            required: true
        },
        county: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    }
})

UserSchema.methods.validatePassword = async function (pw) {
    return await bcrypt.compare(pw, this.password)
}

UserSchema.methods.addShippingDetails = async function (shippingDetails) {
    this.shippingDetails = shippingDetails
    await this.save()
}

// the function inside of this middleware has to be function() {} instead of arrow function otherwise the scope of "this" is changed
UserSchema.pre("save", async function (next) {
    // only hash password if we're creating an account (ie. not updating details for user etc)
    if (!this.isModified("password")) {
        next()
    }
    // above says if password hasn't been modified, continue and ignore hashing of password

    this.password = await bcrypt.hash(this.password, 12)
})

const User = mongoose.model("User", UserSchema)

export default User

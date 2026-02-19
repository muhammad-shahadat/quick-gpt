import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
        },

        credits: {
            type: Number,
            default: 10, // free credits
        },

        usedToday: {
            type: Number,
            default: 0,
        },

        lastReset: {
            type: Date,
            default: Date.now,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

//hashing password before saving DB
UserSchema.pre("save", async function () {

    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
    

})

const User = mongoose.model("User", UserSchema);
export default User;

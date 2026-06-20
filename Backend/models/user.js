const { createHmac, randomBytes } = require("node:crypto");

const { Schema, model } = require("mongoose");

const { createTokenForUser, validateToken } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImgURL: {
      type: String,
      default: "https://res.cloudinary.com/dglpt68wc/image/upload/v1781976750/default_aacjjm.png",
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function( email, password ){
  const user = await this.findOne({ email });
  // console.log(user);
  if(!user)  throw new Error("User Not Found");

  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if( hashedPassword !== userProvidedHash ) throw Error("Incorrect password");

  const token = createTokenForUser( user );
  return token;
});

const User = model("user", userSchema);

module.exports = User;
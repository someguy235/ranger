const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const TripSchema = new Schema({
  user: {
    type: String,
    required: true,
    unique: false,
  },
  title: {
    type: String,
    required: true,
    unique: false,
  },
  bDate: {
    type: Date,
    required: true,
    unique: false,
  },
  eDate: {
    type: Date,
    required: true,
    unique: false,
  },
  kml: {
    type: Buffer,
    required: true,
    unique: false,
  },
  image: {
    type: Buffer,
    required: true,
    unique: false,
  },
  parks: {
    type: Array,
    required: true,
    unique: false,
  },
});

const ParkSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const UserModel = mongoose.model("user", UserSchema);
const TripModel = mongoose.model("trip", TripSchema);
const ParkModel = mongoose.model("park", ParkSchema);

module.exports = { UserModel, TripModel, ParkModel };

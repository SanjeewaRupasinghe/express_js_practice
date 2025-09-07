import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    order: {
      type: Object,
      default: {
        test: "test",
      },
    },
  },
  { timestamps: true }
);

const Person = mongoose.model("Person", personSchema);

export default Person;

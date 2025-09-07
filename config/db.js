import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://madushaniagdd_db_user:LtItzh3HMXaz6HFs@cluster0.jy32cjs.mongodb.net/express?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

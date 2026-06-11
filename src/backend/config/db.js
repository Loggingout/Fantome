import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error(
      "❌ ERROR: MONGODB_URI is missing"
    );

    process.exit(1);
  }

  try {
    await mongoose.connect(
      mongoURI
    );

    console.log(
      "✓ MongoDB Connected Successfully"
    );
  } catch (err) {
    console.error(
      "MongoDB Connection Error:",
      err
    );

    process.exit(1);
  }
};
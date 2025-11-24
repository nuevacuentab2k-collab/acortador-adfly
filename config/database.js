const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;

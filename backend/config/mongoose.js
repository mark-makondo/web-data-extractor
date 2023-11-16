import mongoose from "mongoose";

class Mongoose {
  constructor(host) {
    this.host =
      host || process.env.MONGODB_URI || "mongodb://localhost:27017/laranode";
  }
  start() {
    mongoose.connect(this.host, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on("connected", () => this.connected());
  }
}

export default Mongoose;

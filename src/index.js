const express =require("express");
const connectDB =require("./db_connection/config");
const cors =require("cors");
const app = express();
const dotenv =require("dotenv");
const routes = require("../src/routes/routes");
const projectRoutes =require("../src/routes/Project/project")
dotenv.config({ path: './.env' });
const PORT = process.env.PORT;
const db = process.env.MONGO_URI;
const cookieParser = require("cookie-parser");



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 Connect to MongoDB
connectDB(db);
app.use("/v1", routes);
app.use("/v1/project", projectRoutes);

// 🔹 Server Listen
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});

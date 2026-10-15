
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import documentRoutes from "./routes/documentRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());  

app.use("/api/documents", documentRoutes);
app.use("/api/assessments", assessmentRoutes);

// app.use((err, req, res, next) => {
//   console.error("API error:", err.message);

//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal server error",
//   });
// });
                                                             
app.get("/api/status", (req, res) => {                       
  res.json({                                                 
    success: true,                                           
    message: "Grant Assistant API is running",               
  });                                                        
});                                                          

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

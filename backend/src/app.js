import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from "helmet";



const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://smart-home-integration.vercel.app", 
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));

app.get("/", (req, res) => {
  res.json({
    message: "Backend Connected Successfully"
  });
});

app.use(helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false
}));

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
  });  

// middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)

// Global error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export { app };

import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import 'reflect-metadata'; 

dotenv.config();

export const app = express();

const port = process.env.PORT || 3000;

const allowedOrigins = [
  `http://localhost:${port}`,
];

const corsOptions:CorsOptions  = {
  origin(origin, callback) {

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Identity', 'Accept', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
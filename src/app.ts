import express from 'express';
import 'reflect-metadata'; 

export const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import express from 'express';
import dotenv from 'dotenv';
import { mongodb } from './db/mongoose.js';
import { AdminRouter } from './routes/Admin.routes.js';
import { ProductRouter } from './routes/Product.routes.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors'; // ❗️You forgot to import this
const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Routes
app.get('/', (req, res) => {
  res.send("Hello World");
});
app.use('/admin', AdminRouter);
app.use('/product', ProductRouter);

mongodb();

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});

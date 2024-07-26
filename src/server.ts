import Express from 'express';
import cors from 'cors';
import mainRoute from "./routes"
import contractRoutes from './routes/contractRoutes';

const app = Express();

const PORT = 8000;

app.use(Express.json());

app.use(cors());

app.use("/", mainRoute)

app.use("/contract", contractRoutes)

const server = app.listen(PORT, () =>{
  console.log(`Server running on ${PORT}`)
})


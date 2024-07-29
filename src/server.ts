import Express from 'express';
import cors from 'cors';
import contractRoutes from './routes/contractRoutes';

const app = Express();

const PORT = 8000;

app.use(Express.json());

app.use(cors());

app.use("/", contractRoutes)

const server = app.listen(PORT, () =>{
  console.log(`Server running on ${PORT}`)
})

export { server };

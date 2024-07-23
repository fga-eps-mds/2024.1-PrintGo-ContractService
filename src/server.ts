import Express from 'express';
import cors from 'cors';
import mainRoute from "./routes"

const app = Express();

const PORT = 8000;

app.use(Express.json());

app.use(cors());

app.use("/", mainRoute)

const server = app.listen(PORT, () =>{
  console.log(`Server running on ${PORT}`)
})


import Express from 'express';
import cors from 'cors';
import contractRoutes from './routes/contractRoutes';

const app = Express();

const PORT = process.env.PORT || 8002;

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
};

app.use(Express.json());

app.use(cors(corsOptions));

app.use("/", contractRoutes)

const server = app.listen(PORT, () =>{
  console.log(`Server running on ${PORT}`)
})

export { server };

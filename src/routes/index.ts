import { Router } from "express";

const mainRoute = Router();

mainRoute.use((req, res, next) => {
  console.log('Horário: ', Date.now())
  next()
})

mainRoute.get('/contracts', (req, res) => {
  res.status(200)
  res.json("Main endpoint!")
})

export default mainRoute
import request from 'supertest';
import Express from 'express';
import mainRoute from "../src/routes/index";

const app = Express();

app.use(Express.json());
app.use("/", mainRoute);

describe('GET /', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/contracts');
    expect(response.status).toBe(200);
  });
});
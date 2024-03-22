import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const events = [];

app.get("/events", (req, res) => {
  res.send(events);
})

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://localhost:4000/events", event).catch(err => {
    console.log(err);
  });
  axios.post("http://localhost:4001/events", event).catch(err => {
    console.log(err);
  });
  axios.post("http://localhost:4002/events", event).catch(err => {
    console.log(err);
  });
  axios.post("http://localhost:4003/events", event).catch(err => {
    console.log(err);
  });

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log("Listening on port 4005");
});
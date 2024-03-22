import express from 'express';
import bodyParser from 'body-parser';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;

  res.send(commentsByPostId[id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const { id } = req.params;

  const comments = commentsByPostId[id] || [];

  comments.push({
    id: commentId,
    content
  });

  commentsByPostId[id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: id
    }
  }).catch(err => {
    console.log(err);
  });

  res.status(201).send(comments);
});

app.post("/events", (req, res) => {
  console.log('Received Event:', req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});
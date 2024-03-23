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
    content,
    status: 'pending'
  });

  commentsByPostId[id] = comments;

  await axios.post("http://event-bus-clusterip-srv:4005/events", {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      status: 'pending',
      postId: id
    }
  }).catch(err => {
    console.log(err);
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, content, status } = data;

    const comment = commentsByPostId[postId].find(comment => {
      return comment.id === id
    });
    comment.status = status;

    await axios.post("http://event-bus-clusterip-srv:4005/events", {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        status,
        postId
      }
    }).catch(err => {
      console.log(err);
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});
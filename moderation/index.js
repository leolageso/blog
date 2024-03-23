import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const handleEvent = async (type, data) => {
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://event-bus-clusterip-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }
}

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4003, async () => {
  console.log("Listening on port 4003");

  try {
    const res = await axios.get("http://event-bus-clusterip-srv:4005/events");

    for (let event of res.data) {
      console.log(`Processing event: ${event.type}`);

      handleEvent(event.type, event.data)
    }

  } catch (error) {
    console.log(error);
  }
})
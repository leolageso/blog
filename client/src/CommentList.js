import React from "react";

const CommentList = ({ comments }) => {
  console.log(comments);
  const renderedComments = comments.map(comment => {
    let content;

    if (comment.status === "approved") {
      content = comment.content;
    } else if (comment.status === "pending") {
      content = "This comment is awaiting moderation"
    } else {
      content = "This comment has been rejected"
    }

    return <li key={comment.id}>
      {content}
    </li>;
  });

  return <div>
    {comments.length} comments
    <ul>
      {renderedComments}
    </ul >
  </div>;
};

export default CommentList;
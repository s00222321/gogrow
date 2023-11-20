import React, { useEffect, useState } from "react";
import { formatDate } from '../../utils';
import {
  MDBCard,
  MDBCardBody,
  MDBCardText
} from "mdb-react-ui-kit";

interface CommentData {
  commentId: string;
  content: string;
  username: string;
  postedAt: string;
}

const ForumPostComment: React.FC<{ post_id: string }> = ({ post_id }) => {
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!post_id) return;
        const response = await fetch(`https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts/${post_id}/comments`);
        const commentsData = await response.json();

        const parsedComments = JSON.parse(commentsData.body).comments;

        if (Array.isArray(parsedComments)) {
          setComments(parsedComments);
        } else {
          console.error("Invalid comments data format. Expected an array:", parsedComments);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [post_id]);

  return (
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <MDBCard key={comment.commentId} className="my-3">
            <MDBCardBody>
              <MDBCardText>{comment.username}</MDBCardText>
              <MDBCardText>{comment.content}</MDBCardText>
              <MDBCardText>
                <strong>Comment Date:</strong>{" "}
                {formatDate(comment.postedAt)}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        ))
      ) : (
        <p>No comments available</p>
      )}
    </div>
  );
};

export default ForumPostComment;

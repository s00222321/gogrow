import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ForumPostComment from "./ForumPostComment";
import { formatDate } from '../../utils';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBCardFooter,
  MDBInputGroup,
  MDBBtn
} from "mdb-react-ui-kit";

interface PostData {
  postId: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  lastUpdated: string;
  media: string;
  userProfilePic: string;
}

const ForumPost: React.FC = () => {
  const { post_id } = useParams<{ post_id: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts/${post_id}`
        );
        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
  }, [post_id]);

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts/${post_id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: post_id,
            username: 'mairead_murphy', // Replace with the actual username or get it dynamically
            content: comment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log('Comment submitted successfully!');
      setComment('');
      window.location.reload(); // need to change to only rerender component
    } catch (error: any) {
      console.error('Error submitting comment:', error.message);
    }
  };

  return (
    <MDBContainer className="py-5">
      <MDBBtn href="/forum" className="mb-2">
        <i className="fas fa-arrow-left me-2"></i>All Posts
      </MDBBtn>
      {post ? (
        <MDBCard className="mb-3">
          <MDBCardBody>
            {post.media && (
              <div className="text-center">
                <MDBCardImage src={post.media} alt="Article Image" fluid className="w-100" />
              </div>
            )}
            <div className="mt-3">
              <MDBCardText>
                {post.userProfilePic && (
                  <img
                    src={post.userProfilePic}
                    alt={`${post.username}'s Avatar`}
                    className="rounded-circle me-2"
                    style={{ width: '30px', height: '30px' }}
                  />
                )}
                {post.username}
              </MDBCardText>
              <MDBCardTitle>{post.title}</MDBCardTitle>
              <MDBCardText>
                <strong>Posted:</strong> {formatDate(post.createdAt)}
              </MDBCardText>
              <MDBCardText>{post.content}</MDBCardText>
            </div>
            <ForumPostComment post_id={post_id!} />
          </MDBCardBody>

          <MDBCardFooter className="text-muted">
            <form onSubmit={handleCommentSubmit}>
              <MDBInputGroup>
                <input
                  type="text"
                  id="comment"
                  name="comment"
                  placeholder="Add a comment..."
                  className="form-control"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <MDBBtn type="submit" className="btn btn-outline-primary">
                  <i className="fas fa-arrow-right"></i>
                </MDBBtn>
              </MDBInputGroup>
            </form>
          </MDBCardFooter>
        </MDBCard>
      ) : (
        <p>Loading...</p>
      )}
    </MDBContainer>
  );
};

export default ForumPost;

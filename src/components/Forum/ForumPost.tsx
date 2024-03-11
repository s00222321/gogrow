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
import { useAuth } from '../AuthContext';
import { FORUM_API, MODERATOR_URL } from '../../apis';

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
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [reloadComments, setReloadComments] = useState<boolean>(false);
  const { loginData } = useAuth();

  const alertStyles = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    maxWidth: '700px',
    zIndex: 9999,
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${FORUM_API}/posts/${post_id}`
        );
        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        setPost(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
    setReloadComments(false);
  }, [post_id, reloadComments]);

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const postId = post_id;
    const username = loginData?.username;

    try {
      const toxicityScore = await performToxicityAnalysis(comment);

      console.log('Toxicity Score:', toxicityScore);

      if (toxicityScore < 0.5) {
        const response = await fetch(
          `${FORUM_API}/posts/${postId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              postId: postId,
              username: username,
              content: comment,
            }),
          }
        );

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}`);
        } else {
          console.log('Comment submitted successfully!');
          setComment('');
          setReloadComments(true);
        }
      } else {
        setShowAlert(true);
        setComment('');
      }
    } catch (error: any) {
      console.error('Error submitting comment:', error.message);
    }
  };

  const performToxicityAnalysis = async (toCheck: string) => {
    const payload = {
      text: toCheck
    };

    try {
      const response = await fetch(MODERATOR_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: JSON.stringify(payload) }),
      });

      if (!response.ok) {
        throw new Error(`Toxicity analysis failed. Status: ${response.status}`);
      }

      const data = await response.json();
      const responseBody = JSON.parse(data.body);
      const toxicityScore = parseFloat(responseBody.ToxicityScore);
      return toxicityScore;

    } catch (error) {
      console.error('Error performing toxicity analysis:', error);
      throw error;
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
            <ForumPostComment post_id={post_id!} reloadComments={reloadComments} />
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
          {showAlert && (
            <div
              className="custom-alert alert alert-danger alert-dismissible fade show"
              role="alert"
              style={alertStyles as any}
            >
              This post contains inappropriate content. Please revise your post.
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAlert(false)}
              ></button>
            </div>
          )}
        </MDBCard>
      ) : (
        <p>Loading...</p>
      )}
    </MDBContainer>
  );
};

export default ForumPost;

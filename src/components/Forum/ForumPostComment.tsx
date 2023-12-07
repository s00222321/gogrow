import React, { useEffect, useState } from "react";
import { formatDate } from '../../utils';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText
} from "mdb-react-ui-kit";
import ConfirmDialog from '../Shared/ConfirmDialog';

interface CommentData {
  commentId: string;
  content: string;
  username: string;
  postedAt: string;
  userProfilePic: string;
}

const API_URL = 'https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts';

interface ForumPostCommentProps {
  post_id: string;
  reloadComments: boolean;
}

const ForumPostComment: React.FC<ForumPostCommentProps> = ({ post_id, reloadComments }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!post_id) return;
        const response = await fetch(`${API_URL}/${post_id}/comments`);
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
  }, [post_id, reloadComments]); // Include reloadComments in the dependency array

  const handleDeleteComment = (comment_id: string) => {
    setCommentToDelete(comment_id);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmationDialogOpen(false);

    try {
      const response = await fetch(`${API_URL}/${post_id}/comments/${commentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Comment with ID ${commentToDelete} deleted successfully.`);
        setComments((prevComments) => prevComments.filter((comment) => comment.commentId !== commentToDelete));
      } else {
        console.error(`Failed to delete comment with ID ${commentToDelete}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while deleting the comment:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationDialogOpen(false);
    setCommentToDelete('');
  };

  return (
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <MDBCard key={comment.commentId} className="my-3">
            <MDBCardBody>
              <MDBCardText>
                {comment.userProfilePic && (
                  <img
                    src={comment.userProfilePic}
                    alt={`${comment.username}'s Avatar`}
                    className="rounded-circle me-2"
                    style={{ width: '30px', height: '30px' }}
                  />
                )}
                {comment.username}
              </MDBCardText>
              <MDBCardText>{comment.content}</MDBCardText>
              <MDBCardText>
                <strong>Comment Date:</strong>{" "}
                {formatDate(comment.postedAt)}
              </MDBCardText>
            </MDBCardBody>
            <MDBBtn
              color="danger"
              className="position-absolute top-0 end-0 m-2"
              onClick={() => handleDeleteComment(comment.commentId)}
            >
              <i className="fas fa-trash-alt"></i>
            </MDBBtn>
          </MDBCard>
        ))
      ) : (
        <p>No comments available</p>
      )}

      <ConfirmDialog
        isOpen={isConfirmationDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this comment?"
        title="Delete comment?"
      />
    </div>
  );
};

export default ForumPostComment;

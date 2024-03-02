import React, { useEffect, useState } from "react";
import { formatDate } from '../../utils';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText
} from "mdb-react-ui-kit";
import ConfirmDialog from '../Shared/ConfirmDialog';
import { useAuth } from '../AuthContext';
import { FORUM_API } from '../../apis'

interface CommentData {
  commentId: string;
  content: string;
  username: string;
  postedAt: string;
  userProfilePic: string;
}

interface ForumPostCommentProps {
  post_id: string;
  reloadComments: boolean;
}

const ForumPostComment: React.FC<ForumPostCommentProps> = ({ post_id, reloadComments }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string>('');
  const { loginData } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (!post_id) return;
        const response = await fetch(`${FORUM_API}/posts/${post_id}/comments`);
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
  }, [post_id, reloadComments]);

  const handleDeleteComment = (comment_id: string) => {
    setCommentToDelete(comment_id);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmationDialogOpen(false);

    try {
      const response = await fetch(`${FORUM_API}/posts/${post_id}/comments/${commentToDelete}`, {
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
            {loginData?.username === comment.username || loginData?.username === 'admin' ? (
              <MDBBtn
                color="danger"
                className="position-absolute top-0 end-0 m-2"
                onClick={() => handleDeleteComment(comment.commentId)}
              >
                <i className="fas fa-trash-alt"></i>
              </MDBBtn>
            ) : null}
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

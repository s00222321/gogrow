// Forum.tsx
import React, { useEffect, useState } from 'react';
import { formatDate } from '../../utils';
import {
  MDBContainer,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBCardText,
  MDBCardTitle
} from 'mdb-react-ui-kit';
import AddPostFormModal from './AddPostFormModal';
import ConfirmDialog from '../Shared/ConfirmDialog';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditPostFormModal from './EditPostForumModal';

// put in .env?
const API_URL = 'https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts';
const MODERATOR_URL = 'https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/moderator';
const IMAGE_MODERATOR_URL = 'https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/imagemoderation';

interface PostData {
  postId: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  lastUpdated: string;
  userProfilePic: string;
  media: string | null;
  tags: string[];
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [editPostData, setEditPostData] = useState<PostData | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false); // New state for edit modal


  const alertStyles = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    maxWidth: '700px',
    zIndex: 9999,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const responseBody = data.body ? JSON.parse(data.body) : null;

      if (Array.isArray(responseBody)) {
        setPosts(responseBody);
      } else {
        console.error('Invalid data format. Expected an array:', responseBody);
      }
    } catch (error) {
      console.error('Error fetching data:', (error as Error).message);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewPostClick = () => {
    setShowNewPostModal(true);
  };

  const handleNewPostClose = () => {
    setShowNewPostModal(false);
  };

  const handleNewPostSubmit = async (postData: { title: string; content: string; media: string | null; tags: string[] }) => {
    const updatedPostData = { ...postData, username: 'sean_oconnor' };

    try {
      const toxicityScore = await performToxicityAnalysis(updatedPostData.title + ' ' + updatedPostData.content);
      let imageModerationStatus = 'Approved';

      if (updatedPostData.media) {
        imageModerationStatus = await performImageModerationAnalysis(updatedPostData.media);
      }

      if (toxicityScore < 0.4 && imageModerationStatus === 'Approved') {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: updatedPostData.title,
            content: updatedPostData.content,
            username: updatedPostData.username,
            tags: updatedPostData.tags,
            media: updatedPostData.media,
          }),
        });

        if (!response.ok) {
          console.log(response.json());
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newPost = await response.json();
        setPosts((prevPosts) => [...prevPosts, newPost]);
        setShowNewPostModal(false);
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error submitting new post:', (error as Error).message);
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
      console.log("Toxicity Score: " + toxicityScore);
      return toxicityScore;

    } catch (error) {
      console.error('Error performing toxicity analysis:', error);
      throw error;
    }
  };

  const performImageModerationAnalysis = async (media: string): Promise<string> => {
    const payload = {
      imageBase64: media,
    };

    try {
      const response = await fetch(IMAGE_MODERATOR_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: JSON.stringify(payload) }),
      });

      if (!response.ok) {
        throw new Error(`Image moderation analysis failed. Status: ${response.status}`);
      }

      const data = await response.json();
      const responseBody = JSON.parse(data.body);
      const moderationStatus = responseBody.ModerationStatus;

      console.log("Media inappropriate " + responseBody.Confidence);

      return moderationStatus;
    } catch (error) {
      console.error('Error performing image moderation analysis:', error);
      throw error;
    }
  };

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${postToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`Post with ID ${postToDelete} deleted successfully.`);
        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postToDelete)); // update state
      } else {
        console.error(`Failed to delete post with ID ${postToDelete}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while deleting the post:', error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEditPost = (postId: string) => {
    const postToEdit = posts.find((post) => post.postId === postId);
    setEditPostData(postToEdit || null);
    setShowEditModal(true); // Open the edit modal
  };

  const handleEditPostSubmit = async (updatedData: {
    postId: string;
    title: string;
    content: string;
    media: string | null;
    tags: string[];
  }) => {
    try {
      const toxicityScore = await performToxicityAnalysis(updatedData.title + ' ' + updatedData.content);
      let imageModerationStatus = 'Approved';

      if (updatedData.media) {
        imageModerationStatus = await performImageModerationAnalysis(updatedData.media);
      }

      if (toxicityScore < 0.4 && imageModerationStatus === 'Approved') {
        const response = await fetch(`${API_URL}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.postId === editPostData?.postId
                ? { ...post, ...updatedData }
                : post
            )
          );

          console.log('Post updated successfully:', updatedData);
        } else {
          console.error(
            `Failed to update post with ID ${editPostData?.postId}. Status: ${response.status}`
          );
        }
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.error('An error occurred while updating the post:', error);
    } finally {
      setShowEditModal(false);
    }
  };

  return (
    <MDBContainer className="py-5">
      <div className="text-center mb-4">
        <span className="h4">Forum</span>
      </div>
      <div className="mb-4">
        <input
          className="form-control"
          type="text"
          id="search"
          name="search"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <MDBCol>
        <MDBBtn className="mb-2" onClick={handleNewPostClick}>
          <i className="fas fa-plus me-2"></i>New Post
        </MDBBtn>

        <AddPostFormModal
          onSubmit={handleNewPostSubmit}
          onClose={handleNewPostClose}
          showModal={showNewPostModal}
        />

        {posts
          .filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((post) => (
            <div
              key={post.postId}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <MDBCard className="mb-4">
                <MDBCardBody>
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
                  <MDBCardText>{post.content}</MDBCardText>
                  <MDBCardText>
                    <strong>Posted: </strong> {formatDate(post.createdAt)}
                  </MDBCardText>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    {/* Read More Button */}
                    <MDBBtn href={`/forum/${post.postId}`} className="me-2">
                      Read More
                    </MDBBtn>
                    <div className="d-flex">
                      <MDBBtn
                        color="warning"
                        className="me-2"
                        onClick={() => handleEditPost(post.postId)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </MDBBtn>
                      <MDBBtn
                        color="danger"
                        onClick={() => handleDeletePost(post.postId)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </MDBBtn>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </div>
          ))}
      </MDBCol>
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this post?"
        title="Delete Post?"
      />
      {showAlert && (
        <div
          className="custom-alert alert alert-danger alert-dismissible fade show"
          role="alert"
          style={alertStyles as any}
        >
          This post contains inappropriate content. Please revise your post.
          <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
        </div>
      )}
      {editPostData && (
        <EditPostFormModal
          post={editPostData}
          onClose={() => {
            setEditPostData(null);
          }}
          onSubmit={handleEditPostSubmit}
          showModal={showEditModal}
        />
      )}
    </MDBContainer>
  );
}

export default Forum;

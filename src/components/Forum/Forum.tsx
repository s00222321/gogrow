// Forum.tsx
import React, { useEffect, useState } from 'react';
import { formatDate } from '../../utils';
import { MDBContainer, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBCardText, MDBCardTitle } from 'mdb-react-ui-kit';
import AddPostFormModal from './AddPostFormModal';

const API_URL = 'https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts';

interface PostData {
  postId: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  lastUpdated: string;
  userProfilePic: string;
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);

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
    // Set the username to "sean_oconnor"
    const updatedPostData = { ...postData, username: 'sean_oconnor' };

    // Log the submitted data (for debugging)
    console.log('Submitted Data:', updatedPostData);

    // Create FormData object
    const formData = new FormData();
    formData.append('title', updatedPostData.title);
    formData.append('content', updatedPostData.content);
    formData.append('media', updatedPostData.media || ''); // Ensure it's not null
    formData.append('tags', JSON.stringify(updatedPostData.tags));

    // Perform the API call to submit the new post data
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log(response.json());
        throw new Error(`HTTP error! Status: ${response.status}`);
      }


      // Assuming the API returns the newly created post data
      const newPost = await response.json();

      // Update the posts state to include the new post
      setPosts((prevPosts) => [...prevPosts, newPost]);

      // Reset the new post modal state
      setShowNewPostModal(false);
    } catch (error) {
      console.error('Error submitting new post:', (error as Error).message);
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
                  <MDBBtn href={`/forum/${post.postId}`}>
                    Read More
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </div>
          ))}
      </MDBCol>
    </MDBContainer>
  );
};

export default Forum;

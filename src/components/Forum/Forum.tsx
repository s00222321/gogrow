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

// put in .env?
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

  // TO DO : Get username from currently logged in user
  const handleNewPostSubmit = async (postData: { title: string; content: string; media: string | null; tags: string[] }) => {
    // Set the username to "sean_oconnor" will have to be changed
    const updatedPostData = { ...postData, username: 'sean_oconnor' };
    console.log('Submitted Data:', updatedPostData);
  
    try {
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
    } catch (error) {
      console.error('Error submitting new post:', (error as Error).message);
    }
  };

  // TO DO - only allow currently logged in user to delete their post unless they are admin
  // TO DO - make confirmation window prettier
  const handleDeletePost = async (postId: string) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this post?');
  
    if (!isConfirmed) { return;}
  
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log(`Post with ID ${postId} deleted successfully.`);
        setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId)); // update state
      } else {
        console.error(`Failed to delete post with ID ${postId}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while deleting the post:', error);
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
                <MDBBtn
                  color="danger"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={() => handleDeletePost(post.postId)}
                >
                  <i className="fas fa-trash-alt"></i>
                </MDBBtn>
              </MDBCard>
            </div>
          ))}
      </MDBCol>
    </MDBContainer>
  );
};

export default Forum;

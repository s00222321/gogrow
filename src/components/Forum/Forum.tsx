// Forum.tsx
import React, { useEffect, useState } from 'react';
import { formatDate } from '../../utils';
import { MDBContainer, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';

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
        <MDBBtn className="mb-2">
          <i className="fas fa-plus me-2"></i>New Post
        </MDBBtn>

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

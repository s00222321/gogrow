import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from 'mdb-react-ui-kit';

const API_URL = 'https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts';

interface PostData {
  postId: string;
  title: string;
  content: string;
  username: string;
  createdAt: string;
  lastUpdated: string;
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

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

      // Parse the JSON string if 'body' is present
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

  const fetchPostDetails = async (postId: string) => {
    try {
      const response = await fetch(`https://sdonwjg5b9.execute-api.eu-west-1.amazonaws.com/v1/posts/${postId}/comments`);
      const data = await response.json();
      console.log('Post details:', data);
      // Handle the post details as needed
    } catch (error) {
      console.error('Error fetching post details:', (error as Error).message);
    }
  };

  return (
    <MDBContainer className="py-5">
      <MDBRow className="g-4">
        {posts.map((post) => (
          <MDBCol key={post.postId} md="6" lg="4">
            <MDBCard>
              <MDBCardBody>
                <MDBCardText>{post.username}</MDBCardText>
                <MDBCardTitle>{post.title}</MDBCardTitle>
                <MDBCardText>{post.content}</MDBCardText>
                <MDBCardText>
                  <strong>Created At:</strong> {post.createdAt}
                </MDBCardText>
                <MDBCardText>
                  <strong>Last Updated:</strong> {post.lastUpdated}
                </MDBCardText>
                <MDBBtn onClick={() => fetchPostDetails(post.postId)}>View Details</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </MDBContainer>
  );
};

export default Forum;

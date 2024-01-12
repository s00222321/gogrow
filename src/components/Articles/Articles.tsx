import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBCardTitle,
  MDBCardImage,
  MDBBtn,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import AddArticleModal from './AddArticleModal';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(
        "https://yxk4xluq16.execute-api.eu-west-1.amazonaws.com/v1"
      );
      const responseData = await response.json();
      const data = JSON.parse(responseData.body);
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        console.error("No data available.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const trimContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleAddArticle = async (articleData: {
    title: string;
    content: string;
    publication_date: string;
    author: string;
    image: string | null;
  }) => {
    console.log(articleData.title)
    try {
      const response = await fetch(
        "https://yxk4xluq16.execute-api.eu-west-1.amazonaws.com/v1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: articleData.title,
            content: articleData.content,
            publication_date: articleData.publication_date,
            author: articleData.author,
            image: articleData.image,
          }),
        }
      );

      console.log(response)
  
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }
  
      const responseBody = await response.json();
  
      // Check if the response body contains the new article
      if (responseBody && responseBody.article_id) {
        // Update the state with the new article
        setArticles((prevArticles) => [...prevArticles, responseBody]);
      } else {
        console.error("Invalid response format:", responseBody);
      }
  
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting new article:', error);
    }
  };

  

  return (
    <MDBContainer
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        paddingTop: "3%",
        paddingBottom: "10%",
      }}
    >
      <div className="w-75">
        <div className="text-center mb-4">
          <span className="h4">Articles</span>
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
        <div className="mb-4">
          <MDBBtn onClick={openModal}>Add Article - Admin</MDBBtn>
        </div>
        <MDBRow>
          {articles
            .filter((article) =>
              article.title &&
              article.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((article) => (
              <MDBCol md="6" lg="4" key={article.article_id}>
                <div className="card mb-4">
                  <MDBCardImage
                    src={article.image}
                    position="top"
                    alt={article.title}
                  />
                  <MDBCardBody>
                    <MDBCardTitle>{article.title}</MDBCardTitle>
                    <p>{trimContent(article.content)}</p>
                    <MDBBtn href={`/article/${article.article_id}`}>
                      Read More
                    </MDBBtn>
                  </MDBCardBody>
                </div>
              </MDBCol>
            ))}
        </MDBRow>
      </div>
      <AddArticleModal
        onSubmit={handleAddArticle}
        onClose={() => setIsModalOpen(false)}
        showModal={isModalOpen}
      />
    </MDBContainer>
  );
};

export default Articles;

import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface ArticleData {
  article_id: string;
  title: string;
  author: string;
  publication_date: string;
  content: string;
}

const Articles: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
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

    fetchArticles();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MDBContainer
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundColor: "#E8F5E9",
      }}
    >
      <div className="p-5 border rounded shadow bg-white">
        <div className="text-center mb-4">
          <span className="h4">Articles</span>
        </div>
        <div className="mb-4">
          <MDBInput
            label="Search"
            type="text"
            id="search"
            name="search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div>
          {filteredArticles.map((article) => (
            <MDBCard
              className="mb-4"
              key={article.article_id}
              onClick={() => navigate(`/article/${article.article_id}`)} // Updated navigation logic
            >
              <MDBCardBody>
                <MDBCardTitle>{article.title}</MDBCardTitle>
                <p>
                  <strong>Author:</strong> {article.author}
                </p>
                <p>
                  <strong>Publication Date:</strong> {article.publication_date}
                </p>
                <p>
                  <strong>Content:</strong> {article.content}
                </p>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      </div>
    </MDBContainer>
  );
};

export default Articles;

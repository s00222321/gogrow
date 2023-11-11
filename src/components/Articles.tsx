import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBCardBody,
  MDBCardTitle,
  MDBCardImage,
  MDBBtn,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
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

  const trimContent = (content: string, maxLength: number = 100) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MDBContainer
      fluid
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        paddingTop: "10%",
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
        <MDBRow>
          {filteredArticles.map((article) => (
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
    </MDBContainer>
  );
};

export default Articles;

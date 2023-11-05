import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";

interface ArticleData {
  article_id: string;
  title: string;
  author: string;
  publication_date: string;
  content: string;
}

const Article: React.FC = () => {
  const { article_id } = useParams<{ article_id: string }>();
  const [article, setArticle] = useState<ArticleData | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://yxk4xluq16.execute-api.eu-west-1.amazonaws.com/v1/${article_id}`
        );
        const responseData = await response.json();
        const data = JSON.parse(responseData.body);
        setArticle(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchArticle();
  }, [article_id]);

  return (
    <MDBContainer
      fluid
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{
        backgroundColor: "#E8F5E9",
      }}
    >
      <div className="p-5 border rounded shadow bg-white">
        {article ? (
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>{article.title}</MDBCardTitle>
              <p>
                <strong>Article ID:</strong> {article.article_id}
              </p>
              <p>
                <strong>Publication Date:</strong> {article.publication_date}
              </p>
              <p>
                <strong>Author:</strong> {article.author}
              </p>
              <p>
                <strong>Content:</strong> {article.content}
              </p>
            </MDBCardBody>
          </MDBCard>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </MDBContainer>
  );
};

export default Article;

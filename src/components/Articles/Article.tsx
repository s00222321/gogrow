import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBCardImage,
} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";

interface ArticleData {
  article_id: string;
  title: string;
  author: string;
  publication_date: string;
  content: string;
  image: string;
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
    <MDBContainer className="py-5">
      {article ? (
        <MDBCard>
          <MDBRow className="g-0">
            <MDBCol
              md="4"
              className="overflow-hidden"
              style={{ borderRadius: "0.5rem" }}
            >
              <MDBCardImage src={article.image} alt="Article Image" fluid />
            </MDBCol>
            <MDBCol md="8">
              <MDBCardBody>
                <MDBCardTitle>{article.title}</MDBCardTitle>
                <MDBCardText>
                  <strong>Publication Date:</strong> {article.publication_date}
                </MDBCardText>
                <MDBCardText>{article.content}</MDBCardText>
                <MDBCardText>
                  <strong>Author:</strong> {article.author}
                </MDBCardText>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      ) : (
        <p>Loading...</p>
      )}
    </MDBContainer>
  );
};

export default Article;
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
  MDBBtn,
} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";
import ConfirmDialog from '../Shared/ConfirmDialog';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

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

  const handleDeleteArticle = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://yxk4xluq16.execute-api.eu-west-1.amazonaws.com/v1/${article_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log(`Article with ID ${article_id} deleted successfully.`);
        // Update the component state to remove the deleted article
        setArticle(null);
      } else {
        console.error(`Failed to delete article with ID ${article_id}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while deleting the article:', error);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const closeConfirmDialog = () => {
    setShowDeleteConfirm(false);
  };

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
                <MDBBtn
                        color="danger"
                        onClick={handleDeleteArticle}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </MDBBtn>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      ) : (
        <p>Article not found or deleted.</p>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={closeConfirmDialog}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this article?"
        title="Delete Article?"
      />
    </MDBContainer>
  );
};

export default Article;

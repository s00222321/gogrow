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
import ConfirmDialog from '../Shared/ConfirmDialog';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

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

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return;
      }

      const responseBody = await response.json();

      if (responseBody && responseBody.article_id) {
        fetchArticles();
        setIsModalOpen(false);
        console.log("Article successfully added")
      } else {
        console.error("Invalid response format:", responseBody);
      }
    } catch (error) {
      console.error('Error submitting new article:', error);
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticleToDelete(articleId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://yxk4xluq16.execute-api.eu-west-1.amazonaws.com/v1/${articleToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log(`Article with ID ${articleToDelete} deleted successfully.`);
        setArticles((prevArticles) => prevArticles.filter((article) => article.article_id !== articleToDelete));
      } else {
        console.error(`Failed to delete article with ID ${articleToDelete}. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while deleting the article:', error);
    } finally {
      setShowDeleteConfirm(false);
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
                  <MDBCardBody className="d-flex flex-column">
                    <MDBCardTitle>{article.title}</MDBCardTitle>
                    <p>{trimContent(article.content)}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <MDBBtn href={`/article/${article.article_id}`} className="me-2">
                        Read More
                      </MDBBtn>
                      <MDBBtn
                        color="danger"
                        onClick={() => handleDeleteArticle(article.article_id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </MDBBtn>
                    </div>
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
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this article?"
        title="Delete Article?"
      />
    </MDBContainer>
  );
};

export default Articles;

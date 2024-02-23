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
import EditArticleModal from './EditArticleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';

const API_URL = "https://yxk4xluq16.execute-api.eu-west-1.amazonaws.com/v1"

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
  const [editArticleData, setEditArticleData] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const { loginData } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 990) {
        setItemsPerPage(9);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    fetchArticles();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(API_URL);
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
    setCurrentPage(1);
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
        API_URL,
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
        `${API_URL}/${articleToDelete}`,
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

  const handleEditArticle = (articleId: string) => {
    const articleToEdit = articles.find((article) => article.article_id === articleId);
    setEditArticleData(articleToEdit || null);
    setShowEditModal(true);
  };

  const handleEditArticleSubmit = async (updatedData: {
    article_id: string;
    title: string;
    content: string;
    publication_date: string;
    author: string;
    image: string | null;
  }) => {
    try {
      console.log(JSON.stringify(updatedData))
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.article_id === editArticleData?.article_id
              ? { ...article, ...updatedData }
              : article
          )
        );

        console.log('Article updated successfully:', updatedData);
      } else {
        console.error(
          `Failed to update article with ID ${editArticleData?.article_id}. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error('An error occurred while updating the article:', error);
    } finally {
      setShowEditModal(false);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
          <MDBBtn onClick={openModal} className={loginData?.username === 'admin' ? '' : 'd-none'}>
            Add Article
          </MDBBtn>
        </div>
        <MDBRow>
        {currentArticles.map((article) => (
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
                      {loginData?.username === 'admin' && (
                        <div className="d-flex">
                          <MDBBtn
                            color="warning"
                            className="me-2"
                            onClick={() => handleEditArticle(article.article_id)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </MDBBtn>
                          <MDBBtn
                            color="danger"
                            onClick={() => handleDeleteArticle(article.article_id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </MDBBtn>
                        </div>
                      )}
                    </div>
                  </MDBCardBody>
                </div>
              </MDBCol>
            ))}
        </MDBRow>
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(filteredArticles.length / itemsPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a
                    href="#!"
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <AddArticleModal
        onSubmit={handleAddArticle}
        onClose={() => setIsModalOpen(false)}
        showModal={isModalOpen}
      />
      <EditArticleModal
        article={editArticleData}
        onClose={() => {
          setEditArticleData(null);
        }}
        onSubmit={handleEditArticleSubmit}
        showModal={showEditModal}
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

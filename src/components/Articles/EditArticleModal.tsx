import React, { useState, useEffect } from 'react';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter
} from 'mdb-react-ui-kit';

interface EditArticleModalProps {
    article: {
        article_id: string;
        title: string;
        content: string;
        publication_date: string;
        author: string;
        image: string | null;
    };
    onSubmit: (updatedData: {
        article_id: string;
        title: string;
        content: string;
        publication_date: string;
        author: string;
        image: string | null;
    }) => void;
    onClose: () => void;
    showModal: boolean;
}

const EditArticleModal: React.FC<EditArticleModalProps> = ({ article, onSubmit, onClose, showModal }) => {
    if (!article) {
        return null;
    }

    const [editedArticleData, setEditedArticleData] = useState({
        title: article.title,
        content: article.content,
        publication_date: article.publication_date,
        author: article.author,
        image: article.image,
    });

    useEffect(() => {
        setEditedArticleData({
            title: article.title,
            content: article.content,
            publication_date: article.publication_date,
            author: article.author,
            image: article.image,
        });
    }, [article]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setEditedArticleData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const updatedArticleData = {
            article_id: article.article_id,
            title: editedArticleData.title,
            content: editedArticleData.content,
            publication_date: editedArticleData.publication_date,
            author: editedArticleData.author,
            image: editedArticleData.image
        };

        onSubmit(updatedArticleData);
        onClose();
    };

    return (
        <MDBModal open={showModal} setopen={onClose} tabIndex='-1'>
            <MDBModalDialog>
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Edit Article</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="editedArticleTitle" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editedArticleTitle"
                                    name="title"
                                    value={editedArticleData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editedArticleContent" className="form-label">Content</label>
                                <textarea
                                    className="form-control"
                                    id="editedArticleContent"
                                    name="content"
                                    value={editedArticleData.content}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editedArticlePublicationDate" className="form-label">Publication Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="editedArticlePublicationDate"
                                    name="publication_date"
                                    value={editedArticleData.publication_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="editedArticleAuthor" className="form-label">Author</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editedArticleAuthor"
                                    name="author"
                                    value={editedArticleData.author}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                        </form>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={onClose}>
                            Close
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    );
};

export default EditArticleModal;

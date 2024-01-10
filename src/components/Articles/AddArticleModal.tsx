import React, { useState } from 'react';
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

interface AddArticleModalProps {
  onSubmit: (articleData: {
    title: string;
    content: string;
    publication_date: string;
    author: string;
    image: string | null;
  }) => void;
  onClose: () => void;
  showModal: boolean;
}

const AddArticleModal: React.FC<AddArticleModalProps> = ({ onSubmit, onClose, showModal }) => {
  const [newArticleData, setNewArticleData] = useState<{
    title: string;
    content: string;
    publication_date: string;
    author: string;
    image: string | null;
  }>({
    title: '',
    content: '',
    publication_date: '',
    author: '',
    image: null,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewArticleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const base64Content = await getBase64(files[0]);
      setNewArticleData((prevData) => ({ ...prevData, image: base64Content }));
    }
  };

  const getBase64 = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedArticleData = { ...newArticleData };

    onSubmit(updatedArticleData);
    setNewArticleData({ title: '', content: '', publication_date: '', author: '', image: null });
    onClose();
  };

  return (
    <MDBModal open={showModal} setopen={onClose} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Add a New Article</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <form onSubmit={handleSubmit}>
              {/* Other input fields */}
              <div className="mb-3">
                <label htmlFor="newArticleTitle" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="newArticleTitle"
                  name="title"
                  value={newArticleData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newArticleContent" className="form-label">Content</label>
                <textarea
                  className="form-control"
                  id="newArticleContent"
                  name="content"
                  value={newArticleData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newArticlePublicationDate" className="form-label">Publication Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="newArticlePublicationDate"
                  name="publication_date"
                  value={newArticleData.publication_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newArticleAuthor" className="form-label">Author</label>
                <input
                  type="text"
                  className="form-control"
                  id="newArticleAuthor"
                  name="author"
                  value={newArticleData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* ... Add other input fields as needed */}

              {/* ... */}
              <div className="mb-3">
                <label htmlFor="newArticleImage" className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="newArticleImage"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
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

export default AddArticleModal;

// AddPostFormModal.tsx
import React, { useState } from 'react';
import { MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter } from 'mdb-react-ui-kit';

interface AddPostFormModalProps {
  onSubmit: (postData: { title: string; content: string; media: File | null; tags: string[] }) => void;
  onClose: () => void;
  showModal: boolean;
}

const AddPostFormModal: React.FC<AddPostFormModalProps> = ({ onSubmit, onClose, showModal }) => {
  const [newPostData, setNewPostData] = useState<{ title: string; content: string; media: File | null; tags: string[] }>({
    title: '',
    content: '',
    media: null,
    tags: [],
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setNewPostData((prevData) => ({ ...prevData, media: files[0] }));
    }
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Assuming that tags are entered as a comma-separated string
    const tags = event.target.value.split(',').map(tag => tag.trim());
    setNewPostData((prevData) => ({ ...prevData, tags }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Set the username to "sean_oconnor" before calling the onSubmit function
    const updatedPostData = { ...newPostData, username: 'sean_oconnor' };

    onSubmit(updatedPostData);
    setNewPostData({ title: '', content: '', media: null, tags: [] });
    onClose();
  };

  return (
    <MDBModal open={showModal} setopen={onClose} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Add a New Post</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="newPostTitle" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="newPostTitle"
                  name="title"
                  value={newPostData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPostContent" className="form-label">Content</label>
                <textarea
                  className="form-control"
                  id="newPostContent"
                  name="content"
                  value={newPostData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPostMedia" className="form-label">Upload Media</label>
                <input
                  type="file"
                  className="form-control"
                  id="newPostMedia"
                  name="media"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newPostTags" className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  id="newPostTags"
                  name="tags"
                  value={newPostData.tags.join(', ')}
                  onChange={handleTagsChange}
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

export default AddPostFormModal;

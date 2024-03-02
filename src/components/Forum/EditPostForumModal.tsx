// EditPostFormModal.tsx
import React, { useState, useEffect } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

interface EditPostFormModalProps {
  post: {
    postId: string;
    title: string;
    content: string;
    media: string | null;
    tags: string[];
  };
  onSubmit: (postData: {
    postId: string;
    title: string;
    content: string;
    media: string | null;
    tags: string[];
  }) => void;
  onClose: () => void;
  showModal: boolean;
}

const EditPostFormModal: React.FC<EditPostFormModalProps> = ({ post, onSubmit, onClose, showModal }) => {
  const [editedPostData, setEditedPostData] = useState({
    title: post.title,
    content: post.content,
    media: post.media,
    tags: post.tags.join(', '),
  });

  useEffect(() => {
    setEditedPostData({
      title: post.title,
      content: post.content,
      media: post.media,
      tags: post.tags.join(', '),
    });
  }, [post]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditedPostData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tags = event.target.value;
    setEditedPostData((prevData) => ({ ...prevData, tags }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedPostData = {
      postId: post.postId,
      title: editedPostData.title,
      content: editedPostData.content,
      media: editedPostData.media,
      tags: editedPostData.tags.split(',').map((tag) => tag.trim()),
    };

    onSubmit(updatedPostData);
    onClose();
  };

  return (
    <MDBModal open={showModal} setopen={onClose} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Edit Post</MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <form onSubmit={handleSubmit}>
              {/* Hidden input for post_id */}
              <input type="hidden" name="postId" value={post.postId} />

              <div className="mb-3">
                <label htmlFor="editedPostTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editedPostTitle"
                  name="title"
                  value={editedPostData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editedPostContent" className="form-label">
                  Content
                </label>
                <textarea
                  className="form-control"
                  id="editedPostContent"
                  name="content"
                  value={editedPostData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editedPostTags" className="form-label">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editedPostTags"
                  name="tags"
                  value={editedPostData.tags}
                  onChange={handleTagsChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
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

export default EditPostFormModal;

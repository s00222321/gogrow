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
    postId: string; // Include post ID in the post object
    title: string;
    content: string;
    media: string | null;
    tags: string[];
  };
  onSubmit: (postData: {
    postId: string; // Include post ID in the updated data
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

  const handleMediaChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        const base64Content = await getBase64(files[0]);
        setEditedPostData((prevData) => ({ ...prevData, media: base64Content }));
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

  const handleTagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const tags = event.target.value;
    setEditedPostData((prevData) => ({ ...prevData, tags }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedPostData = {
      postId: post.postId, // Include post ID in the updated data
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
                <label htmlFor="editedPostMedia" className="form-label">
                  Upload Media
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="editedPostMedia"
                  name="media"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
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

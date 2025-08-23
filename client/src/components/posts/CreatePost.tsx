import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_POST } from '../../graphql/mutations';
import { CreatePostData } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { validatePost } from '../../utils/validation';

interface CreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    body: ''
  });
  const [errors, setErrors] = useState<Partial<CreatePostData>>({});

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      onPostCreated();
      setFormData({ title: '', body: '' });
      setErrors({});
    },
    onError: (error) => {
      console.error('Error creating post:', error);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreatePostData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validatePost(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createPost({
        variables: formData
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Post">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.body ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.body && <p className="mt-1 text-sm text-red-500">{errors.body}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePost;
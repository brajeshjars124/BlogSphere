import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('coverImage', coverImage);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5678/api/blog/add-new', {
        method: 'POST',
        headers: {
          
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success){
        navigate('/'); // Redirect to the home screen feed
      } else {
        setError(data.error || 'Failed to publish blog post');
      }
    } catch (err) {
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center m-4">
      <div className="col-md-8 border p-4 rounded bg-light shadow-sm">
        <h2 className="mb-4 text-center text-dark">Create a New Post</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Cover Image</label>
            <input 
              type="file" 
              className="form-control" 
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Blog Title</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Content</label>
            <textarea 
              className="form-control" 
              rows="8" 
              placeholder="What's on your mind? Write your article details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Blog'}
          </button>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';


export default function BlogDetails() {
  const { blogId } = useParams();
  const [user, setUser] = useState('');
  const [blogData, setBlogData] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/${blogId}`)
      .then((response)=>{
        if (!response.ok) {
          throw new Error('Article not found');
        }
        return response.json();
      })
      .then((data) => {
        setBlogData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [blogId]);
  console.log(blogId);
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/comment/${blogId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentText })
      });

      const data = await response.json();
      if (response.ok) {
        setBlogData(prev => ({
          ...prev,
          comments: [data.comment, ...prev.comments]
        }));
        setCommentText('');
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (err) {
      console.log('Comment error:', err); 

      alert('Failed to post comment. Please try again.');
    }
  };
  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    console.log(error); 

    return <div className="alert alert-danger text-center">{error}</div>;
  }

  if (!blogData || !blogData.blog) return null;
  const { blog, comments } = blogData;

  const ProfileImage = ({ user, size }) => (
    <div 
      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
      style={{ 
        width: size, 
        height: size,
        fontSize: `calc(${size} * 0.4)`
      }}
    >
      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
    </div>
  );
  
  return (
    <>
    <div className="container my-5" style={{ maxWidth: '800px' }}>
      <Link to="/" className="btn btn-light mb-4">← Back to Articles</Link>

      <h1 className="display-4 fw-bold mb-3">{blog.title}</h1>
      <div className="d-flex align-items-center gap-2 mb-4">
        <ProfileImage user={blog.createdBy} size="40px" />
        <div>
          <span className="fw-bold text-capitalize">{blog.createdBy?.fullName || 'Anonymous'}</span>
          <small className="text-muted d-block">Published on {new Date(blog.createdAt).toLocaleDateString()}</small>
        </div>
      </div>

      <img
        src={blog.coverImageURL}
        alt={blog.title}
        className="img-fluid rounded mb-4 w-100 object-fit-cover"
        style={{ maxHeight: '400px' }}
      />

      
      <div className="blog-content fs-5 lh-lg mb-5" style={{ whiteSpace: 'pre-line' }}>
        {blog.content}
      </div>

      <hr />

      
      <div className="comments-section mt-5">
        <h3 className="mb-4">Discussion ({comments?.length || 0})</h3>

      
        {localStorage.getItem('token') ? (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="form-group mb-2">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Join the discussion..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Post Comment</button>
          </form>
        ) : (
          <div className="alert alert-light border text-center mb-4">
            Please <Link to="/signin">Sign In</Link> to join the conversation.
          </div>
        )}

        <div className="comments-list d-flex flex-column gap-3">
          {comments?.length === 0 ? (
            <p className="text-muted italic">No comments posted yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="p-3 border rounded bg-light shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <ProfileImage user={comment.createdBy} size="30px" />
                  <span className="fw-bold text-capitalize small">{comment.createdBy?.fullName || 'Anonymous'}</span>
                  <small className="text-muted ms-auto" style={{ fontSize: '11px' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p className="mb-0 text-secondary small style-plain">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
}

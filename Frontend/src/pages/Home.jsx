import React, {useState, useEffect} from 'react';
import { Link } from 'react-router';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blog/all`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
        return res.json();
      })
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      }); 
  }, []);

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
    return <div className="alert alert-danger text-center">{error}</div>;
  }


  return (
    <>
      <div className="container my-4 ">
        <h1 className="mb-4 text-center text-secondary">Discover Stories & Ideas</h1>
        {blogs.length === 0 ? (
          <div className="alert alert-info text-center">No blogs available.</div>
        ):(
          <div className="row row-cols-3">
            {blogs.map((blog)=>(
              <div className="col" key={blog._id}>
                <div className="card h-100 shadow-sm border-0 position-relative">
                  <img 
                    src={
                      blog.coverImageURL
                        ? `${blog.coverImageURL}`
                        :'https://images.unsplash.com/photo-1499750310107-5fef28a66643'
                    }
                    className="card-img-top object-fit-cover" 
                    alt={blog.title}
                    style={{height: '200px'}}
                  />
                  <p className="card-text text-muted flex-grow-1">
                    {blog.body && blog.body.length > 120
                      ? `${blog.body.substring(0, 120)}...`
                      : blog.body}
                  </p>

                  <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      By <span className="fw-semibold text-capitalize">{blog.createdBy?.fullName || 'Anonymous'}</span>
                    </small>

                    <Link to={`/blog/${blog._id}`} className="btn btn-outline-primary btn-sm">
                      Read Article
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
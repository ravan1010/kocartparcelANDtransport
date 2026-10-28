
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api.js";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchPost = async () => {
    try {
      setError("");

      const response = await api.get("/api/posts/my-post", {
        withCredentials: true,
      });

      setPost(response.data.post || null);
    } catch (err) {
      if (err.response?.status === 404) {
        setPost(null);
      } else {
        setError(
          err.response?.data?.message || "Failed to load your post."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleDeletePost = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your post? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await api.delete(
        `/api/posts/${post._id}`,
        { withCredentials: true }
      );

      alert(response.data.message || "Post deleted successfully.");
      setPost(null);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to delete post.";

      setError(message);
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Manage your website posts and content.</p>
      </div>

      <div style={styles.card}>
        <h2>Posts Management</h2>

        {loading ? (
          <p>Loading your post...</p>
        ) : error && !post ? (
          <div>
            <p style={styles.error}>{error}</p>
            <button style={styles.button} onClick={fetchPost}>
              Retry
            </button>
          </div>
        ) : post ? (
          <div>
            <p style={styles.status}>Your post already exists</p>

            <p style={styles.description}>{post.description}</p>

            {Array.isArray(post.image) && post.image.length > 0 && (
              <div style={styles.images}>
                {post.image.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Post image ${index + 1}`}
                    style={styles.image}
                  />
                ))}
              </div>
            )}

            {post.currentLocation?.coordinates && (
              <p style={styles.location}>
                Longitude: {post.currentLocation.coordinates[0]}
                <br />
                Latitude: {post.currentLocation.coordinates[1]}
              </p>
            )}

            {error && <p style={styles.error}>{error}</p>}

            <button
              style={{
                ...styles.deleteButton,
                opacity: deleting ? 0.6 : 1,
              }}
              onClick={handleDeletePost}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Post"}
            </button>
          </div>
        ) : (
          <div>
            <p>You haven't created a post yet.</p>

            <button
              style={styles.button}
              onClick={() => navigate("/admin/post")}
            >
              + Create Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "30px",
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    maxWidth: "650px",
  },
  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  deleteButton: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "20px",
  },
  status: {
    color: "#15803d",
    fontWeight: "bold",
  },
  description: {
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
  images: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  location: {
    color: "#555",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  error: {
    color: "#dc2626",
  },
};

export default AdminDashboard;

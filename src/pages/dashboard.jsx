
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
    if (
      !window.confirm(
        "Are you sure you want to delete your post? This action cannot be undone."
      )
    ) return;

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

  const categoryLabels = {
    ads: "General Ads",
    other: "Other",
    rent_room: "Room for Rent",
    pg_room: "PG Room",
    property_sale: "Property for Sale",
    house_sale: "House for Sale",
    land_sale: "Land for Sale",
    job_vacancy: "Job Vacancy",
    restaurant_offer: "Restaurant Offer",
    shop_offer: "Shop Offer",
    new_business_nearby: "New Business Nearby",
    local_services: "Local Services",
    events: "Events & Activities",
  };

  const reachCount = Number(post?.reachCount || 0);

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        {/* Header */}
        <header style={styles.header}>
          <div>
            <span style={styles.eyebrow}>MANAGEMENT PANEL</span>
            <h1 style={styles.heading}>Admin Dashboard</h1>
            <p style={styles.subtitle}>
              Manage your posts and monitor their performance.
            </p>
          </div>

          <button
            style={styles.createButton}
            onClick={() => navigate("/admin/post")}
          >
            + Create Post
          </button>
        </header>

        {/* Main Card */}
        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>Posts Management</h2>
              <p style={styles.cardSubtitle}>
                Your published advertisement and its performance.
              </p>
            </div>
            <span style={styles.liveBadge}>● POST MANAGER</span>
          </div>

          {loading ? (
            <div style={styles.center}>
              <div style={styles.loader}></div>
              <p>Loading your post...</p>
            </div>
          ) : error && !post ? (
            <div style={styles.empty}>
              <p style={styles.error}>{error}</p>
              <button style={styles.createButton} onClick={fetchPost}>
                Retry
              </button>
            </div>
          ) : post ? (
            <div>

              {/* Reach Statistics */}
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statTop}>
                    <span style={styles.statIcon}>👁️</span>
                    <span style={styles.statLabel}>POST REACH</span>
                  </div>
                  <h2 style={styles.statNumber}>
                    {reachCount.toLocaleString("en-IN")}
                  </h2>
                  <p style={styles.statDescription}>
                    Total recorded post reach
                  </p>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statTop}>
                    <span style={styles.statIcon}>📷</span>
                    <span style={styles.statLabel}>PHOTOS</span>
                  </div>
                  <h2 style={styles.statNumber}>
                    {post.image?.length || 0}
                  </h2>
                  <p style={styles.statDescription}>
                    Images in your post
                  </p>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statTop}>
                    <span style={styles.statIcon}>📍</span>
                    <span style={styles.statLabel}>LOCATION</span>
                  </div>
                  <h2 style={styles.statNumber}>
                    {post.currentLocation?.coordinates ? "Added" : "Missing"}
                  </h2>
                  <p style={styles.statDescription}>
                    Post location status
                  </p>
                </div>
              </div>

              {/* Post Details */}
              <div style={styles.postSection}>
                <div style={styles.postHeader}>
                  <div>
                    <span style={styles.publishedBadge}>
                      ✓ Published
                    </span>
                    <h3 style={styles.postTitle}>Your Advertisement</h3>
                  </div>

                  <span style={styles.categoryBadge}>
                    {categoryLabels[post.category] || post.category || "Uncategorized"}
                  </span>
                </div>

                <p style={styles.description}>
                  {post.description}
                </p>

                {/* Images */}
                {Array.isArray(post.image) && post.image.length > 0 && (
                  <div style={styles.images}>
                    {post.image.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Post ${index + 1}`}
                        style={styles.image}
                      />
                    ))}
                  </div>
                )}

                {/* Location */}
                {post.currentLocation?.coordinates && (
                  <div style={styles.locationBox}>
                    <div>
                      <strong>📍 Post Location</strong>
                      <p style={styles.locationText}>
                        Latitude: {post.currentLocation.coordinates[1]}
                        <br />
                        Longitude: {post.currentLocation.coordinates[0]}
                      </p>
                    </div>

                    <a
                      href={`https://www.google.com/maps?q=${post.currentLocation.coordinates[1]},${post.currentLocation.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.mapLink}
                    >
                      View Map ↗
                    </a>
                  </div>
                )}

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.actions}>
                  <button
                    style={styles.refreshButton}
                    onClick={fetchPost}
                    disabled={deleting}
                  >
                    ↻ Refresh Stats
                  </button>

                  <button
                    style={{
                      ...styles.deleteButton,
                      opacity: deleting ? 0.6 : 1,
                    }}
                    onClick={handleDeletePost}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "🗑 Delete Post"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>📢</div>
              <h3>No Posts Yet</h3>
              <p>
                You haven't published an advertisement.
                Create your first post to reach nearby customers.
              </p>
              <button
                style={styles.createButton}
                onClick={() => navigate("/admin/post")}
              >
                + Create Your First Post
              </button>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          Local Discovery · Admin Management
        </footer>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    padding: "35px 20px",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#172033",
    boxSizing: "border-box",
  },
  wrapper: {
    maxWidth: "1050px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },
  eyebrow: {
    color: "#f97316",
    fontWeight: 800,
    fontSize: "11px",
    letterSpacing: "1.5px",
  },
  heading: {
    fontSize: "30px",
    margin: "8px 0",
    fontWeight: 800,
  },
  subtitle: {
    color: "#8992a4",
    fontSize: "14px",
    margin: 0,
  },
  createButton: {
    background: "#f97316",
    color: "#fff",
    border: "none",
    padding: "13px 20px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
  },
  card: {
    background: "#fff",
    border: "1px solid #e9edf4",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 8px 30px rgba(20,30,60,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    paddingBottom: "22px",
    borderBottom: "1px solid #edf0f5",
    marginBottom: "22px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 800,
  },
  cardSubtitle: {
    color: "#929bad",
    fontSize: "13px",
  },
  liveBadge: {
    background: "#fff7ed",
    color: "#ea580c",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: 800,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#fafbfe",
    border: "1px solid #edf0f5",
    padding: "20px",
    borderRadius: "14px",
  },
  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },
  statIcon: {
    fontSize: "21px",
  },
  statLabel: {
    color: "#8992a4",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.5px",
  },
  statNumber: {
    fontSize: "29px",
    margin: "15px 0 5px",
    fontWeight: 800,
    color: "#172033",
  },
  statDescription: {
    color: "#929bad",
    fontSize: "12px",
    margin: 0,
  },
  postSection: {
    border: "1px solid #edf0f5",
    borderRadius: "14px",
    padding: "20px",
  },
  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  publishedBadge: {
    display: "inline-block",
    background: "#ecfdf3",
    color: "#15803d",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
  },
  postTitle: {
    fontSize: "18px",
    margin: "12px 0",
  },
  categoryBadge: {
    background: "#fff0e5",
    color: "#ea580c",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 700,
  },
  description: {
    color: "#566176",
    lineHeight: 1.8,
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
  },
  images: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "20px",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "12px",
    background: "#f1f3f7",
  },
  locationBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    padding: "15px",
    marginTop: "20px",
    background: "#f8fafc",
    borderRadius: "10px",
    fontSize: "13px",
  },
  locationText: {
    color: "#788397",
    lineHeight: 1.7,
  },
  mapLink: {
    color: "#2563eb",
    fontWeight: 700,
    textDecoration: "none",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "25px",
    borderTop: "1px solid #edf0f5",
    paddingTop: "20px",
  },
  refreshButton: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #dbeafe",
    padding: "12px 17px",
    borderRadius: "9px",
    fontWeight: 700,
    cursor: "pointer",
  },
  deleteButton: {
    background: "#fff1f2",
    color: "#dc2626",
    border: "1px solid #ffe4e6",
    padding: "12px 17px",
    borderRadius: "9px",
    fontWeight: 700,
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "55px 15px",
  },
  emptyIcon: {
    fontSize: "45px",
  },
  center: {
    textAlign: "center",
    padding: "45px",
    color: "#8992a4",
  },
  loader: {
    width: "28px",
    height: "28px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #f97316",
    borderRadius: "50%",
    margin: "0 auto",
    animation: "spin 1s linear infinite",
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
  },
  footer: {
    textAlign: "center",
    color: "#a0a8b7",
    fontSize: "12px",
    marginTop: "25px",
  },
};

export default AdminDashboard;

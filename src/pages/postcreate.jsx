
import React, { useState } from "react";
import api from "../../api.js";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () =>
        reject(new Error("Image conversion failed"));
    });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      alert("You can only upload up to 3 images.");
      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (files.some((file) => !allowedTypes.includes(file.type))) {
      alert("Only JPG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    try {
      const base64List = await Promise.all(
        files.map(toBase64)
      );
      setImage(base64List);
    } catch {
      alert("Failed to read selected images.");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const longitude = Number(
          position.coords.longitude.toFixed(6)
        );
        const latitude = Number(
          position.coords.latitude.toFixed(6)
        );

        setLocation({
          type: "Point",
          coordinates: [longitude, latitude],
        });
      },
      (error) => {
        console.error(error);
        alert(
          "Unable to get location. Enable location permission and try again."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (image.length < 1 || image.length > 3) {
      alert("Please select 1 to 3 images.");
      return;
    }

    if (!location) {
      alert("Please get your current location first.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/api/create",
        {
          description,
          image,
          currentLocation: location,
        },
        { withCredentials: true }
      );

      alert(response.data.message || "Post created successfully!");

      setDescription("");
      setImage([]);
      setLocation(null);

      const fileInput = document.getElementById("post-images");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mapsUrl = location
    ? `https://www.google.com/maps?q=${location.coordinates[1]},${location.coordinates[0]}`
    : "";

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerIcon}>✦</div>
          <h2 style={styles.heading}>Create a Post</h2>
          <p style={styles.subtitle}>
            Share your update, add photos, and attach your location.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's happening? Write something..."
              rows={5}
              maxLength={2000}
              style={styles.textarea}
              required
            />
            <div style={styles.counter}>
              {description.length}/2000
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Photos</label>
            <p style={styles.helper}>
              Upload up to 3 images · JPG, PNG or WebP
            </p>

            <label htmlFor="post-images" style={styles.uploadBox}>
              <span style={styles.uploadIcon}>＋</span>
              <span style={styles.uploadTitle}>
                Choose images
              </span>
              <span style={styles.uploadHint}>
                Click here to browse your device
              </span>
            </label>

            <input
              id="post-images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFiles}
              style={styles.hiddenInput}
            />

            {image.length > 0 && (
              <div style={styles.previewSection}>
                <div style={styles.previewHeader}>
                  <span style={styles.label}>Selected images</span>
                  <span style={styles.imageCount}>
                    {image.length}/3
                  </span>
                </div>

                <div style={styles.preview}>
                  {image.map((src, index) => (
                    <div key={index} style={styles.imageCard}>
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        style={styles.image}
                      />
                      <span style={styles.imageBadge}>
                        Photo {index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setImage([]);
                    const input = document.getElementById("post-images");
                    if (input) input.value = "";
                  }}
                  style={styles.removeButton}
                >
                  Remove all photos
                </button>
              </div>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Post Location</label>
            <div
              style={{
                ...styles.locationBox,
                ...(location ? styles.locationSuccess : {}),
              }}
            >
              <div style={styles.locationTop}>
                <div style={styles.locationIcon}>⌖</div>
                <div style={styles.locationText}>
                  <strong style={styles.locationTitle}>
                    {location
                      ? "Location captured"
                      : "Add your current location"}
                  </strong>
                  <p style={styles.locationDescription}>
                    {location
                      ? "Your coordinates are ready to attach."
                      : "Allow location access to add coordinates to your post."}
                  </p>
                </div>
                {location && (
                  <span style={styles.checkBadge}>✓</span>
                )}
              </div>

              {location && (
                <div style={styles.coordinates}>
                  <div style={styles.coordinateRow}>
                    <span>Latitude</span>
                    <strong>{location.coordinates[1]}</strong>
                  </div>
                  <div style={styles.coordinateRow}>
                    <span>Longitude</span>
                    <strong>{location.coordinates[0]}</strong>
                  </div>

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.mapButton}
                  >
                    ↗ View on Google Maps
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={getCurrentLocation}
                style={{
                  ...styles.locationButton,
                  ...(location ? styles.secondaryButton : {}),
                }}
              >
                {location
                  ? "↻ Refresh Location"
                  : "⌖ Get Current Location"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading ? styles.disabledButton : {}),
            }}
          >
            {loading ? (
              "Creating your post..."
            ) : (
              <>Publish Post <span>→</span></>
            )}
          </button>

          <p style={styles.footerNote}>
            Please review your description and photos before publishing.
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "32px 16px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    color: "#172033",
  },

  container: {
    maxWidth: "620px",
    margin: "0 auto",
    padding: "30px",
    background: "#fff",
    border: "1px solid #e8eaf0",
    borderRadius: "20px",
    boxShadow: "0 12px 40px rgba(15, 23, 42, 0.06)",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  headerIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "17px",
    background: "#fff0e5",
    color: "#f97316",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    margin: "0 auto 16px",
  },

  heading: {
    fontSize: "27px",
    fontWeight: 800,
    margin: "0 0 9px",
    letterSpacing: "-0.7px",
  },

  subtitle: {
    color: "#7b8496",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: 0,
  },

  field: {
    marginBottom: "27px",
  },

  label: {
    display: "block",
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "9px",
    color: "#252e40",
  },

  helper: {
    fontSize: "12px",
    color: "#8991a2",
    margin: "-2px 0 12px",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #dfe3eb",
    background: "#fbfcfe",
    fontSize: "14px",
    lineHeight: 1.7,
    fontFamily: "inherit",
    resize: "vertical",
    outlineColor: "#f97316",
  },

  counter: {
    textAlign: "right",
    color: "#98a0ae",
    fontSize: "11px",
    marginTop: "6px",
  },

  uploadBox: {
    minHeight: "130px",
    border: "2px dashed #d9dee8",
    borderRadius: "14px",
    background: "#fafbfe",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    gap: "6px",
    boxSizing: "border-box",
    padding: "18px",
  },

  uploadIcon: {
    fontSize: "28px",
    color: "#f97316",
    lineHeight: 1,
  },

  uploadTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#354056",
  },

  uploadHint: {
    fontSize: "12px",
    color: "#8a93a4",
    textAlign: "center",
  },

  hiddenInput: {
    display: "none",
  },

  previewSection: {
    marginTop: "18px",
  },

  previewHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageCount: {
    background: "#fff0e5",
    color: "#ea580c",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
  },

  preview: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "10px",
  },

  imageCard: {
    position: "relative",
    width: "calc(33.333% - 8px)",
    minWidth: "95px",
    height: "115px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#f1f3f7",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  imageBadge: {
    position: "absolute",
    bottom: "6px",
    left: "6px",
    background: "rgba(0,0,0,0.65)",
    color: "#fff",
    fontSize: "10px",
    padding: "4px 7px",
    borderRadius: "5px",
  },

  removeButton: {
    marginTop: "12px",
    background: "#fff1f2",
    color: "#be123c",
    border: "1px solid #ffe0e5",
    padding: "9px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  locationBox: {
    padding: "17px",
    background: "#fafbfe",
    border: "1px solid #e0e5ed",
    borderRadius: "14px",
  },

  locationSuccess: {
    background: "#f5fbf7",
    borderColor: "#cdebd6",
  },

  locationTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  locationIcon: {
    width: "42px",
    height: "42px",
    flexShrink: 0,
    borderRadius: "12px",
    background: "#fff0e5",
    color: "#f97316",
    fontSize: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  locationText: {
    flex: 1,
  },

  locationTitle: {
    fontSize: "13px",
    color: "#263247",
  },

  locationDescription: {
    fontSize: "12px",
    lineHeight: 1.5,
    color: "#818b9b",
    margin: "5px 0 0",
  },

  checkBadge: {
    background: "#dcfce7",
    color: "#15803d",
    width: "25px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    fontWeight: 800,
  },

  coordinates: {
    marginTop: "17px",
    padding: "13px",
    background: "#fff",
    border: "1px solid #e8eee9",
    borderRadius: "10px",
  },

  coordinateRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "12px",
    color: "#778174",
    marginBottom: "10px",
  },

  mapButton: {
    display: "block",
    textAlign: "center",
    textDecoration: "none",
    background: "#eaf2ff",
    color: "#245bb5",
    padding: "11px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: 700,
    marginTop: "13px",
  },

  locationButton: {
    display: "block",
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    background: "#fff0e5",
    color: "#ea580c",
    border: "1px solid #ffdcc2",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryButton: {
    background: "#fff",
    color: "#374151",
    borderColor: "#dfe5dc",
  },

  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    padding: "16px",
    background: "#f97316",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 800,
    boxShadow: "0 6px 15px rgba(249, 115, 22, 0.22)",
  },

  disabledButton: {
    opacity: 0.65,
    cursor: "not-allowed",
    boxShadow: "none",
  },

  footerNote: {
    textAlign: "center",
    color: "#969dac",
    fontSize: "11px",
    lineHeight: 1.6,
    margin: "14px 0 0",
  },
};

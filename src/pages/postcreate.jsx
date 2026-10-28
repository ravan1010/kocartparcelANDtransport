
import React, { useState } from "react";
import api from "../../api.js";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert image to Base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Image conversion failed"));
    });
  };

  // Select up to 3 images
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 3) {
      alert("You can only upload up to 3 images.");
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (files.some((file) => !allowedTypes.includes(file.type))) {
      alert("Only JPG, PNG, and WebP images are allowed.");
      e.target.value = "";
      return;
    }

    try {
      const base64List = await Promise.all(
        files.map((file) => toBase64(file))
      );
      setImage(base64List);
    } catch (error) {
      alert("Failed to read selected images.");
    }
  };

  // Get current location
  
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

      alert("Location captured successfully.");
    },
    (error) => {
      alert("Unable to get location. Please enable location permission.");
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
};


  // Create post
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
        {
          withCredentials: true,
        }
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

  return (
    <div style={styles.container}>
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your post..."
          rows={5}
          style={styles.textarea}
          required
        />

        <label>Upload images (maximum 3)</label>
        <input
          id="post-images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFiles}
          style={styles.fileInput}
        />

        {image.length > 0 && (
          <div style={styles.preview}>
            {image.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                style={styles.image}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={getCurrentLocation}
          style={styles.locationButton}
        >
          {location ? "Location Captured ✓" : "Get Current Location"}
        </button>

        {location && (
          <p>
            Latitude: {location.coordinates[1]}
            <br />
            Longitude: {location.coordinates[0]}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    fontFamily: "Arial, sans-serif",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    margin: "8px 0 20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  fileInput: {
    display: "block",
    margin: "10px 0 20px",
  },
  preview: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  locationButton: {
    padding: "12px",
    marginBottom: "16px",
    cursor: "pointer",
  },
  submitButton: {
    display: "block",
    width: "100%",
    padding: "14px",
    background: "#f97316",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

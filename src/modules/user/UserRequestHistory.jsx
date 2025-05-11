import React, { useEffect, useState } from "react";
import "./UserRequestHistory.css";

function UserRequestHistory() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [reviewData, setReviewData] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/service-requests/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch service requests.");
        }

        const data = await response.json();

        // Filter only completed or cancelled requests
        const filtered = data.filter(
          (req) => req.status === "completed" || req.status === "cancelled"
        );

        setRequests(filtered);

        // Fetch reviews only for completed ones
        filtered.forEach(async (req) => {
          if (req.status === "completed") {
            const res = await fetch(`http://localhost:5000/api/service-requests/reviews/${req.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              const review = await res.json();
              setReviewData((prev) => ({ ...prev, [req.id]: review }));
            }
          }
        });
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Unable to load service requests.");
      }
    };

    fetchRequests();
  }, []);

  const handleInputChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSubmitReview = async (req) => {
  const { rating, review } = formData[req.id] || {};

  console.log("Attempting to submit review for request:", req.id);
  console.log("Service Provider ID:", req.service_provider_id);
  console.log("Rating:", rating);
  console.log("Review:", review);

  if (!rating || !review) {
    alert("Please provide both rating and review.");
    return;
  }

  const payload = {
    request_id: req.id,
    service_provider_id: req.service_provider_id,
    rating,
    review,
  };

  console.log("Submitting review payload:", payload);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/service-requests/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Review submission failed:", data);
      throw new Error(data.error || "Server returned an error");
    }

    alert("Review submitted!");

    setReviewData((prev) => ({
      ...prev,
      [req.id]: { rating, review },
    }));

    setFormData((prev) => ({
      ...prev,
      [req.id]: {},
    }));
  } catch (err) {
    console.error("Error submitting review:", err);
    alert(err.message || "Failed to submit review.");
  }
};


  return (
    <div className="user-request-history">
      <h2 className="heading">My Service Requests</h2>

      {error && <p className="error">{error}</p>}

      {requests.length === 0 ? (
        <p>No completed or cancelled service requests yet.</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Location</th>
              <th>Description</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => {
              const review = reviewData[req.id];
              return (
                <tr key={req.id}>
                  <td>{req.service_type}</td>
                  <td>{req.location}</td>
                  <td>{req.description}</td>
                  <td className={`status ${req.status.toLowerCase()}`}>{req.status}</td>
                  <td>{new Date(req.requested_at).toLocaleString()}</td>
                  <td>
                    {req.status === "completed" ? (
                      review ? (
                        <div>
                          <strong>Rating:</strong> {review.rating} ⭐<br />
                          <strong>Review:</strong> {review.review}<br />
                          {review.provider_reply && (
                            <>
                              <strong>Provider Reply:</strong> {review.provider_reply}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="review-form">
                          <select
                            value={formData[req.id]?.rating || ""}
                            onChange={(e) => handleInputChange(req.id, "rating", e.target.value)}
                          >
                            <option value="">Rate</option>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Write your review"
                            value={formData[req.id]?.review || ""}
                            onChange={(e) => handleInputChange(req.id, "review", e.target.value)}
                          />
                          <button onClick={() => handleSubmitReview(req)}>Submit</button>
                        </div>
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserRequestHistory;

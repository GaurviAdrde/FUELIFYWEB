import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // ✅ IMPORT useParams
import './ServiceFeedback.css';

const ServiceFeedback = () => {
  const { requestId } = useParams(); // ✅ GET ID from URL
  const [review, setReview] = useState(null);
  const [providerReply, setProviderReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!requestId) {
      console.error("Service Request ID is missing or invalid.");
      return;
    }

    console.log("serviceRequestId from URL:", requestId);

    axios.get(`/api/service_requests/reviews/${requestId}`)
      .then(response => {
        setReview(response.data);
      })
      .catch(error => {
        console.error("Error fetching review:", error);
      });
  }, [requestId]);

  const handleReplyChange = (e) => setProviderReply(e.target.value);

  const handleSubmitReply = () => {
    if (!providerReply) {
      alert("Please enter a reply before submitting.");
      return;
    }

    setIsSubmitting(true);
    axios.post('/api/service_requests/reviews/reply', {
      request_id: requestId,
      provider_reply: providerReply,
    })
      .then(() => {
        alert("Reply submitted successfully!");
        setReview(prev => ({
          ...prev,
          provider_reply: providerReply,
        }));
        setProviderReply('');
        setIsSubmitting(false);
      })
      .catch(error => {
        alert("Failed to submit reply.");
        setIsSubmitting(false);
        console.error("Error submitting reply:", error);
      });
  };

  return (
    <div>
      {review ? (
        <div>
          <h3>Review Details</h3>
          <p><strong>User:</strong> {review.user_name}</p>
          <p><strong>Service Type:</strong> {review.service_type}</p>
          <p><strong>Review:</strong> {review.review}</p>
          <p><strong>Rating:</strong> {review.rating}</p>
          <p><strong>Provider Reply:</strong> {review.provider_reply || "No reply yet."}</p>
          <div>
            <textarea
              value={providerReply}
              onChange={handleReplyChange}
              placeholder="Write your reply here..."
              disabled={isSubmitting}
            />
            <button onClick={handleSubmitReply} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Reply"}
            </button>
          </div>
        </div>
      ) : (
        <p>No review available for this service request.</p>
      )}
    </div>
  );
};

export default ServiceFeedback;

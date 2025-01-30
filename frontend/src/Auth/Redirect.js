import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RedirectPage = () => {
  const { shortLinkId } = useParams();

  useEffect(() => {
    const trackAnalytics = async () => {
      try {
        await axios.get(`/s/${shortLinkId}`);
      } catch (error) {
        console.error("Error tracking analytics:", error);
      }
    };

    trackAnalytics();
  }, [shortLinkId]);

  return <div>Redirecting...</div>;
};

export default RedirectPage;

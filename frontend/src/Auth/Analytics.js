import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Analytics.css"

const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // Set items per page to 5

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${MAIN_URL}/analytics?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          setAnalyticsData(response.data.data);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setAnalyticsData([]);
        }
      } catch (err) {
        setError("Failed to fetch analytics data");
        setAnalyticsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [page]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="analytics-section">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <div className="overflow-x-auto">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Original Link</th>
              <th>Short Link</th>
              <th>IP Address</th>
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.length > 0 ? (
              analyticsData.map((data) => (
                <tr key={data._id}>
                  <td>{new Date(data.timestamp).toLocaleString()}</td>
                  <td>
                    <a href={data.originalLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                      {data.originalLink}
                    </a>
                  </td>
                  <td>
                    <a href={`${MAIN_URL}/api/${data.shortLink}`} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                      {data.shortLink}
                    
                    </a>
                  </td>
                  <td>{data.ipAddress}</td>
                  <td>{data.device}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No analytics data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`page-btn ${page === 1 ? "disabled" : ""}`}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`page-btn ${page === index + 1 ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`page-btn ${page === totalPages ? "disabled" : ""}`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Analytics;

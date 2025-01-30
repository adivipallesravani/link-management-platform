import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import "../styles/Analytics.css";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState({ timestamp: "desc" });

  const linksPerPage = 5;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/analytics/");
        if (!response.ok) throw new Error("Failed to fetch analytics data");
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const sortByField = (field) => {
    const newOrder = sortOrder[field] === "asc" ? "desc" : "asc";
    const sortedData = [...analyticsData].sort((a, b) => {
      return newOrder === "asc"
        ? new Date(a[field]) - new Date(b[field])
        : new Date(b[field]) - new Date(a[field]);
    });

    setSortOrder({ [field]: newOrder });
    setAnalyticsData(sortedData);
  };

  const totalPages = Math.ceil(analyticsData.length / linksPerPage);
  const currentAnalytics = analyticsData.slice(
    (currentPage - 1) * linksPerPage,
    currentPage * linksPerPage
  );

  return (
    <div className="analytics-section">
      <h2>Analytics</h2>
      <table className="analytics-table">
        <thead>
          <tr>
            <th onClick={() => sortByField("timestamp")} style={{ cursor: "pointer" }}>
              Timestamp{" "}
              <FontAwesomeIcon icon={faSortUp} className={sortOrder.timestamp === "asc" ? "active" : ""} />
              <FontAwesomeIcon icon={faSortDown} className={sortOrder.timestamp === "desc" ? "active" : ""} />
            </th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>IP Address</th>
            <th>User Device</th>
          </tr>
        </thead>
        <tbody>
          {currentAnalytics.map((analytics) => (
            <tr key={analytics._id}>
              <td>{formatTimestamp(analytics.timestamp)}</td>
              <td>{analytics.originalLink}</td>
              <td>
                <a href={`http://localhost:5000/api/links/${analytics.shortLinkId}`} target="_blank" rel="noopener noreferrer">
                  {analytics.shortLinkId}
                </a>
              </td>
              <td>{analytics.ipAddress}</td>
              <td>{analytics.userDevice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Analytics;

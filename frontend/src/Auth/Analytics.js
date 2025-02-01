import React, { useEffect, useState } from "react";
import axios from "axios";
const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;
    console.log(MAIN_URL);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Set items per page


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
  
    fetchAnalytics(); // ✅ Call the function inside useEffect
  }, [page]); // ✅ Add page as a dependency so it re-fetches data when the page changes
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Analytics</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Timestamp</th>
              <th className="border px-4 py-2">Original Link</th>
              <th className="border px-4 py-2">Short Link</th>
              <th className="border px-4 py-2">IP Address</th>
              <th className="border px-4 py-2">Device</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.length > 0 ? (
              analyticsData.map((data) => (
                <tr key={data._id} className="text-center">
                  <td className="border px-4 py-2">{new Date(data.timestamp).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    <a href={data.originalLink} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                      {data.originalLink}
                    </a>
                  </td>
                  <td className="border px-4 py-2">
                    <a href={`${MAIN_URL}/api/${data.shortLink}`} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                      {data.shortLink}
                    </a>
                  </td>
                  <td className="border px-4 py-2">{data.ipAddress}</td>
                  <td className="border px-4 py-2">{data.device}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border px-4 py-2 text-center">
                  No analytics data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"}`}
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md ${page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-700"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Analytics;

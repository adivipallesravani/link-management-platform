import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;

const BarGraph = ({ data, title }) => {
  const chartData = {
    labels: data.map((item) => item.label), // Left-side labels (Dates or Devices)
    datasets: [
      {
        data: data.map((item) => item.value), // Click counts
        backgroundColor: "#1E40AF", // Blue bars
        barThickness: 12, // Adjust thickness
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y", // Horizontal bars
    plugins: { legend: { display: false }, tooltip: { enabled: false } }, // Hide legend & tooltip
    scales: {
      x: { display: false }, // Hide X-axis numbers
      y: {
        grid: { display: false }, // Hide grid
        ticks: { align: "start", font: { weight: "bold" }, padding: 10 }, // Align labels left
      },
    },
  };

  return (
    <div style={{ background: "#fff", padding: "10px", borderRadius: "10px", width: "100%" }}>
      <h4 style={{ marginBottom: "10px" }}>{title}</h4>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Bar data={chartData} options={options} />
        <div style={{ display: "flex", flexDirection: "column", fontWeight: "bold", gap: "12px" }}>
          {data.map((item, index) => (
            <div key={index}>{item.value}</div> // Click counts on the right
          ))}
        </div>
      </div>
    </div>
  );
};

const Chart = () => {
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceClicks, setDeviceClicks] = useState([]);
  const [totalClicks, setTotalClicks] = useState(0); // Added totalClicks state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch(`${MAIN_URL}/analytics/analytics-summary`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Log the fetched data
        console.log("API response:", data);

        // Process and sort date-wise clicks
        const dateClicks = data.dateWiseClicks
          .map((item) => ({
            label: item._id,
            value: item.count,
          }))
          .sort((a, b) => new Date(b.label) - new Date(a.label)); // Sort in descending order

        const deviceData = data.deviceClicks.map((item) => ({
          label: item._id,
          value: item.count,
        }));

        setTotalClicks(data.totalClicks); // Set total clicks from the API

        // Only update state if data has changed
        if (JSON.stringify(dateClicks) !== JSON.stringify(dateWiseClicks)) {
          setDateWiseClicks(dateClicks);
        }

        if (JSON.stringify(deviceData) !== JSON.stringify(deviceClicks)) {
          setDeviceClicks(deviceData);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);  // Removed dependencies to prevent infinite re-renders

  return (
    <div style={{ display: "flex", gap: "9px", padding: "10px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        <div style={{display:"flex"}}>
          <div >
            {/* Display Total Clicks */}
            <h3>Total  </h3>
            </div> 
       <div style={{marginTop:"25px",marginLeft:"5px"}}>Clicks:{totalClicks}</div>
       </div>
          <div style={{display:"flex",alignItems:"center",marginTop:"80px"}}>
          <BarGraph data={dateWiseClicks} title="Date-wise Clicks" />
            <BarGraph data={deviceClicks} title="Click Devices" />
          </div>
        </>
      )}
    </div>
  );
};

export default Chart;

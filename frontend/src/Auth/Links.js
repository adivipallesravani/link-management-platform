import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/Links.css";

const Links = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 5;

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/links/");
      if (!response.ok) throw new Error("Failed to fetch links");
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  const totalPages = Math.ceil(links.length / linksPerPage);
  const currentLinks = links.slice(
    (currentPage - 1) * linksPerPage,
    currentPage * linksPerPage
  );

  return (
    <div className="links-section">
      <h2>Shortened Links</h2>
      <table className="links-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLinks.map((link) => (
            <tr key={link._id}>
              <td>{new Date(link.timestamp).toLocaleString()}</td>
              <td>{link.originalLink}</td>
              <td>
                <a href={`http://localhost:5000/api/links/${link.shortLinkId}`} target="_blank" rel="noopener noreferrer">
                  {link.shortLinkId}
                </a>
              </td>
              <td>{link.clicks}</td>
              <td>{link.status}</td>
              <td>
                <FontAwesomeIcon icon={faEdit} />
                <FontAwesomeIcon icon={faTrashAlt} />
              </td>
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

export default Links;

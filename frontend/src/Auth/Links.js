import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faCopy } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Links.css";
const MAIN_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCAL_URL
    : process.env.REACT_APP_PRODUCTION_URL;
    console.log(MAIN_URL);

const Links = () => {
  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [destination, setDestination] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expiration, setExpiration] = useState("");
  const [isExpirationEnabled, setIsExpirationEnabled] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(`${MAIN_URL}/api/links`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLinks(data);
        } else {
          console.error("Failed to fetch links:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    fetchLinks();
  }, []);

  const handleEditClick = (link) => {
    setSelectedLink(link);
    setDestination(link.originalLink);
    setRemarks(link.remarks);
    setExpiration(link.expiration);
    setIsExpirationEnabled(!!link.expiration);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const updatedLink = {
        originalLink: destination,
        remarks,
        expiration: isExpirationEnabled ? expiration : null,
      };

      const response = await fetch(`${MAIN_URL}/api/links/${selectedLink._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedLink),
      });

      if (response.ok) {
        const data = await response.json();
        setLinks((prevLinks) =>
          prevLinks.map((link) =>
            link._id === selectedLink._id ? { ...link, ...updatedLink } : link
          )
        );
        toast.success("Link updated successfully");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to update link");
      }
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error("Error saving link");
    }
  };

  const handleClear = () => {
    setDestination("");
    setRemarks("");
    setExpiration("");
    setIsExpirationEnabled(false);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (link) => {
    setSelectedLink(link);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/api/links/${selectedLink._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setLinks((prevLinks) => prevLinks.filter((link) => link._id !== selectedLink._id));
        toast.success("Link deleted successfully");
        setIsDeleteModalOpen(false);
      } else {
        toast.error("Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Error deleting link");
    }
  };

  const handleShortLinkClick = async (shortLinkId, originalLink, event) => {
    event.preventDefault(); // Prevent the default behavior (opening the link in a new tab)
  
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`${MAIN_URL}/${shortLinkId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to track analytics: ${errorMessage}`);
      }
  
      // Redirect to the original link after tracking the analytics
      window.location.href = originalLink; // This will redirect the user to the original link
    } catch (error) {
      console.error("Error tracking analytics:", error);
      toast.error("Failed to track analytics or redirect");
    }
  };
  
  

  const handleCopyLink = (shortLinkId) => {
    navigator.clipboard.writeText(shortLinkId);
    toast.success("Link copied to clipboard!", { position: "top-right", autoClose: 2000 });
  };

  const totalPages = Math.ceil(links.length / linksPerPage);
  const currentLinks = links.slice((currentPage - 1) * linksPerPage, currentPage * linksPerPage);

  return (
    <div className="links-section">
      <h2>Shortened Links</h2>

      <table className="links-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Remarks</th>
            <th>Clicks</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLinks.map((link) => (
            <tr key={link._id}>
              <td>{link.expiration ? new Date(link.expiration).toLocaleString() : "No Expiry"}</td>
              <td>{link.originalLink}</td>
              <td>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => handleShortLinkClick(link.shortLinkId, link.originalLink, event)}
                >
                  {`${MAIN_URL}/api/${link.shortLinkId}`}
                </a>
                <FontAwesomeIcon
                  icon={faCopy}
                  className="copy-icon"
                  onClick={() => handleCopyLink(`${MAIN_URL}/api/${link.shortLinkId}`)}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                />
              </td>
              <td>{link.remarks}</td>
              <td>{link.clicks}</td>
              <td>{link.status}</td>
              <td>
                <FontAwesomeIcon icon={faEdit} className="action-icon" onClick={() => handleEditClick(link)} />
                <FontAwesomeIcon icon={faTrashAlt} className="action-icon" onClick={() => handleDeleteClick(link)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Link Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Link</h2>
            <form>
              <label>
                Destination URL:
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </label>
              <label>
                Remarks:
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                />
              </label>
              <label>
                Link Expiration:
                <input
                  type="checkbox"
                  checked={isExpirationEnabled}
                  onChange={() => setIsExpirationEnabled(!isExpirationEnabled)}
                />
              </label>
              {isExpirationEnabled && (
                <input
                  type="datetime-local"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  required
                />
              )}
              <div className="modal-actions">
                <button type="button" onClick={handleClear}>
                  Clear
                </button>
                <button type="button" onClick={handleSave}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure, you want to remove it?</h2>
            <div className="modal-actions">
              <button type="button" onClick={() => setIsDeleteModalOpen(false)}>
                NO
              </button>
              <button type="button" onClick={handleDeleteConfirm}>
                YES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
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

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RedirectPage = ({ links }) => {
    const { shortId } = useParams(); // Get shortId from URL params
    const navigate = useNavigate();

    useEffect(() => {
        // Find the corresponding link by shortId
        const link = links.find((link) => link.shortLink.includes(shortId));
        
        if (link) {
            // Redirect to the destination URL
            window.location.href = link.destination;
        } else {
            // Handle case where the link is not found
            navigate("/dashboard");
        }
    }, [shortId, links, navigate]);

    return null; // The component does not need to render anything
};

export default RedirectPage;

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnPageChange: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the pathname changes
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTopOnPageChange;

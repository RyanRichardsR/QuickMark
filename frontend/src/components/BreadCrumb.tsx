// Breadcrumb.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Breadcrumb.css";

const Breadcrumb: React.FC<{ label: string; to: string }> = ({ label, to }) => {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb" onClick={() => navigate(to)}>
      &lt; {label}
    </div>
  );
};

export default Breadcrumb;

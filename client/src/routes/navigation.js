// Navigation utilities for React Router DOM
import { useNavigate } from "react-router-dom";

// Custom hook for programmatic navigation
export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    // Navigate to home (shows dashboard if authenticated, landing page if not)
    goToHome: () => navigate("/"),

    // Navigate to add new entry
    goToAddEntry: () => navigate("/entry"),

    // Navigate to edit specific entry
    goToEditEntry: (id) => navigate(`/entry/${id}`),

    // Navigate to preview specific entry
    goToPreviewEntry: (id) => navigate(`/preview/${id}`),

    // Navigate to trend analysis
    goToTrend: () => navigate("/trend"),

    // Go back to previous page
    goBack: () => navigate(-1),

    // Generic navigation
    navigateTo: (path) => navigate(path),
  };
};

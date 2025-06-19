// Navigation utilities for React Router DOM
import { useNavigate } from "react-router-dom";

// Custom hook for programmatic navigation
export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    // Navigate to home (shows dashboard if authenticated, landing page if not)
    goToHome: () => navigate("/"),

    // Navigate to add entry (future route)
    goToAddEntry: () => navigate("/add-entry"),

    // Navigate to trends (future route)
    goToTrends: () => navigate("/trends"),

    // Navigate to profile (future route)
    goToProfile: () => navigate("/profile"),

    // Navigate to settings (future route)
    goToSettings: () => navigate("/settings"),

    // Go back to previous page
    goBack: () => navigate(-1),

    // Generic navigation
    navigateTo: (path) => navigate(path),
  };
};

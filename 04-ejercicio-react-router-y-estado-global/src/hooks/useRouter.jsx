import { useNavigate, useLocation } from "react-router";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    navigateTo: navigate,
    currentPath: location.pathname,
  };
}

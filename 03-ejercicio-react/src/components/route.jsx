import { useRouter } from "../hooks/use-router";
import { NotFoundPage } from "../pages/404";

// eslint-disable-next-line
export function Route({ path, component: Component }) {
  const { currentPath } = useRouter();

  const availablePaths = ["/", "/search"];

  if (!path && !availablePaths.includes(currentPath)) return <NotFoundPage />;

  if (currentPath !== path) return null;

  return <Component />;
}

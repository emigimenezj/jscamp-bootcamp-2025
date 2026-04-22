import { useRouter } from "../hooks/use-router";

export function Link({ href, children, ...restOfProps }) {
  const { navigateTo } = useRouter();

  const handleClick = (e) => (e.preventDefault(), navigateTo(href));

  return (
    <a href={href} onClick={handleClick} {...restOfProps}>
      {children}
    </a>
  );
}

import { Link as LinkRR } from "react-router";

export function Link({ href, children, ...restOfProps }) {
  return (
    <LinkRR to={href} {...restOfProps}>
      {children}
    </LinkRR>
  );
}

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { navigate } from "../lib/router";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Enlace interno: navega sin recargar y con la transición de página. Cmd/Ctrl-clic abre pestaña como siempre. */
export function Link({ to, onClick, children, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}

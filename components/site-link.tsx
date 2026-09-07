import type { AnchorHTMLAttributes } from 'react';

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

/**
 * Cross-page navigation deliberately uses native links. This keeps navigation
 * working even when the optional client-side router is unavailable.
 */
export default function SiteLink({ href, ...props }: SiteLinkProps) {
  return <a href={href} {...props} />;
}

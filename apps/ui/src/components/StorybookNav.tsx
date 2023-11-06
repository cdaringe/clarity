"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const StorybookNav: React.FC<{ pathnames: string[] }> = ({
  pathnames,
}) => {
  const pathname = usePathname();
  return (
    <nav>
      {pathnames.map((it, i) => (
        <li key={i}>
          <Link
            style={{
              fontWeight: pathname === it ? "bolder" : "initial",
            }}
            href={it}
          >
            {it}
          </Link>
        </li>
      ))}
    </nav>
  );
};

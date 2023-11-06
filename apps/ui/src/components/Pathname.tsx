"use client";
import { usePathname } from "next/navigation";

export const Pathname: React.FC = () => {
  const pathname = usePathname();
  return pathname;
};

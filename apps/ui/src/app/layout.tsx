// https://github.com/unocss/unocss/issues/2584
// import "@unocss/reset/tailwind.css";
// import "uno.css";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "clarity",
  description: "whatever, man",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css"
        />
      </head>
      <body>
        <Link href="/storybook">storybook</Link>
        <main>{children}</main>
      </body>
    </html>
  );
}

import "@unocss/reset/tailwind.css";
import "uno.css";

export const metadata = {
  title: "clarity",
  description: "whatever, man",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

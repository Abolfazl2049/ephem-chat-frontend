import type { Metadata } from "next";
import "@styles/tailwind.css";
export const metadata: Metadata = {
  title: "Ephem Chat | Anonymous Realtime Chat",
  description: "Anonymous Realtime Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}

import "../global.css";

export const metadata = {
  title: "Messhi",
  description: "飯",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";
import { Toaster } from "react-hot-toast"


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <Toaster position="top-right" />
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}

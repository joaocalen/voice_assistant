import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";


export const metdata = {
  title: "Llama Chat",
  openGraph: {
    title: "Llama Chat",
    description: "Chat with Llama 2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Chat with Llama 2</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦙</text></svg>"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"></link>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

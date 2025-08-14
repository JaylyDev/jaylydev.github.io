import "@/styles/globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <body>{children}</body>
    </section>
  );
}

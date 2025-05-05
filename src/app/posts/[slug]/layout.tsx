import "@/styles/globals.css";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <body>{children}</body>
    </section>
  );
}

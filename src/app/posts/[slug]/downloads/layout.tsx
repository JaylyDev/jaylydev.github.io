import { inter } from "@/components/Font";

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <body className={inter.className}>{children}</body>
    </section>
  );
}

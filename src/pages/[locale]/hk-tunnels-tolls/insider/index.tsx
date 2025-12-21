import { useRouter } from "next/router";
import { useEffect } from "react";

// Note: Only zh-HK is supported for this page
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/hk-tunnels-tolls/insider/");
  }, [router]);

  return null;
}

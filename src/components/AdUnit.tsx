import { useEffect, useRef } from "react";

export function InArticleAdUnit(): JSX.Element {
  const insRef = useRef<HTMLModElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    // Request the ad only once, and never destroy/reload it (AdSense forbids
    // unsolicited refresh). Loading as the slot nears the viewport lifts
    // viewability without deferring the core adsbygoogle.js script.
    const load = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error(e);
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      load();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            load();
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle w-full min-h-48"
      style={{ display: "block", textAlign: "center", margin: "20px 0" }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-2533146760921020"
      data-ad-slot="9602449199"
    ></ins>
  );
}

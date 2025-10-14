import { useEffect } from "react";

export function InArticleAdUnit(): JSX.Element {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <ins
      className="adsbygoogle min-w-96 min-h-48"
      style={{ display: "block", textAlign: "center", margin: "20px 0" }}
      data-ad-layout="in-article"
      data-ad-format="fluid"
      data-ad-client="ca-pub-2533146760921020"
      data-ad-slot="9602449199"
    ></ins>
  );
}

import Script from "next/script";
import content from "./content.json";

export default function Page() {
  return (
    <>
      {/* Trusted static HTML from the local generator; never accept user HTML here. */}
      <div id="fivecred-preview" dangerouslySetInnerHTML={{ __html: content.body }} />
      {content.scripts.map(src => <Script key={src} src={src} strategy="afterInteractive" />)}
    </>
  );
}

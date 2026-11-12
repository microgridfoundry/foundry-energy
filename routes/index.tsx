export const title =
  "The Foundry - Helping Communities Build Smart Local Energy Systems";
export const description =
  "Clean, affordable energy systems owned and controlled by communities. Operating smart local energy systems across the South-West of the UK.";

import Nav from "../components/Nav.tsx";
import Footer from "../components/Footer.tsx";
import Hero from "../components/Hero.tsx";
import WhatWeDo from "../components/WhatWeDo.tsx";
import Communities from "../components/Communities.tsx";
import Contact from "../components/Contact.tsx";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />
      <Hero />
      <Communities />
      <WhatWeDo />
      <Contact />
      <Footer />
    </div>
  );
}

import React from "react";
import ThreeHero from "./ThreeHero";
import "./styles.css";

export default function App() {
  return (
    <>
      <ThreeHero />
      {/* rest of portfolio sections */}
      <main className="content">
        <section>
          <h2>About</h2>
          <p>Write your content here...</p>
        </section>
      </main>
    </>
  );
}

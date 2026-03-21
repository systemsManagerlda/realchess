// app/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedEvents from "@/components/FeaturedEvents";
import Introduction from "@/components/Introduction";
import CallToAction from "@/components/CallToAction";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Introduction />
        <FeaturedEvents />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
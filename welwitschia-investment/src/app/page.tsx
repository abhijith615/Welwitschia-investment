import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import CursorGlow from "@/components/CursorGlow";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Values from "@/components/Values";
import Services from "@/components/Services";
import Products from "@/components/Products";
import WhyUs from "@/components/WhyUs";
import Story from "@/components/Story";
import Trust from "@/components/Trust";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <About />
        <Values />
        <Services />
        <Products />
        <WhyUs />
        <Story />
        <Trust />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

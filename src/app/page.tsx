import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductPreview from "@/components/ProductPreview";
import FeatureCards from "@/components/FeatureCards";
import SocialSection from "@/components/SocialSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <ProductPreview />
        <FeatureCards />
        <SocialSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}

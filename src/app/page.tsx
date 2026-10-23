import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductPreview from "@/components/ProductPreview";
import FeatureCards from "@/components/FeatureCards";
import SocialSection from "@/components/SocialSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import { listStoreProducts } from "@/lib/data";

export default function HomePage() {
  const products = listStoreProducts();
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <ProductPreview products={products} />
        <FeatureCards />
        <SocialSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}

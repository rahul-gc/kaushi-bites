import HeroSection from '@/components/HeroSection';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedSection from '@/components/FeaturedSection';
import OfferBanner from '@/components/OfferBanner';
import Footer from '@/components/Footer';

const Index = () => (
  <div className="min-h-screen">
    <HeroSection />
    <CategoryGrid />
    <FeaturedSection />
    <OfferBanner />
    <Footer />
  </div>
);

export default Index;

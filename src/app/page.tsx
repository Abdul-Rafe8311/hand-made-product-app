import { getActiveProducts } from "@/lib/products";
import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Categories } from "@/components/Categories";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();
  const featured = products.slice(0, 3);

  return (
    <>
      <Hero />
      <FeaturedProducts products={featured} />
      <Categories />
      <Features />
      <Testimonials />
      <Newsletter />
    </>
  );
}

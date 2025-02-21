import Hero from "@/components/hero";
import Shelf from "@/components/shelf";
import Footer from "@/components/footer";
export default async function Home() {
  return (
    <div className="">
      <main className="w-full flex flex-col items-center justify-center">
        {/* <AuthButton /> */}
        <Hero />
        <Shelf />
        <Footer />
      </main>
    </div>
  );
}

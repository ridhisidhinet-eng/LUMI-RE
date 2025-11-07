import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/50 z-10" />
      <img
        src="https://images.unsplash.com/photo-1758995115475-7b7d6eb060ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwZ29sZHxlbnwxfHx8fDE3NjI0NDcyODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Luxury Jewelry"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-20 text-center text-white px-4 max-w-3xl">
        <h1 className="text-5xl md:text-6xl mb-6 tracking-tight">
          Timeless Elegance
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          Discover our exquisite collection of handcrafted jewelry
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Shop Collection
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}

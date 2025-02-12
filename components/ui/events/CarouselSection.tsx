'use client'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/shadcn/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react';

const carouselItems = [
  {
    title: "TOP BUSINESS CONFERENCE",
    subtitle: "To Attend in 2025 in India",
    imageUrl: "https://res.cloudinary.com/dwbhm8hp8/image/upload/v1739210569/itsvkukenvgpubz8yxqh.jpg"
  },
  {
    title: "TECH INNOVATION SUMMIT",
    subtitle: "Leading Tech Conference in Asia",
    imageUrl: "https://res.cloudinary.com/dwbhm8hp8/image/upload/v1739210617/mhudt1dqcttejjeybsix.png"
  },
];

export const CarouselSection = () => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  return (
    <section className="h-[60vh] md:h-[80vh] relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
                        {carouselItems.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="relative w-full h-[60vh] md:h-[80vh] md:px-16 md:py-8 bg-dark-secondary">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover rounded-xl opacity-35"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                                        <div className="text-center px-4 max-w-2xl">
                                            <h1 className="text-2xl md:text-4xl font-bold text-theme-primary mb-4">
                                                {item.title}
                                            </h1>
                                            <p className="text-gray-300 text-sm md:text-lg">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 size-10 bg-dark-primary/50 hover:bg-dark-primary/80 text-white hover:text-theme-primary border-none" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 size-10 bg-dark-primary/50 hover:bg-dark-primary/80 text-white hover:text-theme-primary border-none" />
      </Carousel>
    </section>
  )
}
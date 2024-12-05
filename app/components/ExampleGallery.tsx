import Image from 'next/image'
import { Card } from '@/components/ui/card'

const examples = [
  {
    id: 1,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/downloadedImage-46-RX1LEsAjrQ8iHCJUkj9tQyJDI9SXSG.png",
    alt: "Snowman in pink forest"
  },
  {
    id: 2,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/downloadedImage-47-hPD1UhyRcrc6oQCvuw7VDknonkCjnH.png",
    alt: "Snowman with top hat"
  },
  {
    id: 3,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/downloadedImage-48-Cm6ptTGB7HIon32hfYq3CB4Lqm8RBl.png",
    alt: "Underwater snowman"
  },
  {
    id: 4,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/downloadedImage-50-TPbsDiaxQhwmAzTPGPphNhdHPoikF3.png",
    alt: "Winter snowman"
  },
  {
    id: 5,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/downloadedImage-51-W7cshKEgp2xYYuHelUuapvSgyBIBUf.png",
    alt: "Treehouse in winter"
  }
]

interface ExampleGalleryProps {
  onSelect: (src: string) => void
}

export default function ExampleGallery({ onSelect }: ExampleGalleryProps) {
  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-semibold">Example Puzzles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examples.map((example) => (
          <Card 
            key={example.id}
            className="overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => onSelect(example.src)}
          >
            <div className="relative aspect-[4/3] ">
              <Image
                src={example.src}
                alt={example.alt}
                fill
                className="object-cover"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


import Image from 'next/image'
import { Card } from '@/components/ui/card'

const examples = [
  {
    id: 1,
    src: "https://cdn.midjourney.com/0ee706f7-2bd0-4a13-b42d-2c9184402b2e/0_0.png",
    alt: "Snowman in pink forest"
  },
  {
    id: 2,
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/downloadedImage-47-hPD1UhyRcrc6oQCvuw7VDknonkCjnH.png",
    alt: "Snowman with top hat"
  },
  {
    id: 3,
    src: "https://cdn.midjourney.com/ef2ae1df-0713-4c48-abe7-6dc257bc3fdd/0_0.png",
    alt: "Underwater snowman"
  },
  {
    id: 4,
    src: "https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Ftest1-emgndhaqd0c9h2db.a01.azurefd.net%2Fimages%2F31a19b94-3717-4212-b844-7235488a1ecc.png",
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


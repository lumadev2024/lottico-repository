import Image from "next/image"

const PHOTOS = [
  { src: "/images/store/storefront-sign-day.jpg", alt: "Insegna L'Ottico su via, di giorno" },
  { src: "/images/store/interior-shelves.jpg", alt: "Espositori di montature in negozio" },
  { src: "/images/store/logo-plaque.jpg", alt: "Logo L'Ottico in vetroresina sul bancone" },
  { src: "/images/store/interior-counter.jpg", alt: "Bancone e vetrina interna" },
  { src: "/images/store/interior-wide.jpg", alt: "Vista d'insieme del negozio" },
  { src: "/images/store/storefront-sign.jpg", alt: "Ingresso del negozio L'Ottico" },
]

export default function StoreGallery() {
  return (
    <div className="grid grid-cols-3 gap-3 small:gap-4">
      {PHOTOS.map((photo, index) => (
        <div
          key={photo.src}
          className={`relative aspect-square overflow-hidden rounded-card ${
            index === 0 ? "col-span-2 row-span-1 small:aspect-[16/10]" : ""
          }`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 1024px) 45vw, 30vw"
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}

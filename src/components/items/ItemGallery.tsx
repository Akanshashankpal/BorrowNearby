import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { Modal } from "@/components/ui/Modal";

export function ItemGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const safe = images.length ? images : [""];
  const current = safe[index] ?? safe[0];

  function step(direction: number) {
    setIndex((value) => (value + direction + safe.length) % safe.length);
    setZoom(false);
  }

  return (
    <div>
      <div className="grid gap-3 lg:grid-cols-[88px_minmax(0,1fr)]">
        <div className="order-2 flex gap-2 overflow-x-auto no-scrollbar lg:order-1 lg:flex-col lg:overflow-visible">
          {safe.map((image, imageIndex) => (
            <button
              key={`${image}-${imageIndex}`}
              type="button"
              aria-label={`Show image ${imageIndex + 1} of ${safe.length}`}
              onClick={() => setIndex(imageIndex)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl border ${imageIndex === index ? "border-brand" : "border-line"}`}
            >
              <Photo src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="order-1 overflow-hidden rounded-[1.75rem] bg-brand-soft lg:order-2">
          <div className="relative aspect-[4/3]">
            <div className="flex h-full snap-x snap-mandatory overflow-x-auto no-scrollbar lg:hidden">
              {safe.map((image, imageIndex) => (
                <button key={`${image}-slide-${imageIndex}`} type="button" className="h-full min-w-full snap-center" onClick={() => { setIndex(imageIndex); setOpen(true); }}>
                  <Photo src={image} alt={`${name} photo ${imageIndex + 1}`} className="h-full w-full object-cover" priority={imageIndex === 0} />
                </button>
              ))}
            </div>
            <button type="button" className="hidden h-full w-full lg:block" onClick={() => setOpen(true)}>
              <Photo src={current} alt={`${name} photo ${index + 1}`} className="h-full w-full object-cover" priority />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white">
              {index + 1} / {safe.length}
            </p>
          </div>
        </div>
      </div>
      <Modal open={open} title={name} onClose={() => setOpen(false)} wide>
        <div className="relative">
          <Photo src={current} alt={`${name} enlarged`} className={`max-h-[70vh] w-full rounded-2xl object-contain ${zoom ? "scale-125" : ""}`} />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted">
              {index + 1} of {safe.length}
            </p>
            <div className="flex gap-2">
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft" onClick={() => step(-1)} aria-label="Previous image">
                <ChevronLeft size={18} />
              </button>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft" onClick={() => setZoom((value) => !value)} aria-label="Toggle zoom">
                <ZoomIn size={18} />
              </button>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft" onClick={() => step(1)} aria-label="Next image">
                <ChevronRight size={18} />
              </button>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft" onClick={() => setOpen(false)} aria-label="Close gallery">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

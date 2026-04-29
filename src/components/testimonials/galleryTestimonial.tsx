import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

interface GalleryTestimonialProps {
  beforeImages?: string[];
  afterImages?: string[];
}

export default function GalleryTestimonial({
  beforeImages = [],
  afterImages = [],
}: GalleryTestimonialProps) {
  const safeBeforeImages = useMemo(() => beforeImages.slice(0, 10), [beforeImages]);
  const safeAfterImages = useMemo(() => afterImages.slice(0, 10), [afterImages]);

  const [beforeIndex, setBeforeIndex] = useState(0);
  const [afterIndex, setAfterIndex] = useState(0);

  const hasBefore = safeBeforeImages.length > 0;
  const hasAfter = safeAfterImages.length > 0;

  const nextBefore = () => {
    if (!hasBefore) return;
    setBeforeIndex((prev) => (prev + 1) % safeBeforeImages.length);
  };

  const prevBefore = () => {
    if (!hasBefore) return;
    setBeforeIndex((prev) => (prev === 0 ? safeBeforeImages.length - 1 : prev - 1));
  };

  const nextAfter = () => {
    if (!hasAfter) return;
    setAfterIndex((prev) => (prev + 1) % safeAfterImages.length);
  };

  const prevAfter = () => {
    if (!hasAfter) return;
    setAfterIndex((prev) => (prev === 0 ? safeAfterImages.length - 1 : prev - 1));
  };

  return (
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* BEFORE GALLERY */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-center text-gray-700 text-shadow-sm">Before</h3>

          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100">
            {hasBefore ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={beforeIndex}
                  src={safeBeforeImages[beforeIndex]}
                  alt={`Before image ${beforeIndex + 1}`}
                  className="w-full h-auto max-h-[36rem] object-contain"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </AnimatePresence>
            ) : (
              <div className="flex items-center justify-center h-96 md:h-[30rem] lg:h-[36rem] text-gray-400 text-sm">
                No before images provided
              </div>
            )}

            {hasBefore && (
              <>
                <button
                  onClick={prevBefore}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 shadow"
                >
                  ‹
                </button>
                <button
                  onClick={nextBefore}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 shadow"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {hasBefore && (
            <p className="text-sm text-center text-gray-500">
              {beforeIndex + 1} / {safeBeforeImages.length}
            </p>
          )}
        </div>

        {/* AFTER GALLERY */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-center text-gray-700 text-shadow-sm">After</h3>

          <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100">
            {hasAfter ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={afterIndex}
                  src={safeAfterImages[afterIndex]}
                  alt={`After image ${afterIndex + 1}`}
                  className="w-full h-auto max-h-[36rem] object-contain drop-shadow-xl/50 rounded-md"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </AnimatePresence>
            ) : (
              <div className="flex items-center justify-center h-96 md:h-[30rem] lg:h-[36rem] text-gray-400 text-sm">
                No after images provided
              </div>
            )}

            {hasAfter && (
              <>
                <button
                  onClick={prevAfter}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 shadow"
                >
                  ‹
                </button>
                <button
                  onClick={nextAfter}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-10 h-10 shadow"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {hasAfter && (
            <p className="text-sm text-center text-gray-500">
              {afterIndex + 1} / {safeAfterImages.length}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
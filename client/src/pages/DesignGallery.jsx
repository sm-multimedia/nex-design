import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import DesignGalleryScene from '../canvas/DesignGalleryScene';
import state from '../store';

const designs = [
  {
    image: '/images/customized-shirt.png',
    name: 'Nexora Signature',
    category: 'Brand identity',
    note: 'A clean emblem, made unmistakable.',
    color: '#23242a',
  },
  {
    image: '/images/tshirt3.png',
    name: 'Velocity',
    category: 'Sport & motion',
    note: 'A bold graphic with a fast-lane feel.',
    color: '#e0a92a',
  },
  {
    image: '/images/shirtdesign.png',
    name: 'GreenSprout',
    category: 'Nature & lifestyle',
    note: 'A fresh identity inspired by growth.',
    color: '#f1dc80',
  },
  {
    image: '/images/niceshirt.png',
    name: 'Geometric Form',
    category: 'Abstract',
    note: 'Strong lines for a confident look.',
    color: '#242424',
  },
  {
    image: '/images/greenpot.png',
    name: 'Future in Bloom',
    category: 'Nature & lifestyle',
    note: 'A statement piece with a greener point of view.',
    color: '#4b995b',
  },
];

const DesignGallery = () => {
  const [selectedDesign, setSelectedDesign] = useState(null);
  const closeButtonRef = useRef(null);
  const imageTriggerRef = useRef(null);

  useEffect(() => {
    if (!selectedDesign) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedDesign(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      imageTriggerRef.current?.focus();
    };
  }, [selectedDesign]);

  const returnHome = () => {
    state.gallery = false;
    state.intro = true;
  };

  const startDesigning = () => {
    state.gallery = false;
    state.intro = false;
  };

  return (
    <div className="design-gallery">
      <header className="gallery-nav">
        <button type="button" onClick={returnHome} className="gallery-brand" aria-label="Back to Nexora home">
          <img src="/nexora-logo.png" alt="" />
          <span>NEXORA</span>
        </button>
        <button type="button" onClick={returnHome} className="gallery-nav-link">
          Back to home
        </button>
      </header>

      <section className="gallery-hero">
        <div className="gallery-hero-copy">
          <p className="gallery-eyebrow">THE NEXORA COMMUNITY</p>
          <h1>Made by you.<br /><span>Worn by everyone.</span></h1>
          <p className="gallery-hero-description">
            A little inspiration goes a long way. Explore designs from our creative community,
            then make one that is unmistakably yours.
          </p>
          <div className="gallery-hero-actions">
            <button type="button" onClick={startDesigning} className="gallery-primary-button">
              Create your design <span aria-hidden="true">↗</span>
            </button>
            <span className="gallery-member-note">A canvas for your next great idea</span>
          </div>
        </div>
        <div className="gallery-stage" aria-label="Interactive 3D showcase of community shirt designs">
          <div className="gallery-stage-glow" />
          <DesignGalleryScene />
          <span className="gallery-stage-hint">DRAG TO EXPLORE</span>
        </div>
        <div className="gallery-hero-index" aria-hidden="true">01 / COMMUNITY</div>
      </section>

      <section className="gallery-collection">
        <div className="gallery-section-heading">
          <div>
            <p className="gallery-eyebrow">A FEW OF OUR FAVORITES</p>
            <h2>Fresh from the community</h2>
          </div>
          <p>Real ideas. Distinctive details. Endless ways to make them your own.</p>
        </div>

        <div className="design-grid">
          {designs.map((design, index) => (
            <motion.article
              key={design.image}
              className="design-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <div className="design-card-image" style={{ backgroundColor: design.color }}>
                <button
                  type="button"
                  className="design-image-trigger"
                  onClick={(event) => {
                    imageTriggerRef.current = event.currentTarget;
                    setSelectedDesign(design);
                  }}
                  aria-label={`View ${design.name} design larger`}
                >
                  <img src={design.image} alt={`${design.name} custom shirt design`} loading="lazy" />
                  <span className="design-image-zoom-hint" aria-hidden="true">
                    <span>+</span> View design
                  </span>
                </button>
                <span className="design-card-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="design-card-details">
                <div>
                  <p className="design-card-category">{design.category}</p>
                  <h3>{design.name}</h3>
                  <p className="design-card-note">{design.note}</p>
                </div>
                <button
                  type="button"
                  onClick={startDesigning}
                  aria-label={`Create a design inspired by ${design.name}`}
                  className="design-card-arrow"
                >
                  ↗
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <footer className="gallery-footer">
        <span>GOOD DESIGN STARTS WITH YOU.</span>
        <button type="button" onClick={startDesigning}>Make it yours <span aria-hidden="true">↗</span></button>
      </footer>

      {selectedDesign && (
        <motion.div
          className="design-lightbox"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedDesign(null);
          }}
        >
          <motion.div
            className="design-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="design-lightbox-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.24 }}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="design-lightbox-close"
              onClick={() => setSelectedDesign(null)}
              aria-label="Close enlarged design"
            >
              <span aria-hidden="true">×</span>
            </button>
            <div className="design-lightbox-image-wrap">
              <img
                className="design-lightbox-image"
                src={selectedDesign.image}
                alt={`${selectedDesign.name} custom shirt design, enlarged`}
              />
            </div>
            <div className="design-lightbox-caption">
              <div>
                <p className="design-card-category">{selectedDesign.category}</p>
                <h2 id="design-lightbox-title">{selectedDesign.name}</h2>
                <p>{selectedDesign.note}</p>
              </div>
              <button type="button" onClick={startDesigning} className="gallery-primary-button">
                Create your design <span aria-hidden="true">↗</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DesignGallery;

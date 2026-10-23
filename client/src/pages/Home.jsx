import { motion, AnimatePresence } from 'framer-motion';
import { useSnapshot } from 'valtio';

import state from '../store';
import { CustomButton } from '../components';
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
  slideAnimation
} from '../config/motion';

const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation('left')}>
          <motion.header {...slideAnimation("down")}>
            <img 
              src='/nexora-logo.png'
              alt="Nexora"
              className="w-28 h-16 object-contain"
              style={{ filter: 'brightness(0)' }}
            />
          </motion.header>

          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                LET'S <br className="xl:block hidden" /> DO IT.
              </h1>
            </motion.div>
            <motion.div
              {...headContentAnimation}
              className="flex flex-col gap-5"
            >
              <p className="max-w-md font-normal text-gray-600 text-base">
              Create your unique and exclusive shirt with our brand-new 3D customization tool. <strong>Unleash your imagination</strong>{" "} and define your own style.
              </p>

              <div className="flex flex-wrap gap-3">
                <CustomButton 
                  type="filled"
                  title="Start Designing"
                  handleClick={() => state.intro = false}
                  customStyles="w-fit px-4 py-2.5 font-bold text-sm"
                />
                <button
                  type="button"
                  onClick={() => state.gallery = true}
                  className="rounded-md border border-gray-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:shadow-md"
                >
                  Explore Community Designs
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

export default Home
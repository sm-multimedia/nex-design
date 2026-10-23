import { proxy } from 'valtio';

const state = proxy({
  intro: true,
  gallery: false,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: '/nexora-logo.png',
  fullDecal: '/nexora-logo.png',
});

export default state;
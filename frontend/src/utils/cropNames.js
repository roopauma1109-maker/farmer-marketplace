import { getCropDisplayName, getCropKey, CROP_TAMIL_NAMES, CROP_ENGLISH_NAMES } from './cropRegistry';

export const getLocalizedCropName = (cropName, language = 'en') => {
  return getCropDisplayName(cropName, language);
};

export { getCropDisplayName, getCropKey, CROP_TAMIL_NAMES, CROP_ENGLISH_NAMES };
export default getCropDisplayName;

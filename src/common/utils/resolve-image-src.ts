import { uploadImage } from './upload-image';

export const resolveImageSrc = async (img?: Express.Multer.File) => {
    if (img) {
        const uploadedImage = await uploadImage(img);
        return uploadedImage.url;
    }
    return null;
};

import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: 'doomw0bct',
    api_key: '719818845964588',
    api_secret: '6Dyc_ATfT1Iv-NtGtqY5W2EthNI',
});

export const uploadImage = async (
    img: Express.Multer.File,
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream((err, callResult) => {
            if (err) {
                return reject(err);
            }
            return resolve(callResult as UploadApiResponse);
        });
        const readableStream = Readable.from(img.buffer);
        readableStream.pipe(uploadStream);
    });
};

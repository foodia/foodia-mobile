// Compress.jsx
import Compressor from "compressorjs";

const CompressImage = (file) => {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: 1,
            // maxWidth: 1024,
            success(result) {
                resolve(result);
            },
            error(err) {
                reject(err.message);
            }
        });
    });
};

export default CompressImage;

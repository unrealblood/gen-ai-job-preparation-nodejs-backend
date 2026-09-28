import multer from "multer";

export const uploadFile = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    }
});
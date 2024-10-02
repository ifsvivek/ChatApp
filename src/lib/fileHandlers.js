import fs from 'fs';
import path from 'path';

export async function saveUploadedImage(imageData) {
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    const filename = `upload_${Date.now()}.png`;
    const filepath = path.join(__dirname, 'uploads', filename);

    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, base64Data, 'base64', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(filename);
            }
        });
    });
}
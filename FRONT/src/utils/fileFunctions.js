import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';

///Gère l'upload du média dans le storage firebase, retourne l'url du média
export function uploadFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      console.error('No file provided');
      return reject('No file provided');
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optionally handle progress here
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
            reject(error);
          });
      }
    );
  });
}

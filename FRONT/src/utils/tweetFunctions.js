import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import axios from 'axios';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

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
            console.log('File available at', downloadURL);
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

export async function postTweetHandler(
  content,
  file,
  user,
  relatedTweet = null
) {
  if (content !== '') {
    try {
      let fileURL = null;
      if (file) {
        fileURL = await uploadFile(file);
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Utiliser la regex pour extraire les hashtags
      const hashtagRegex = /#(\w+)/g;
      const hashtags = [];
      let match;

      while ((match = hashtagRegex.exec(content)) !== null) {
        hashtags.push('#' + match[1]);
      }

      const updatedTweet = {
        content: content,
        author: user.id,
        media_url: fileURL,
        timezone: timezone,
        hashtags: hashtags,
      };

      if (relatedTweet.tweet != null) {
        updatedTweet.relatedTweet = relatedTweet.tweet.id;
      }

      updatedTweet.type = relatedTweet.action;
      const res = await axios.post(
        'https://127.0.0.1:8000/tweet/post',
        updatedTweet
      );

      console.log('Server response:', res);
      if (res.status === 201) {
        const newTweet = res.data.tweet;
        return newTweet; // Return the new tweet
      }
    } catch (error) {
      console.log('Error in postTweetHandler:', error);
    }
  } else {
    console.log('Tweet content is empty.');
  }
}

///Cette fonction calcule depuis combien de temps le tweet a été posté
///et retourne la valeur
export function formatTimeAgo(date) {
  const now = new Date();

  const days = differenceInDays(now, date);
  if (days > 0) {
    return `${days}j`;
  }

  const hours = differenceInHours(now, date);
  if (hours > 0) {
    return `${hours}h`;
  }

  const minutes = differenceInMinutes(now, date);
  if (minutes > 0) {
    return `${minutes}m`;
  }

  return "A l'instant";
}

///Convertit une date au format 1998-06-06 en 6 juin 1998
export function formatDate(dateString) {
  // Créer un objet Date à partir de la chaîne de date
  const date = new Date(dateString);

  // Options pour formater la date
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  // Utiliser Intl.DateTimeFormat pour formater la date
  const formatter = new Intl.DateTimeFormat('fr-FR', options);

  // Retourner la date formatée
  return formatter.format(date);
}

export function deleteTweet(tweetId) {
  axios
    .post('https://127.0.0.1:8000/tweet/delete', tweetId)
    .then((res) => console.log(res));
}

export const newTweetDisplayer = (
  newTweet,
  tweetToDisplay,
  setTweetToDisplay,
  setNewTweet
) => {
  if (
    newTweet.type != null &&
    (newTweet.type === 'answer' || newTweet.type === 'quote')
  ) {
    let tweetToEdit = tweetToDisplay.filter(
      (tweet) => tweet.id == newTweet.related_tweet.id
    )[0];
    ///Si le tweet parent est affiché, on modifie également ses stats
    if (tweetToEdit) {
      if (newTweet.type === 'answer') {
        tweetToEdit.answersCount++;
      } else {
        tweetToEdit.quotesCount++;
      }
    }
  }

  setTweetToDisplay((prevTweets) => {
    const tweetExists = prevTweets.some((tweet) => tweet.id === newTweet.id);
    if (tweetExists) {
      return prevTweets.map((tweet) =>
        tweet.id === newTweet.id ? newTweet : tweet
      );
    } else {
      return [newTweet, ...prevTweets];
    }
  });

  setNewTweet(null);
};

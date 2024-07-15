import {
  faCalendar,
  faChartSimple,
  faComment,
  faFaceSmile,
  faFilm,
  faGear,
  faHeart,
  faImage,
  faList,
  faLocationDot,
  faQuoteLeft,
  faRetweet,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow,
  parseISO,
} from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import ClipLoader from 'react-spinners/ClipLoader';
import PostBox from '../components/PostBox';
import Tweet from '../components/Tweet';
import defaultPp from '../assets/img/goku_sticker.png';
import { newTweetDisplayer } from '../utils/tweetFunctions';

const Home = (props) => {
  ///Recupere l'user stocké dans le state Redux
  let user = useSelector((state) => state);

  const [tweet, setTweet] = useState({
    author: null,
    content: null,
    media_url: null,
  });

  ///Contient le fichier uploadé du tweet
  const [file, setFile] = useState(null);
  ///Contient un pour afficher le média en preview
  const [filePreview, setFilePreview] = useState(null);
  ///Controle si un tweet est en cours d'envoi pour désactiver le bouton
  ///de post pour éviter le spam
  const [pending, setPending] = useState(false);
  ///Contient le nouveau tweet à afficher apres le post
  const [tweetToDisplay, setTweetToDisplay] = useState([]);
  ///Contient le nombre de nouveaux tweets depuis le dernier fetch en BDD
  const [newTweetsNumber, setNewTweetsNumber] = useState(0);

  const [pendingTL, setPendingTL] = useState(true);

  const [tlType, setTlType] = useState('foryou');

  const fileInputRef = useRef(null);

  ///Récupère le nouveau tweet crée puis l'ajoute au state
  ///des tweets à afficher
  useEffect(() => {
    if (tweetToDisplay.length > 0 && props.newTweet) {
      newTweetDisplayer(
        props.newTweet,
        tweetToDisplay,
        setTweetToDisplay,
        props.setNewTweet
      );
    }
  }, [props.newTweet]);

  const tweetDataHandler = (attribute, value) => {
    setTweet((prevState) => ({
      ...prevState,
      [attribute]: value,
    }));
  };

  let getTL = () => {
    setPendingTL(true);
    let data = {
      id: user.id,
      type: tlType,
    };
    axios.post(`https://127.0.0.1:8000/tweet/get_tl`, data).then((res) => {
      if (res.status === 200) {
        let tweets = res.data;
        let sortedTweets = tweets.sort(
          (a, b) => parseISO(b.date) - parseISO(a.date)
        );
        setTweetToDisplay(sortedTweets);
        setPendingTL(false);
      }
    });
  };

  ///Recupere les tweets pour la tl de l'user
  useEffect(() => {
    if (user.id) {
      getTL();

      ///Toutes les 3 minutes, récupère le nombre total de tweets et attribue
      ///au state la valeur de la différence entre le nombre de twwet en bdd et ceux affichés
      ///à l'utilisateur
      const intervalId = setInterval(() => {
        if (user.id) {
          axios
            .get(`https://127.0.0.1:8000/tweet/getNumberOfNewTweets`)
            .then((res) => {
              if (res.status === 200) {
                let newTweetsNumber = res.data - tweetToDisplay.length;
                setNewTweetsNumber(newTweetsNumber);
              }
            });
        }
      }, 180000);

      return () => clearInterval(intervalId);
    }
  }, [user.id, tweetToDisplay.length, tlType]);

  ///Gère l'upload du média dans le storage firebase, retourne l'url du média
  const uploadFile = (file) => {
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
              tweetDataHandler('media_url', downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error('Error getting download URL:', error);
              reject(error);
            });
        }
      );
    });
  };

  ///Gère le post d'un tweet
  const postTweetHandler = async () => {
    if (tweet.content !== '') {
      setPending(true);
      try {
        let fileURL = null;
        if (file) {
          fileURL = await uploadFile(file);
        }

        // Utiliser la regex pour extraire les hashtags
        const hashtagRegex = /#(\w+)/g;
        const hashtags = [];
        let match;

        while ((match = hashtagRegex.exec(tweet.content)) !== null) {
          hashtags.push('#' + match[1]);
        }

        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const updatedTweet = {
          ...tweet,
          author: user.id,
          media_url: fileURL,
          timezone: timezone,
          hashtags: hashtags,
        };

        const res = await axios.post(
          'https://127.0.0.1:8000/tweet/post',
          updatedTweet
        );

        if (res.status === 201) {
          setPending(false);
          // Créer une nouvelle copie du tableau de tweets et ajouter le nouveau tweet en premier
          setTweetToDisplay([res.data.tweet, ...tweetToDisplay]);

          // Réinitialiser l'état
          tweetDataHandler('content', '');
          setFile(null);
          setFilePreview(null);
        }
      } catch (error) {
        setPending(false);
        console.log('Error in postTweetHandler:', error);
        toast.error('Une erreur est survenue lors de la publication du tweet');
      }
    } else {
      console.log('Pas de contenu');
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      e.target.value = null; // Réinitialiser la valeur du champ de fichier
    }
  };

  const textareaRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleInput = (e) => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 155)}px`;
    }, 100); // délai de 100ms, ajustez selon vos besoins
  };

  return (
    <div className="w-full bg-black z-0 h-full relative">
      <div className="border-b-[1px] border-slate-700 text-white ">
        <span className="flex justify-around relative w-[90%] mx-auto">
          <p
            className={`${
              tlType === 'foryou'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : 'text-slate-500'
            }  py-3  cursor-pointer font-bold`}
            onClick={() => setTlType('foryou')}
          >
            Pour vous
          </p>
          <p
            className={`${
              tlType === 'follow'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : 'text-slate-500'
            }  py-3  cursor-pointer font-bold`}
            onClick={() => setTlType('follow')}
          >
            Abonnements
          </p>
          <FontAwesomeIcon
            icon={faGear}
            className="absolute right-0 top-1/2 translate-x-[-50%] translate-y-[-50%] text-slate-500"
          />
        </span>
      </div>
      <div className="flex w-full py-3 px-3 border-b-[1px] border-slate-700 ">
        <img
          src={user.profil_pic ? user.profil_pic : defaultPp}
          className=" h-[48px] w-[48px] max-w-[48px] rounded-full object-cover"
        />
        <div className="w-full px-4">
          <textarea
            className="w-full pt-2 mb-4 bg-transparent text-lg pl-2 text-slate-300 min-h-[70px] resize-none outline-none focus:outline-[#1D9BF0] rounded-sm"
            placeholder="Quoi de neuf ?!"
            value={tweet.content}
            onChange={(e) => {
              tweetDataHandler('content', e.target.value);
              handleInput(e);
            }}
            ref={textareaRef}
            maxLength={255}
          ></textarea>

          {filePreview ? (
            <span className="h-fit w-fit relative ">
              <span
                className="bg-slate-800 px-[8px] py-[3px] rounded-full absolute right-0 top-0 text-white translate-x-[50%] translate-y-[50%] cursor-pointer"
                onClick={() => {
                  setFile(null);
                  setFilePreview(null);
                }}
              >
                <FontAwesomeIcon icon={faX} />
              </span>
              {filePreview &&
                (file.type.startsWith('video/') ? (
                  <video
                    src={filePreview}
                    controls
                    className="w-full rounded-lg"
                  />
                ) : (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full rounded-lg "
                  />
                ))}
            </span>
          ) : null}

          <span className="w-full flex justify-between mt-4">
            {' '}
            <ul className="w-full flex items-center text-slate-500">
              <li className="mr-3">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <FontAwesomeIcon
                    icon={faImage}
                    style={{ color: '#1d9bf0', cursor: 'pointer' }}
                    onClick={handleIconClick}
                  />
                </div>
              </li>
              <li className="mr-3">
                <FontAwesomeIcon icon={faFilm} />
              </li>
              <li className="mr-3">
                <FontAwesomeIcon icon={faList} />
              </li>
              <li className="mr-3">
                <FontAwesomeIcon icon={faFaceSmile} />
              </li>
              <li className="mr-3">
                <FontAwesomeIcon icon={faCalendar} />
              </li>
              <li className="mr-3">
                <FontAwesomeIcon icon={faLocationDot} />
              </li>
            </ul>
            <span className="flex items-center">
              <button
                className={`${
                  pending ? 'bg-[#136298] mr-4' : 'bg-[#1D9BF0]'
                }  px-5 py-[6px] text-white font-bold rounded-full`}
                onClick={() => postTweetHandler()}
                disabled={pending}
              >
                Poster
              </button>
              {pending ? (
                <ClipLoader
                  color={'#1D9BF0'}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : null}
            </span>
          </span>
        </div>
      </div>
      {newTweetsNumber > 0 ? (
        <div
          className="py-3 text-center border-b-[1px] border-slate-700 cursor-pointer hover:bg-slate-900"
          onClick={() => {
            getTL();
            setNewTweetsNumber(0);
          }}
        >
          <p className="text-[#1D9BF0] ">
            Voir {newTweetsNumber} nouveau{newTweetsNumber > 1 ? 'x' : null}{' '}
            post{newTweetsNumber > 1 ? 's' : null}
          </p>
        </div>
      ) : null}

      <div className="text-white">
        <ul className="list-none">
          {pendingTL ? (
            <ClipLoader
              color={'#1D9BF0'}
              size={80}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="mt-8"
            />
          ) : (
            tweetToDisplay.map((tweet) => (
              <Tweet
                id={tweet.id}
                tweet={tweet}
                setNewTweet={props.setNewTweet}
                setTweetInfo={props.setTweetInfo}
              />
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Home;

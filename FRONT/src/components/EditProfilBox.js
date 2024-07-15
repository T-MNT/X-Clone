import { faCamera, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import profilBG from '../assets/img/poisson.png';
import profilPP from '../assets/img/goku_sticker.png';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { updateUserField } from '../redux/slices/UserSlice';
import ClipLoader from 'react-spinners/ClipLoader';
import { uploadFile } from '../utils/tweetFunctions';
import { Field } from 'formik';

const EditProfilBox = (props) => {
  const user = useSelector((state) => state);
  const dispatch = useDispatch();
  const ppInputRef = useRef(null);
  const coverInputRef = useRef(null);

  ///Stocke le fichier de la nouvelle PP (profil picture) et le lien de preview
  const [ppFile, setPpFile] = useState(null);
  const [ppFilePreview, setPpFilePreview] = useState(null);
  ///Stocke le fichier de la nouvelle couverture et le lien de preview
  const [coverFile, setCoverFile] = useState(null);
  const [coverFilePreview, setCoverFilePreview] = useState(null);

  const [pending, setPending] = useState(false);

  const [birthdateEdit, setBirthdateEdit] = useState(false);

  const [profil, setProfil] = useState({
    id: user.id,
    pseudo: null,
    bio: null,
    website: null,
    location: null,
    profil_pic: null,
    cover_pic: null,
    birthdate: null,
  });

  const profilDataHandler = (attribute, value) => {
    setProfil((prevState) => ({
      ...prevState,
      [attribute]: value,
    }));
  };

  ///Cette partie est utilisée pour générer les options des selects

  ///On récupère l'année actuelle pour connaître la longueur du tableau des années
  //puis on calcule la longueur totale avec l'année de début 1901
  const currentYear = new Date().getFullYear(); // Obtient l'année actuelle
  const startYear = 1901;
  const numberOfYears = currentYear - startYear + 1; // +1 pour inclure aussi l'année actuelle

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from(
    { length: numberOfYears },
    (_, index) => startYear + index
  ).reverse();

  let editProfilHandler = async () => {
    setPending(true);

    try {
      let ppUrl = null;
      let coverUrl = null;

      if (ppFile) {
        ppUrl = await uploadFile(ppFile);
      }
      if (coverFile) {
        coverUrl = await uploadFile(coverFile);
      }

      let updatedProfil = {
        ...profil,
        profil_pic: ppUrl,
        cover_pic: coverUrl,
      };

      axios
        .post('https://localhost:8000/user/updateProfil', updatedProfil)
        .then((res) => {
          if (res.status === 200) {
            if (profil.pseudo != null) {
              console.log('hhhhh');
              dispatch(
                updateUserField({ field: 'pseudo', value: profil.pseudo })
              );
            }
            if (profil.bio != null) {
              dispatch(updateUserField({ field: 'bio', value: profil.bio }));
            }
            if (profil.website != null) {
              dispatch(
                updateUserField({ field: 'website', value: profil.website })
              );
            }
            if (profil.location != null) {
              dispatch(
                updateUserField({ field: 'location', value: profil.location })
              );
            }
            if (ppFile != null) {
              dispatch(updateUserField({ field: 'profil_pic', value: ppUrl }));
            }
            if (coverFile != null) {
              dispatch(
                updateUserField({ field: 'cover_pic', value: coverUrl })
              );
            }
            setPending(false);
            props.setEditProfil(false);
          }
        });
    } catch (error) {
      console.log(error);
    }
    return;
  };

  let saveButtonToggle = () => {
    if (
      profil.pseudo ||
      profil.bio ||
      profil.website ||
      profil.location ||
      ppFile ||
      coverFile
    ) {
      return false;
    } else {
      return true;
    }
  };

  const ppIconClick = () => {
    ppInputRef.current.click();
  };
  const coverIconClick = () => {
    coverInputRef.current.click();
  };

  return (
    <div className="fixed z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] overflow-y-scroll rounded-xl max-h-[650px] w-[600px] bg-black pb-8  pt-3">
      <div className="flex justify-between items-center text-white mb-4 px-4">
        <span className="flex items-center">
          <FontAwesomeIcon
            icon={faX}
            className="cursor-pointer mr-12"
            color="#FFFFFF"
            onClick={() => {
              props.setEditProfil(false);
            }}
          />
          <h4 className="text-xl font-bold">Editer le profil</h4>
        </span>

        <span className="flex items-center">
          {' '}
          <button
            className={`${
              saveButtonToggle() === true
                ? 'bg-slate-400'
                : 'bg-white cursor-pointer'
            }  font-bold text-black px-4 py-1 rounded-2xl`}
            disabled={saveButtonToggle()}
            onClick={() => editProfilHandler()}
          >
            Enregistrer
          </button>{' '}
          {pending ? (
            <ClipLoader
              color={'#1D9BF0'}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
              className="ml-2"
            />
          ) : null}
        </span>
      </div>
      <div className="h-[200px] relative">
        <img
          src={coverFilePreview ? coverFilePreview : user.cover_pic}
          className="w-full px-[1px] h-full object-cover"
        />
        <span
          className="absolute left-1/2 translate-x-[-50%] translate-y-[-50%] top-1/2 text-white p-3 bg-black/70 rounded-full cursor-pointer"
          onClick={coverIconClick}
        >
          <FontAwesomeIcon icon={faCamera} size="xl" />
        </span>
        <input
          type="file"
          ref={coverInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            setCoverFile(e.target.files[0]);
            setCoverFilePreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
      </div>

      <div className="relative pb-3">
        <div className="h-[130px] w-[130px] rounded-full absolute left-4 top-[-76px] border-[4px] border-black">
          <div className="h-full w-full rounded-full relative">
            <img
              className="w-full h-full rounded-full object-cover"
              src={ppFilePreview ? ppFilePreview : user.profil_pic}
            />
            <span
              className="absolute left-1/2 translate-x-[-50%] translate-y-[-50%] top-1/2 text-white p-3 bg-black/70 rounded-full cursor-pointer"
              onClick={ppIconClick}
            >
              <FontAwesomeIcon icon={faCamera} size="xl" />
            </span>
            <input
              type="file"
              ref={ppInputRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                setPpFile(e.target.files[0]);
                setPpFilePreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>
        </div>

        <div className="h-[80px]" />
      </div>
      <div className="w-[90%] mx-auto text-white">
        <input
          type="text"
          className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-8"
          placeholder={user.pseudo}
          onChange={(e) => profilDataHandler('pseudo', e.target.value)}
        />
        <textarea
          className="w-full border-[1px] min-h-[80px] text-lg border-slate-700 bg-transparent rounded px-2 pt-1 pb-3 mb-8"
          placeholder={user.bio ? user.bio : 'Bio'}
          onChange={(e) => profilDataHandler('bio', e.target.value)}
          maxLength={255}
        ></textarea>
        <input
          type="text"
          className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-8"
          placeholder={user.location ? user.location : 'Localisation'}
          onChange={(e) => profilDataHandler('location', e.target.value)}
        />
        <input
          type="text"
          className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-8"
          placeholder={user.website ? user.website : 'Site web'}
          onChange={(e) => profilDataHandler('website', e.target.value)}
        />
        {birthdateEdit ? (
          <div className="text-left">
            <span className="flex items-center mb-3">
              <p className="text-slate-400 mr-3 text-white font-bold">
                Date de naissance
              </p>
              <p
                className="text-[#1C9AF0] cursor-pointer"
                onClick={() => setBirthdateEdit(false)}
              >
                Annuler
              </p>
            </span>
            <p className="text-slate-500">
              Il doit s'agir de la date de naissance de la personne qui utilise
              le compte. Même si vous créez un compte pour votre entreprise, un
              événement ou votre chat. <br /> X utilise votre âge pour
              personnaliser votre expérience, dont les publicités, comme indiqué
              dans notre Politique de confidentialité.
            </p>
            <span className="flex justify-between mt-6">
              <select
                name="month"
                className="border-[1px] w-[45%] bg-transparent rounded h-14 w-48 border-slate-700 pl-3 text-slate-500"
              >
                <option value={0}>Mois</option>
                <option value={1}>Janvier</option>
                <option value={2}>Février</option>
                <option value={3}>Mars</option>
                <option value={4}>Avril</option>
                <option value={5}>Mai</option>
                <option value={6}>Juin</option>
                <option value={7}>Juillet</option>
                <option value={8}>Août</option>
                <option value={9}>Septembre</option>
                <option value={10}>Octobre</option>
                <option value={11}>Novembre</option>
                <option value={12}>Décembre</option>
              </select>
              <select
                as="select"
                name="day"
                className="border-[1px] bg-transparent rounded w-[20%] h-14 w-28 border-slate-700 pl-3 text-slate-500"
              >
                <option>Jour</option>
                {days.map((day) => (
                  <option value={day}>{day}</option>
                ))}
              </select>
              <select
                as="select"
                name="year"
                className="border-[1px] w-[30%] bg-transparent rounded h-14 w-24 border-slate-700 pl-3 text-slate-500"
              >
                <option>Année</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </span>
          </div>
        ) : (
          <div className="text-left">
            <span className="flex items-center">
              {' '}
              <p className="text-slate-400 mr-3">Date de naissance .</p>
              <p
                className="text-[#1C9AF0] cursor-pointer"
                onClick={() => setBirthdateEdit(true)}
              >
                Editer
              </p>
            </span>
            <p className="text-white text-xl mt-2">6 juin 1998</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfilBox;

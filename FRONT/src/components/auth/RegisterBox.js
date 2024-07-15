import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import React, { useState } from 'react';

const RegisterBox = (props) => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({
    email: '',
    fullname: '',
    birthdate: null,
    password: '',
    pseudo: '',
    username: '',
  });

  ///Modifie la valeur de l'attribut de userData passé en paramètre. La seconde
  ///valeur est la nouvelle valeur de l'attribut à modifier
  const userDataHandler = (attribute, e) => {
    let value = e.target.value;
    setUserData((prevState) => ({
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
  );

  let createUserHandler = (values) => {
    console.log(values);

    axios
      .post('https://127.0.0.1:8000/register', values)
      .then((res) => console.log(res));
  };

  const getValidationSchema = (step) => {
    switch (step) {
      case 0:
        return registerSchemaPart1;
      case 1:
        return registerSchemaPart2;
      case 2:
        return registerSchemaPart3;
      default:
        return registerSchemaPart1; // Retourne un schéma par défaut si l'étape n'est pas définie
    }
  };

  const registerSchemaPart1 = yup.object().shape({
    email: yup
      .string()
      .email('Adresse email invalide')
      .matches(
        /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/,
        'Veuillez entrer une adresse mail valide'
      )
      .required('Champ email requis'),
    fullname: yup
      .string()
      .required('Champ nom complet requis')
      .min(3, 'Le nom complet doit contenir au moins 3 caractères')
      .max(64, 'Le nom complet doit contenir moins de 65 caractères')
      .matches(
        /^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]*$/,
        'Le nom complet ne doit pas contenir de chiffre ou de caractère spécial'
      ),
    month: yup.string().required('Champ mois requis'),
    day: yup.string().required('Champ day requis'),
    year: yup.string().required('Champ year requis'),
  });

  const registerSchemaPart2 = yup.object().shape({
    username: yup
      .string()
      .min(4, "Le nom d'utilisateur doit contenir au moins 4 caractères")
      .required("Champ nom d'utilisateur requis"),
    pseudo: yup
      .string()
      .min(4, 'Le pseudo doit contenir au moins 4 caractères')
      .required('Champ pseudo requis'),
  });

  const registerSchemaPart3 = yup.object().shape({
    password: yup
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .matches(
        /^(?=.*[A-Z])(?=.*\d).{8,}$/,
        'Le mot de passe dont contenir au moins 8 caractères dont au moins une majuscule et un chiffre'
      )
      .required('Champ mot de passe requis'),
  });

  let contentDisplayer = ({ isValid }) => {
    switch (step) {
      case 0:
        return (
          <div className="text-white text-left">
            <span className="flex justify-center mb-8">
              <FontAwesomeIcon icon={faXTwitter} className="h-8 mx-auto " />
            </span>
            <div className="px-10 ">
              <div>
                <h2 className="text-3xl font-bold mb-10">Créer votre compte</h2>
                <div className="mb-8">
                  <Field
                    type="text"
                    name="fullname"
                    as=""
                    className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-2"
                    placeholder={
                      userData.fullname != ''
                        ? userData.fullname
                        : 'Nom et prénom'
                    }
                  ></Field>
                  <span className="text-slate-400">
                    <ErrorMessage name="fullname" />
                  </span>
                </div>

                <div className="mb-8">
                  <Field
                    type="text"
                    name="email"
                    className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-2"
                    placeholder={
                      userData.email != '' ? userData.email : 'Email'
                    }
                  ></Field>
                  <span className="text-slate-400">
                    <ErrorMessage name="email" />
                  </span>
                </div>
              </div>
              <div>
                <span className="mb-6">
                  <p className="font-bold mb-1">Date de naissance</p>
                  <p className="text-slate-500 text-sm">
                    Cette information ne sera pas affichée publiquement.
                    Confirmez votre âge, même si ce compte est pour une
                    entreprise, un animal de compagnie ou autre chose.
                  </p>
                </span>

                <span className="flex justify-between mt-6 mb-12">
                  <Field
                    as="select"
                    name="month"
                    className="border-[1px] bg-transparent rounded h-14 w-48 border-slate-700 pl-3 text-slate-500"
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
                  </Field>
                  <Field
                    as="select"
                    name="day"
                    className="border-[1px] bg-transparent rounded h-14 w-28 border-slate-700 pl-3 text-slate-500"
                  >
                    <option>Jour</option>
                    {days.map((day) => (
                      <option value={day}>{day}</option>
                    ))}
                  </Field>
                  <Field
                    as="select"
                    name="year"
                    className="border-[1px] bg-transparent rounded h-14 w-24 border-slate-700 pl-3 text-slate-500"
                  >
                    <option>Année</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Field>
                </span>
                <button
                  className={`${
                    !isValid ? 'bg-slate-500' : 'bg-white'
                  } text-black font-bold w-full py-4 rounded-full`}
                  onClick={() => setStep(step + 1)}
                  disabled={!isValid}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="text-white text-left">
            <span className="flex justify-center mb-8">
              <FontAwesomeIcon icon={faXTwitter} className="h-8 mx-auto " />
            </span>
            <div className="px-10 ">
              <div>
                <h2 className="text-3xl font-bold mb-10">
                  Choissisez votre pseudo et votre nom d'utilisateur
                </h2>
                <div className="mb-4">
                  <Field
                    type="text"
                    name="pseudo"
                    className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-2"
                    placeholder={
                      userData.pseudo != '' ? userData.pseudo : 'Pseudo'
                    }
                  />
                  <span className="text-slate-400">
                    <ErrorMessage name="pseudo" />
                  </span>
                </div>

                <Field
                  type="text"
                  name="username"
                  className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-8"
                  placeholder={
                    userData.username != ''
                      ? userData.username
                      : "Nom d'utilisateur"
                  }
                />
              </div>
              <p className="text-[#1C9AF0] text-sm text-center mb-8">
                En vous vous inscrivant vous acceptez les termes du contrat
                d'utilisation et la politique de confidentialité de
                l'application
              </p>
              <div>
                <button
                  className={`${
                    !isValid ? 'bg-[#136298]' : 'bg-[#1C9AF0]'
                  } text-black font-bold w-full py-4 rounded-full text-white mb-6`}
                  onClick={() => setStep(step + 1)}
                  disabled={!isValid}
                >
                  Suivant
                </button>
                <button
                  className="bg-white text-black font-bold w-full py-4 rounded-full"
                  onClick={() => setStep(0)}
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-white text-left">
            <span className="flex justify-center mb-8">
              <FontAwesomeIcon icon={faXTwitter} className="h-8 mx-auto " />
            </span>
            <div className="px-10 ">
              <div>
                <h2 className="text-3xl font-bold mb-10">
                  Choissisez votre mot de passe
                </h2>
                <div className="mb-8">
                  <Field
                    type="password"
                    name="password"
                    className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-2"
                    placeholder={
                      userData.password != ''
                        ? userData.password
                        : 'Mot de passe'
                    }
                  />
                  <span className="text-slate-400">
                    <ErrorMessage name="password" />
                  </span>
                </div>

                <input
                  type="password"
                  className="w-full border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-8"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>
              <p className="text-[#1C9AF0] text-sm text-center mb-8">
                En vous vous inscrivant vous acceptez les termes du contrat
                d'utilisation et la politique de confidentialité de
                l'application
              </p>
              <div>
                <input
                  type="submit"
                  className={`${
                    !isValid ? 'bg-[#136298]' : 'bg-[#1C9AF0]'
                  }  text-white font-bold w-full py-4 rounded-full mb-6`}
                  value="S'inscrire"
                  disabled={!isValid}
                />
                <button
                  className="bg-white text-black font-bold w-full py-4 rounded-full"
                  onClick={() => setStep(0)}
                >
                  Retour
                </button>
              </div>
            </div>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        fullname: '',
        password: '',
        day: 0,
        month: 0,
        year: 0,
        pseudo: '',
        username: '',
      }}
      validationSchema={getValidationSchema(step)}
      // validationSchema={registerSchema}
      onSubmit={(values) => {
        // if (values.password === passwordConfirm) {
        //   createUser(values);
        // } else {
        //   toast.error('Les mots de passe sont differents', {
        //     position: toast.POSITION.BOTTOM_RIGHT,
        //   });
        // }
        createUserHandler(values);
      }}
    >
      {({ isValid }) => <Form>{contentDisplayer({ isValid })}</Form>}
    </Formik>
  );
};

export default RegisterBox;

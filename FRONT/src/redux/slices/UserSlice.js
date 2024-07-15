import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    email: null,
    roles: null,
    fullname: null,
    birthdate: null,
    username: null,
    pseudo: null,
    profil_pic: null,
    cover_pic: null,
    bio: null,
    website: null,
    location: null,
    followers: null,
    followings: null,
    signets: null,
  },
  reducers: {
    setUserRedux: (state, action) => {
      const {
        id,
        email,
        pseudo,
        username,
        roles,
        fullname,
        birthdate,
        profil_pic,
        cover_pic,
        bio,
        website,
        location,
        followers,
        followings,
        signets,
      } = action.payload;
      state.id = id;
      state.username = username;
      state.pseudo = pseudo;
      state.email = email;
      state.roles = roles;
      state.fullname = fullname;
      state.birthdate = birthdate;
      state.profil_pic = profil_pic;
      state.cover_pic = cover_pic;
      state.bio = bio;
      state.website = website;
      state.location = location;
      state.followers = followers;
      state.followings = followings;
      state.signets = signets;
    },
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      if (state.hasOwnProperty(field)) {
        state[field] = value;
      }
    },
  },
});

export const { setUserRedux, updateUserField } = userSlice.actions;
export default userSlice.reducer;

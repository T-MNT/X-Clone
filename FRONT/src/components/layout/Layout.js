import React, { useEffect, useState } from 'react';
import RightSidebar from './RightSidebar';
import LeftSidebar from './LeftSidebar';
import PostBox from '../PostBox';
import EditProfilBox from '../EditProfilBox';
import DeleteBox from '../DeleteBox';

const Layout = (props) => {
  ///C'est layout qui gère l'affichage ou non de postBox ( sert à poster ) car
  ///il y a un bouton poster dans leftSidebar et dans Home, il passe donc les différentes
  ///méthodes utiles à postBox et childrenWithProps

  const [editProfil, setEditProfil] = useState(false);

  const [newTweet, setNewTweet] = useState(null);

  const [tweetToDelete, setTweetToDelete] = useState(null);

  const [tweetInfo, setTweetInfo] = useState(null);

  // Ajout des props que vous souhaitez passer à l'enfant
  const childProps = {
    newTweet,
    setEditProfil,
    setNewTweet,
    setTweetInfo,
    setTweetToDelete,
  };

  // Clone l'enfant et lui passe les nouvelles props
  const childrenWithProps = React.Children.map(props.children, (child) =>
    React.cloneElement(child, { ...childProps })
  );

  return (
    <div className="relative max-w-screen min-h-screen flex ">
      {tweetInfo &&
      (tweetInfo.action === 'answer' ||
        tweetInfo.action === 'quote' ||
        tweetInfo.action === 'post') ? (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="absolute inset-0 bg-white opacity-20"></div>
          <div className="relative z-30">
            <PostBox
              setNewTweet={setNewTweet}
              tweetInfo={tweetInfo}
              setTweetInfo={setTweetInfo}
            />
          </div>
        </div>
      ) : null}

      {editProfil ? (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="absolute inset-0 bg-white opacity-20"></div>
          <div className="relative z-30">
            <EditProfilBox setEditProfil={setEditProfil} />
          </div>
        </div>
      ) : null}

      {tweetInfo && tweetInfo.action === 'delete' ? (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="absolute inset-0 bg-white opacity-20"></div>
          <div className="relative z-30">
            <DeleteBox tweetInfo={tweetInfo} setTweetInfo={setTweetInfo} />
          </div>
        </div>
      ) : null}
      <div className="flex-1 flex justify-end bg-black border-r-[1px] border-slate-600">
        <LeftSidebar setTweetInfo={setTweetInfo} />
      </div>
      <div className="w-[600px]">{childrenWithProps}</div>

      <RightSidebar />
    </div>
  );
};

export default Layout;

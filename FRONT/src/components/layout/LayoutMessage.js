import React, { useState } from 'react';
import LeftSidebar from '../layout/LeftSidebar';
import NewConvBox from '../NewConvBox';

const LayoutMessage = (props) => {
  // Gère l'affichage de la modal pour créer une nouvelle conversation
  const [newConvBox, setNewConvBox] = useState(false);

  // Cloner les enfants pour passer setNewConvBox en props
  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { setNewConvBox });
    }
    return child;
  });

  return (
    <div className="w-screen h-screen flex flex-row relative">
      {newConvBox ? (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="absolute inset-0 bg-white opacity-20"></div>
          <div className="relative z-30">
            <NewConvBox setNewConvBox={setNewConvBox} />
          </div>
        </div>
      ) : null}

      <div className="w-[600px] flex justify-end bg-black border-r-[1px] border-slate-600">
        <LeftSidebar />
      </div>
      {childrenWithProps}
      <div className="flex-1 flex bg-black"></div>
    </div>
  );
};

export default LayoutMessage;

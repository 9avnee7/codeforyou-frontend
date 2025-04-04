import React, { useContext } from 'react';
import { GlobalContext } from '../../index';
import Hiimage from '../../assets/undraw_mello_uiud.svg'

const HiUser = () => {
  const { userInfo ,loggedIn} = useContext(GlobalContext);
  
  if (!userInfo || !userInfo?.userData?.name || !loggedIn) return null;


  return (
    <div className=" mt-14  w-full  p-3 text-lg font-semibold flex items-center shadow-lg rounded-2xl mx-4">
     <img src={Hiimage} alt=""  className='w-[60px]'/>
      <span className="ml-2 text-black text-4xl w-full">Hi,{userInfo?.userData?.name}!</span>
    </div>
  );
};

export default HiUser;

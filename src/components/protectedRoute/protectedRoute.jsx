import React, { useContext } from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import { GlobalContext } from '../..'
import Dashboard from '../dashboard/dashboard';
import { set } from 'date-fns';

const ProtectedRoute = () => {
  const {userInfo,loading,loggedIn}=useContext(GlobalContext);
    // console.log('userinfo:',userInfo)
    if(loading){
        return <p>Loading......</p>
    }

    return loggedIn  ? <Outlet/>:<Navigate to="/home" replace />
}

export default ProtectedRoute


// const ProtectPremiumRoute=()=>{
//     const {loggedIn,userInfo}=useContext(GlobalContext);
   
//     // return loggedIn? <Login/>:<Navigate to
// }
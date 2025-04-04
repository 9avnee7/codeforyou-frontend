import React,{useContext} from 'react'
import { Outlet,Navigate } from 'react-router-dom'
import { GlobalContext } from '../..'


const AdminRoute = () => {
    const {loading,userInfo}=useContext(GlobalContext);

    if(loading){
        return <p>Loading.......</p>
    }

  return (
    userInfo?.userData?.user==='admin'? <Outlet/>:<Navigate to='/admin-page' replace />
  )
}

export default AdminRoute

import React, { useContext } from 'react'
import { GlobalContext } from '../..';


const RefreshToken = () => {
    const {setAccessToken}=useContext(GlobalContext);
    
    return(
        <>
        {refresh}
        </>
    )
  
}

export default RefreshToken

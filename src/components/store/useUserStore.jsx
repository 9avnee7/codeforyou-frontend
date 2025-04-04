import React from 'react'
import { create } from 'zustand';



const useUserStore=create(set=>({
    user:null,
    setUser:(userData)=>{
        set({user:userData});
        sessionStorage.setItem('user',JSON.stringify(userData));
    },
    logout:()=>{
        set({user:null});
        sessionStorage.setItem('user',null);
    }
}));



export default useUserStore;

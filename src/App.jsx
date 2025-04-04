
import './App.css'
import Navbar from './components/navbar/navbar'
import Hero from './components/hero/hero'
import About from './components/about/about'
import Faq from './components/faq/Faq'
import ContactUs from './components/contact/contactUs'
import {createBrowserRouter , RouterProvider } from "react-router-dom";
import Premium from "./components/hero/premium";
import Testimonials from './components/testimonials/testimonials'
import Dashboard from './components/dashboard/dashboard'
// import GFG from './gfgprofile/Gfg'
import LoginPage from './components/login/login'
import { RegisterPage } from './components/register/register'
import AdminPanel from './components/adminPage/adminpage'
import Footer from './components/footer/footer'
import { useContext, useEffect } from 'react'
import { GlobalContext } from '.'
import ProtectedRoute from './components/protectedRoute/protectedRoute'
import AddFeedback from './addFeedback/addFeedback'
// import DashboardHeatmap from './components/calendar/calendar'
// import ChartTutorial from './components/charts/chart'
// import TopicBarChart from './components/calendar/calendar'

import Addplatform from './components/Dashboard/addPlatform/addPlatform'

import HiUser from './components/hiPane/hi'
import EditProfile from './components/EditProfile/editProfile'
// import ApexChart from './components/contestChart/contestAreaChart'
// 
import MobileNavbar from './components/navbar/mobileNavbar'
import PostingRandomString from './postingRandomString/postingRandomString'
import AdminRoute from './components/protectedRoute/adminRoute'
const router=createBrowserRouter(
    [
        {
            path:'/',
            element:
            <div>

              <MobileNavbar/>
               <Navbar />
               {/* <ApexChart/> */}
              <HiUser/>
               <Hero/>
               <About/>
               <Testimonials />
               <Faq />
               <ContactUs />
               {/* <Dashboard /> */}
               <Footer />

            </div>
            
        },
        {

          path:'/home',
          element:
          <div>
             {/* <Addplatform/> */}
             <Navbar />
             <HiUser/>
             <Hero/>
             <About/>
             <Testimonials />
             <Faq />
             <ContactUs />
             <Footer />

          </div>
          
      },
      // {
      //   path:'/home/dashboard',
      //   element:<ProtectedRoute/>,
      //   children:[{
      //     path:'',
      //     element:<Addplatform/>
      //   }]
        
      // },
      {

        path:'/about',
        element:
        <div>
           <Navbar />
           <HiUser/>
           <About />
           {/* <Testimonials />
           <Faq />
           <ContactUs /> */}
           <Footer />

        </div>
        
    },{
    path:'/edit-profiles',
    elements:<ProtectedRoute/>,
    children:[{
      path:'',
      element: <div className="">
        <Navbar/>
        <EditProfile/>
        <Footer/>
      </div>

    }]
  
  },
        {
            path:'/premium',
            element:<ProtectedRoute />,
            children:[{
              path:'',
              element:(
              <div>
              <Navbar />
              <HiUser/>
              <Premium/>
              <Footer />
               </div>)
            }]
          
        },
        {
          path:'/faqs',
          element:
          <div>
             <Navbar />
             <Faq />
             {/* <ContactUs /> */}
             <Footer />

          </div>
          
      },
      {
        path:'/contact',
        element:
        <div>
           <Navbar />
           {/* <Faq /> */}
           <ContactUs />
           <Footer />

        </div>
        
    },
    {
      path:'/login',
      element:
      <div>
         <Navbar />
         {/* <Faq /> */}
         <LoginPage/>
         <Footer />

      </div>
      
  },
  {
    path:'/register',
    element:
    <div>
       <Navbar />
       {/* <Faq /> */}
       <RegisterPage/>
       <Footer />

    </div>
    
},
{
  path:'/add-platform',
  element:<ProtectedRoute/>,
  children:[{
    path:'',
    element:  <div>
    <Navbar/>
    <Addplatform/>
    <Footer/>
    </div>
  }]
  
  
},
{
path:'/admin-page',
element:<AdminRoute/>,
children:[{
  path:'',
  element: <div>
      <Navbar />
     {/* <Faq /> */}
     <AdminPanel/>
     <PostingRandomString/>
     <Footer />
  </div>
}]
},
{
   path:'/dashboard',
   element:<ProtectedRoute />,
   children:[
    {
      path:'',
      element:(
        <div>
          <Navbar/>
          <HiUser/>
          <Dashboard/>
          {/* <Dashboard/> */}
          <Footer/>
        </div>
      )
    }
   ]
 },
 {
  path:'/addFeedback',
  element:<ProtectedRoute />,
  children:[
   {
     path:'',
     element:(
       <div>
         <Navbar/>
         <HiUser/>
         <AddFeedback/>
         <Footer/>
       </div>
     )
   }
  ]
},
  
    ]
)

function App() {
  // const navigate=useNavigate();
   const {setAccessToken,setLoggedIn,setUserInfo,userInfo,setLoading}=useContext(GlobalContext);

  //  useEffect(()=>{
  //       handleStringPost();
  //  },[])
   useEffect(()=>{
      
      console.log(userInfo)
   },[userInfo])



const refresh = async () => {
    try {
        console.log("Refreshing token on refresh");
        const res = await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/refresh`, {
            method: "POST",
            credentials: "include",
        });

        const data = await res.json();
        console.log(data);
        console.log(data.userId);

        const userInfoFromSessionStorage=JSON.parse(sessionStorage.getItem('userInfo'));
        console.log("user infot from session on refresh",userInfoFromSessionStorage)
        if(!userInfoFromSessionStorage){
          console.log("userinfor from session",userInfoFromSessionStorage)

            if (res.ok) {
                const userDataResponse = await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/fetchuserdata`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "x-user-id": data?.userId,
                        "Authorization": `Bearer ${data.accessToken}`,
                        "Content-Type": "application/json"
                    }
                });

                if (userDataResponse.ok) {
                    const userData = await userDataResponse.json();
                    console.log(userData)
                    sessionStorage.setItem('userInfo',JSON.stringify(userData));
                    const updatedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
                    setUserInfo(updatedUserInfo);
                    console.log(JSON.parse(userInfoFromSessionStorage))
                    setAccessToken(data.accessToken);
                    setLoggedIn(true);
                    console.log("User Info Updated:", userInfo);
                } else {
                    setUserInfo(null);
                    console.log("error in fetching user info");
                }
            } 
        
            else {
                  setAccessToken(null);
                  setLoggedIn(false);
              }
        } 
        else{
          console.log("userinfor from else",userInfoFromSessionStorage)

          setUserInfo((userInfoFromSessionStorage));
          setAccessToken(data.accessToken);
          setLoggedIn(true);
          console.log('User info updated from session storage')
        }
} catch (e) {
        console.error("Error occurred on refreshing refreshToken", e);
        setAccessToken(null);
        setLoggedIn(false);
    }finally{
      setLoading(false);
    }
};
  
   useEffect(()=>{
      refresh();
      const interval=setInterval(()=>{
      refresh();
      },14*60*1000)

      return ()=>clearInterval(interval);

   },[])
   useEffect(() => {
    console.log("Updated userInfo:", userInfo);
    sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
}, [userInfo]);

  return (

    <>
    <RouterProvider router={router}/>
    
    </>
  )
}

export default App

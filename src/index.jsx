/* eslint-disable react/prop-types */
import { createContext, useState} from "react";
// import leetcode from "../../backend/platform-services/src/models/leetcode";
// import { useGoogleLogin } from '@react-oauth/google';
// import {jwtDecode} from 'jwt-decode';

export const GlobalContext = createContext(null);

const GlobalState = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false); 
    // const [userDetails,setUserDetails]=useState(null);

    const [totalProblemsSolved, setTotalProblemsSolved] = useState(0);
    const [accessToken,setAccessToken]=useState(null);
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [rightPaneLoading, setRightPaneLoading] = useState({})
    const [redirectionPath,setRedirectionPath]=useState('dashboard');
    const [selectedPlatform, setSelectedPlatform] = useState("overall");
    const [sideBar, setSideBar] = useState(false);
    const [platformNameToDisplay,setPlatformNameToDisplay]=useState('Overall Coding Stats')
    const [data,setData]=useState(null);
    const [badges, setBadges] = useState([])
    const [submissionCalendar, setSubmissionCalendar] = useState([])
    const [topicWiseAnalysisData, setTopicWiseAnalysisData] = useState([])
    const [totalQSolved,setTotalQSolved]=useState(null);
    const [totalActiveDays, setTotalActiveDays] = useState(null);
    const [longestStreak, setLongestStreak] = useState(null);
    const [totalSubmission, setTotalSubmission] = useState(null);
    const [currentStreak, setCurrentStreak] = useState(null);
    const [difficultyWiseAnalysis, setDifficultyWiseAnalysis] = useState([]);
    const [languageWiseAnalysis, setlanguageWiseAnalysis] = useState([]);
    const [platformDetailsofUser, setPlatformDetailsofUser] = useState([])
    const [codeforcesContestDetails, setcodeforcesContestDetails] = useState([]);
    const [codechefContestDetails, setcodechefContestDetails] = useState([]);



    const handlePlatformSelection = (name) => {
        setSelectedPlatform(name);
        setPlatformNameToDisplay(name);
    };

    const handleSideBar = () => {
        setSideBar(!sideBar);
    };

    async function fetchSubmissions(activeYears, handle, requestType) {
        const promises = activeYears.map(year =>
            fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/api/gfg-user/submission/${year}/${handle}/${requestType}`)
                .then(res => res.json())
        );
    
        const results = await Promise.all(promises);
        console.log(results);
        return results;
    }

    const postDataToDB=async(platformname,username)=>{

        console.log("fetching data from databse");
        setRightPaneLoading((prev=>({...prev,[platformname]:true})));

        try{

        if(platformname.toLowerCase().trim()==="codeforces"){
            console.log("posting codeforces data to database");

            const codeforcesRes1=await fetch(`https://codeforces.com/api/user.status?handle=${username}`)

           
           if(codeforcesRes1.ok){
            const codeforcesData1=await codeforcesRes1.json();
            console.log((codeforcesData1));

            let totalProblemsSolved=0;
            let totalProblemMap=new Map();
            let totalSubmissions=0;
            let topicWiseMap=new Map();
            let submissionCalendarMap=new Map();
            let languagesMap=new Map();


            const dataToProcess=codeforcesData1?.result;

            function incrementKey(map,key){
                if(!map.has(key)){
                    map.set(key,0);
                }
                map.set(key,map.get(key)+1);
            }

            dataToProcess.map((data)=>{
                const problemName=data?.problem?.name;
                // console.log(problemName);
                totalSubmissions+=1;
                if(data?.verdict==="OK"){
                    const timestamp=data?.creationTimeSeconds;
                    console.log(timestamp)
                    const date=new Date(timestamp*1000).toISOString();
                    console.log(date)
                    incrementKey(submissionCalendarMap,date.split("T")[0]);
                    
                }

                if(data?.verdict==="OK" && !totalProblemMap.has(problemName) ){
                    totalProblemsSolved+=1;
                    totalProblemMap.set(problemName);
                    // console.log(data?.programmingLanguage);
                    let languageName=data?.programmingLanguage;
                    if(languageName.substring(0,3)==="C++"||languageName.substring(0,8)==="GNU C++" ){
                        languageName="C++"
                    }
                    incrementKey(languagesMap,languageName);
                    data?.problem?.tags.map((topic)=>{
                        incrementKey(topicWiseMap,topic);
                    })

                }

            })

            console.log(topicWiseMap)

            // console.log("converting to array",Array.from(topicWiseMap));

             
            let topicWiseQSolved = [];

            const topicWiseArray = Array.from(topicWiseMap);
            
            topicWiseQSolved.push({
                categoryName: "intermediate",
                topics: topicWiseArray.map(mapData => ({
                    topicName: mapData[0],
                    problemCount: mapData[1]
                }))
            });
            
            // console.log(topicWiseQSolved);
            
            console.log("topicWiseQSolved:", topicWiseQSolved);
            console.log("totalProblems",totalProblemsSolved);
            console.log("totalSubmissions",totalSubmissions);
            console.log("langaugeMap",languagesMap);
            console.log("submissionCalendarmap",submissionCalendarMap);
            const languagesSolved=Array.from(languagesMap).map((data)=>{
               
                return({
                    languageName:data[0],
                    problemsSolved:data[1]
                })
            })
            let largestStreak=0;
            let tempStreak=0;
            let prevDate=null;
            console.log("prevDate",prevDate)
            const submissionCalendar=Array.from(submissionCalendarMap).map((data)=>{
                return(
                   { date:data[0],
                     count:data[1]
                    }
                )
            })
            submissionCalendar.forEach((data)=>{
                // console.log(data.date," ",prevDate);

                if(prevDate===null || (Math.abs(new Date(data.date)-new Date(prevDate)))/24*60*60*1000===1){
                    tempStreak+=1;
                }
                else{
                    largestStreak=Math.max(tempStreak,largestStreak);
                    tempStreak=0
                }
                prevDate=data.date;
            })

            console.log("largestStreak",largestStreak)
            

            // console.log("not a map",submissionCalendar)
            const totalActiveDays=submissionCalendar.length;
            console.log("totalActiveDays",totalActiveDays);

            const dataToPost={
                username,
                totalProblemsSolved,
                submissionCalendar,
                topicWiseQSolved,
                languagesSolved,
                totalActiveDays,
                largestStreak

            }

            const postRes=await fetch(`${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/postcodeforcesdata`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    username,
                    codeforcesDetails:dataToPost
                })
            })
            console.log(postRes);

            
            }

            

            const codeforcesRes2=await fetch(`https://codeforces.com/api/user.rating?handle=${username}`)

            if(codeforcesRes2.ok){
                const codeforcesData=await codeforcesRes2.json();
                console.log("codeforces data2",codeforcesData);
                let totalContestParticipated=0;
                

                const contestDetails=codeforcesData?.result.map((data)=>{
                    totalContestParticipated+=1;
                    return (
                        {contestName:data.contestName,rank:data.rank,rating:data.newRating}
                    )
                });

                console.log(contestDetails);
                console.log(totalContestParticipated);
                const dataToPost={
                    contestDetails
                }

                const postRes=await fetch(`${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/postcodeforcesdata`,{
                    method:'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        username,
                        codeforcesDetails:dataToPost
                    })
                })
                console.log(postRes);

            }
            localStorage.removeItem(platformname.toLowerCase());
        }


        
        // fetching leetcode data---------    fetching leetcode data--------- fetching leetcode data---------    fetching leetcode data---------
        if(platformname.toLowerCase()==='leetcode'){
        console.log("posting  leetcode data to databse");
        // const username='iheretocode';
        const res=await fetch(`${import.meta.env.VITE_LEETCODE_SCRAP_URL}/scrape/leetcode?username=${username}`,{
          method:'GET',
          headers:{'Content-Type':'application/json'}
        })

        if(res.ok){
            const response=await res.json();
            console.log(response);
            if(!response?.userPublicProfile?.matchedUser){
                return alert("No user with the username");
            }

            // const platformName=response?.platformName;
            const userLanguageStats = response?.languageStats?.matchedUser?.languageProblemCount || [];
            const QSolved = response?.userProblemsSolved?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
            const topicCategory = response?.skillStats?.matchedUser?.tagProblemCounts || {};
            const badges = response?.userBadges?.matchedUser?.badges || [];
            const userSubmissionCalendar = JSON.parse(response?.userProfileCalendar?.matchedUser?.userCalendar?.submissionCalendar || '{}');
            const largestStreak=response?.userProfileCalendar?.matchedUser?.userCalendar?.streak;
            const username=response?.userPublicProfile?.matchedUser?.username.toLowerCase();
            const totalActiveDays=response?.userProfileCalendar?.matchedUser?.userCalendar?.totalActiveDays;
            // const activeYears=response?.userProfileCalendar?.matchedUser?.userCalendar?.activeYears;
            
            console.log(userLanguageStats);
            const dataToPost={
                username,
                largestStreak,
                languagesSolved:userLanguageStats.map(language => ({
                    languageName: language.languageName,
                    problemsSolved: language.problemsSolved
                })),
                totalQSolved:QSolved.map((data)=>({
                    QCategory:data.difficulty,
                    QCounts:data.count

                })),
                totalProblemsSolved:response?.userProblemsSolved?.matchedUser?.submitStatsGlobal?.acSubmissionNum[0].count,
                topicWiseQSolved: Object.keys(topicCategory).map(category => ({
                    categoryName: category,
                    topics: topicCategory[category].map(data => ({
                        topicName: data.tagName,
                        problemCount: data.problemsSolved
                    }))
                })),
                badges:badges.map((data)=>({
                    badgeLink:data.icon,
                    badgeName:data.displayName,
                    badgeDate: new Date(data.creationDate).toISOString().split('T')[0]
                })),
                submissionCalendar:Object.entries(userSubmissionCalendar).map(([timestamps,count])=>({
                    date:new Date(Number(timestamps)*1000).toISOString().split('T')[0],
                    count
                })),
                totalActiveDays 
            }
            const postRes=await fetch(`${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/postleetcodedata`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    username,
                    leetcodeDetails:dataToPost
                })
            })

            if(postRes.ok){
                sessionStorage.setItem('platformDetails',JSON.stringify({leetcodeDetails:dataToPost}))
                alert('data posted succesfully')

            }
            else{
                alert('trouble occured')
                return;
            }

        }
        else{
            alert('error occured while fetching data from api');
            return
        }
        
       }

    if(platformname.toLowerCase()==='geeksforgeeks'){
            
        console.log("fetching geeksforgeeks data from db");
        try{

        // const username='kdev307';
        const stringId="67e37978e9e70b69e21a4fc4";
        const randomStringRes=await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/string/fetchRandomString/${stringId}`)
        let randomString="";
        
        if(randomStringRes.ok){
            const randomStringData=await randomStringRes.json();
            console.log(randomStringData)
            randomString=randomStringData.data.randomString;
            console.log("randomString",randomString);

        }
        const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/api/gfg-user/${username}/${randomString}`);

        if(res.ok){
        const data=await res.json();
        console.log(data);
        const userRes=data?.pageProps;

        const createdDate=userRes?.userInfo?.created_date;
        const createdYear=new Date(createdDate).getFullYear();
        const currentYear=new Date().getFullYear();

       const activeYears=[];
       const totalYear=currentYear-createdYear;

       for(let i=0;i<totalYear;i++){
            activeYears.push(currentYear-i);
       }
    //    console.log(activeYears)


        const handle=username;
        const requestType='getYearwiseUserSubmissions';
        // const year=2025

        const submissionRes=await fetchSubmissions(activeYears,handle,requestType);
        
        console.log("submission Res",submissionRes);

        const totalActiveDays = submissionRes.reduce((sum, data) => sum + data.count, 0);
        const submissionCalendar = submissionRes.flatMap(data => data.result);

        const calendar=submissionCalendar.flatMap((data)=>Object.entries(data)).slice(0,365);
        console.log(calendar)

        const response={
                username:username,
                largestStreak:data?.pageProps?.userInfo?.pod_solved_longest_streak,
                totalActiveDays,
                submissionCalendar:(calendar).map((data)=>({
                    date:data[0],
                    count:data[1]
                })),
                totalProblemsSolved:data?.pageProps?.userInfo?.total_problems_solved,
                languagesSolved:data?.pageProps?.languages.split(','),
                totalQSolved:Object.entries(data?.pageProps?.userSubmissionsInfo).map(([category,problem])=>({
                    QCategory:category,
                    QCounts:Object.keys(problem).length
                }))
        }

        // console.log("resoonse is",response)
        try{
        const postRes=await fetch(`${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/postgfgdata`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                username,
                GFGDetails:response
            })
        })

        if(postRes.ok){
            sessionStorage.setItem('platformDetails',JSON.stringify({GFGDetails:response}))
            alert('data posted succesfully')

        }
        }catch(e){
            console.log(e)
            alert("error posting gfg data to db");
            setRightPaneLoading((prev=>({...prev,[platformname]:false})));
            return
        }

    }
    else{
        alert("error fetching data from gfg api");
        setRightPaneLoading((prev=>({...prev,[platformname]:false})));
        return
    }

}catch(e){
    console.log(e)
    alert("unknow error occured",e);
    setRightPaneLoading((prev=>({...prev,[platformname]:false})));
    return
}
}
//posting coding ninjas data from api
    if(platformname.toLowerCase().trim()==='coding ninjas'){
        console.log("posting coding ninjas data from api to database");
        try{
            // const username='9av_neet';
            const res = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/api/ninja-user/${username}`);
            if(res.ok){
            const data=await res.json();
            console.log(data);

            const calendar=data.contributionData?.data?.contribution_map;
            // console.log("calendar length:")
            // console.log(calendar)
            // console.log(Object.keys(calendar));
            // console.log(Object.keys(calendar).length);
            const masterLink='https://files.codingninjas.in/sensei-30761.svg';
            const achiverLink='https://files.codingninjas.in/ronin-30759.svg';
            const specialistLink='https://files.codingninjas.in/samurai-30760.svg';
            const badgesHash=data?.data?.data?.dsa_domain_data?.badges_hash;
            
            let badges = [];

            Object.keys(badgesHash).forEach((category) => {
                Object.keys(badgesHash[category]).forEach((type) => {
                    let badgeName = Object.values(badgesHash[category][type]);
                    let badgeLink = "";
                    badgeName.forEach((individualBadgeName)=>{
                        if (category === "achiever") badgeLink = achiverLink;
                        if (category === "master") badgeLink = masterLink;
                        if (category === "specialist") badgeLink = specialistLink;
            
                        badges.push({ badgeName:`${category}-${individualBadgeName}`, badgeLink });
                    })
            
                    
                });
            });
            
            console.log(badges);
            // console.log(badgeName)
            // console.log(collectBadges)

            const dataToPost={
                username,
                totalActiveDays:Object.keys(calendar).length,
                largestStreak:data.contributionData?.data?.longest_streak,
                totalQSolved:data?.data?.data?.dsa_domain_data?.problem_count_data?.difficulty_data.map((data)=>({
                    QCategory:data.level,
                    QCounts:data.count

                })),
                totalProblemsSolved:data?.data?.data?.dsa_domain_data?.problem_count_data?.total_count,
                badges,
                submissionCalendar:Object.keys(calendar || {}).map((keys)=>({
                    date:keys,
                    count:calendar[keys]?.total ||0
                }))
            }
            await fetch(`${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/postcodingninjasdata`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    username,
                    dataToPost
                })
            })

            }  
            
        }
        catch(e){
            console.log('Unknown error occured',e);
            return 
        }


    
}   

    console.log("before updating ",userInfo)
    console.log(userInfo?.userData?.username)
    console.log(userInfo)

    const updateUserRes=await fetch(`${import.meta.env.VITE_IDENTITY_SERVICE_URL}/api/user/updateUserPlatformDetails`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        credentials:"include",
        body:JSON.stringify({
            
            username:userInfo?.userData?.username,
            dataToUpdate:{
                platformname,
                username
            }
        })
        
    })

    const updatedData=await updateUserRes.json();
    console.log(updatedData)
    const userData=updatedData
    if(updateUserRes.ok){
    sessionStorage.setItem('userInfo',JSON.stringify(userData));
    localStorage.removeItem(platformname.toLowerCase());
    setUserInfo(updatedData)
    console.log("user info after updation in index,jsx",userInfo)
    setRightPaneLoading((prev=>({...prev,[platformname]:false})));
}   else{
    alert("some error occured on updating user")
}
    // window.location.reload();
}
catch(e){
    // setRightPaneLoading(true);
    setRightPaneLoading((prev=>({...prev,[platformname]:false})));
    alert("error fetching data from  api",e);
  }
  finally{

    // window.location.reload();

  }



 }

//   fetching data from databse to display on the dashboard
//   fetching data from databse to display on the dashboard
//   fetching data from databse to display on the dashboard
//   fetching data from databse to display on the dashboard

//   fetching data from databse to display on the dashboard
//   fetching data from databse to display on the dashboard

//   fetching data from databse to display on the dashboard



const fetchDataFromDB=async(name,username)=>{
    console.log("fetching data from databse to display on dashboard");
    setRightPaneLoading(true);
    try{
    
   
        if (name === 'overall') {
            let overallBadges = [];
            let overallTotalActiveDays = 0;
            let dateSet = new Set();
            let overallSubmissionCalendar = [];
            let overallTotalProblemsSolved = 0;
            let overallContestDetails = [];
            const userPlatformDetails = userInfo?.userData?.platformDetails;
            let overallDifficultywiseAnalysis = [];
            const allCalendar = [];
            let overallTopicwiseAnalysisData = [];
        
            console.log('platform details');
            console.log(userPlatformDetails);
        
            for (const data of userPlatformDetails) {
                const userUsername = data.platformUsername;
                let userPlatform = data.platformName;
        
                if (userPlatform === 'Coding Ninjas') {
                    userPlatform = 'codingninjas';
                } else if (userPlatform === 'GeeksforGeeks') {
                    userPlatform = 'GFG';
                } else {
                    userPlatform = userPlatform.toLowerCase();
                }
        
                const localStorageData = JSON.parse(localStorage.getItem(userPlatform));
                let urlResData = null;
        
                if (localStorageData !== null) {
                    urlResData = localStorageData;
                } else {
                    try {
                        const url = `${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/fetch${userPlatform}datafromDB/${userUsername}`;
                        const urlRes = await fetch(url, { method: 'GET' });
        
                        if (urlRes.ok) {
                            urlResData = await urlRes.json();
                            localStorage.setItem(userPlatform, JSON.stringify(urlResData));
                        }
                    } catch (e) {
                        console.log('Error occurred on overall fetching');
                        console.log(e);
                    }
                }
        
                if (urlResData) {
                    const fetchedData = urlResData?.data;
        
                    overallBadges = [...overallBadges, ...(fetchedData?.badges || [])];
                    overallTotalActiveDays += fetchedData.totalActiveDays || 0;
                    const calendar = fetchedData?.submissionCalendar || [];
        
                    if (userPlatform === 'codeforces') {
                        setcodeforcesContestDetails(fetchedData?.contestDetails || []);
                    } else if (userPlatform === 'codechef') {
                        setcodechefContestDetails(fetchedData?.contestDetails || []);
                    }
        
                    allCalendar.push(calendar);
        
                    calendar.forEach((data) => {
                        dateSet.add(data.date);
                    });
        
                    overallTopicwiseAnalysisData = [
                        ...overallTopicwiseAnalysisData,
                        ...(fetchedData?.topicWiseQSolved || [])
                    ];
        
                    overallDifficultywiseAnalysis = [
                        ...overallDifficultywiseAnalysis,
                        ...(fetchedData?.totalQSolved || [])
                    ];
        
                    overallTotalProblemsSolved += fetchedData.totalProblemsSolved || 0;
                }
            }
        
            console.log('single', allCalendar);
        
            // Construct overallSubmissionCalendar
            overallSubmissionCalendar = Array.from(dateSet).map((date) => {
                let total = 0;
        
                for (const calendar of allCalendar) {
                    total += calendar
                        .filter((data) => data.date === date)
                        .reduce((sum, data) => sum + data.count, 0);
                }
        
                return { date, count: total };
            });
        
            console.log('overallbadges', overallBadges);
            console.log('overall days', overallTotalActiveDays);
            console.log('overallDifficultywiseAnalysis', overallDifficultywiseAnalysis);
        
            setBadges(overallBadges);
            setTotalActiveDays(overallTotalActiveDays);
            setTotalProblemsSolved(overallTotalProblemsSolved);
            setSubmissionCalendar(overallSubmissionCalendar);
            setTopicWiseAnalysisData(overallTopicwiseAnalysisData);
        
            // Merge difficulty-wise data
            const mergedDifficultywise = overallDifficultywiseAnalysis.reduce((acc, { QCategory, QCounts }) => {
                if (QCategory === 'Moderate') QCategory = 'Medium';
                if (QCategory === 'School' || QCategory === 'Basic') QCategory = 'Easy';
        
                if (!acc[QCategory]) {
                    acc[QCategory] = { QCategory, QCounts };
                } else {
                    acc[QCategory].QCounts += QCounts;
                }
                return acc;
            }, {});
        
            console.log('mergedDifficultywise', mergedDifficultywise);
            setDifficultyWiseAnalysis(Object.values(mergedDifficultywise));
        
            // Sort calendar by date
            overallSubmissionCalendar.sort(
                (a, b) => new Date(a.date) - new Date(b.date)
            );
        
            // Calculate current streak
            let currentStreak = 0;
            const todayStr = new Date().toISOString().split('T')[0];
        
            for (let i = overallSubmissionCalendar.length - 1; i >= 0; i--) {
                const currentDate = overallSubmissionCalendar[i].date;
                const current = new Date(currentDate);
                const next = i < overallSubmissionCalendar.length - 1
                    ? new Date(overallSubmissionCalendar[i + 1].date)
                    : null;
        
                if (
                    (i === overallSubmissionCalendar.length - 1 && currentDate === todayStr) ||
                    (next && (next - current) / (1000 * 60 * 60 * 24) === 1)
                ) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        
            setCurrentStreak(currentStreak);
        }
        


        if (name.toLowerCase() === 'leetcode') {
            const url = `${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/fetchleetcodedatafromDB/${username}`;
            const leetcodeData = JSON.parse(localStorage.getItem(name.toLowerCase()));
            let data;
        
            if (leetcodeData === null) {
                try {
                    const res = await fetch(url, { method: 'GET' });
                    if (res.ok) {
                        data = await res.json();
                        localStorage.setItem(name.toLowerCase(), JSON.stringify(data));
                    } else {
                        console.error("Failed to fetch LeetCode data");
                        return;
                    }
                } catch (e) {
                    console.error("Error fetching LeetCode data", e);
                    return;
                }
            } else {
                data = leetcodeData;
            }
        
            setcodeforcesContestDetails([]);
        
            console.log(data);
        
            setBadges(data?.data?.badges);
        
            // Handle submission calendar
            if (data?.data?.submissionCalendar) {
                const calendarData = data.data.submissionCalendar;
                calendarData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
                let currentStreak = 0;
                for (let i = calendarData.length - 1; i >= 0; i--) {
                    const current = new Date(calendarData[i].date);
                    const next = i < calendarData.length - 1 ? new Date(calendarData[i + 1].date) : null;
        
                    if (i === calendarData.length - 1 || (next && (next - current) / (1000 * 60 * 60 * 24) === 1)) {
                        currentStreak++;
                    } else {
                        break;
                    }
                }
        
                setSubmissionCalendar(calendarData);
                setCurrentStreak(currentStreak);
                setTotalSubmission(calendarData.length);
            } else {
                console.warn("Submission calendar is missing in API response.");
            }
        
            setDifficultyWiseAnalysis(data?.data?.totalQSolved);
            setTotalActiveDays(data?.data?.totalActiveDays);
            setLongestStreak(data?.data?.largestStreak);
            setTopicWiseAnalysisData(data?.data?.topicWiseQSolved);
            setTotalProblemsSolved(data?.data?.totalProblemsSolved);
            setlanguageWiseAnalysis(data?.data?.languagesSolved);
        }
        
    //fetching gfg data from databse
    if (name.toLowerCase() === 'geeksforgeeks') {
        const cacheKey = name.toLowerCase();
        const url = `${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/fetchGFGdatafromDB/${username}`;
    
        let data;
        const gfgData = JSON.parse(localStorage.getItem(cacheKey));
        
        if (!gfgData) {
            const res = await fetch(url, { method: 'GET' });
            if (!res.ok) throw new Error("Failed to fetch GFG data");
            data = await res.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } else {
            data = gfgData;
        }
    
        setcodeforcesContestDetails([]);
        console.log(data);
    
        setBadges(data?.data?.badges);
    
        if (data?.data?.submissionCalendar) {
            const calendarData = data.data.submissionCalendar;
    
            calendarData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            let currentStreak = 0;
            for (let i = calendarData.length - 1; i >= 0; i--) {
                const current = new Date(calendarData[i].date);
                const next = i < calendarData.length - 1 ? new Date(calendarData[i + 1].date) : null;
    
                if (i === calendarData.length - 1 || (next && (next - current) / (1000 * 60 * 60 * 24) === 1)) {
                    currentStreak++;
                } else {
                    break;
                }
            }
    
            setSubmissionCalendar(calendarData);
            setCurrentStreak(currentStreak);
            setTotalSubmission(calendarData.length);
        } else {
            console.warn("Submission calendar is missing in GFG response.");
        }
    
        setTotalActiveDays(data?.data?.totalActiveDays);
        setLongestStreak(data?.data?.largestStreak);
        setTopicWiseAnalysisData(data?.data?.topicWiseQSolved);
        setDifficultyWiseAnalysis(data?.data?.totalQSolved);
        setlanguageWiseAnalysis(data?.data?.languagesSolved);
        setTotalProblemsSolved(data?.data?.totalProblemsSolved);
    }
    
    if (name.toLowerCase().trim() === 'coding ninjas') {
        console.log('Fetching Coding Ninjas data from database...');
        const cacheKey = name.toLowerCase();
        const url = `${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/fetchcodingninjasdatafromDB/${username}`;
    
        let data;
        const ninjasData = JSON.parse(localStorage.getItem(cacheKey));
    
        if (!ninjasData) {
            const res = await fetch(url, { method: 'GET' });
            if (!res.ok) throw new Error("Failed to fetch Coding Ninjas data");
            data = await res.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } else {
            data = ninjasData;
        }
    
        setcodeforcesContestDetails([]);
        console.log(data);
    
        setBadges(data?.data?.badges);
    
        if (data?.data?.submissionCalendar) {
            const calendarData = data.data.submissionCalendar;
    
            calendarData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            let currentStreak = 0;
            for (let i = calendarData.length - 1; i >= 0; i--) {
                const current = new Date(calendarData[i].date);
                const next = i < calendarData.length - 1 ? new Date(calendarData[i + 1].date) : null;
    
                if (i === calendarData.length - 1 || (next && (next - current) / (1000 * 60 * 60 * 24) === 1)) {
                    currentStreak++;
                } else {
                    break;
                }
            }
    
            setSubmissionCalendar(calendarData);
            setCurrentStreak(currentStreak);
    
            const totalSub = calendarData.reduce((total, value) => {
                const count = Number(value.count);
                return total + (isNaN(count) ? 0 : count);
            }, 0);
    
            setTotalSubmission(`${totalSub} submissions Total`);
        } else {
            console.warn("Submission calendar is missing in Coding Ninjas response.");
        }
    
        setTotalActiveDays(data?.data?.totalActiveDays);
        setLongestStreak(data?.data?.largestStreak);
        setTopicWiseAnalysisData(data?.data?.topicWiseQSolved);
        setDifficultyWiseAnalysis(data?.data?.totalQSolved);
        setlanguageWiseAnalysis(data?.data?.languagesSolved);
        setTotalProblemsSolved(data?.data?.totalProblemsSolved);
    }
    
    if (name.toLowerCase() === 'codeforces') {
        const cacheKey = name.toLowerCase();
        const url = `${import.meta.env.VITE_PLATFORM_SERVICES_URL}/api/platform/fetchcodeforcesdatafromDB/${username}`;
    
        let data;
        const cfData = JSON.parse(localStorage.getItem(cacheKey));
    
        if (!cfData) {
            const res = await fetch(url, { method: 'GET' });
            if (!res.ok) throw new Error("Failed to fetch Codeforces data");
            data = await res.json();
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } else {
            data = cfData;
        }
    
        console.log("Codeforces", data);
    
        setBadges(data?.data?.badges);
    
        if (data?.data?.submissionCalendar) {
            const calendarData = data.data.submissionCalendar;
    
            calendarData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            let currentStreak = 0;
            for (let i = calendarData.length - 1; i >= 0; i--) {
                const current = new Date(calendarData[i].date);
                const next = i < calendarData.length - 1 ? new Date(calendarData[i + 1].date) : null;
    
                if (i === calendarData.length - 1 || (next && (next - current) / (1000 * 60 * 60 * 24) === 1)) {
                    currentStreak++;
                } else {
                    break;
                }
            }
    
            setSubmissionCalendar(calendarData);
            setCurrentStreak(currentStreak);
            setTotalSubmission(calendarData.length);
        } else {
            console.warn("Submission calendar is missing in Codeforces response.");
        }
    
        setDifficultyWiseAnalysis(data?.data?.totalQSolved);
        setTotalActiveDays(data?.data?.totalActiveDays);
        setLongestStreak(data?.data?.largestStreak);
        setTopicWiseAnalysisData(data?.data?.topicWiseQSolved);
        setTotalProblemsSolved(data?.data?.totalProblemsSolved);
        setlanguageWiseAnalysis(data?.data?.languagesSolved);
        setcodeforcesContestDetails(data?.data?.contestDetails);
    }
    
    setRightPaneLoading(false)
   
}
catch(e){
    console.log(e)

    // setRightPaneLoading(true);  
    alert("Error occured",e);
}
}

    return (
        <GlobalContext.Provider value={{ loggedIn, setLoggedIn ,loading,setLoading,accessToken,setAccessToken,userInfo,setUserInfo,redirectionPath,setRedirectionPath
            ,selectedPlatform,setSelectedPlatform,sideBar,setSideBar,handleSideBar,handlePlatformSelection,topicWiseAnalysisData,setTopicWiseAnalysisData,
            setSubmissionCalendar,submissionCalendar,postDataToDB,setTotalQSolved,totalQSolved,totalActiveDays,setTotalActiveDays,
            badges,setBadges,longestStreak,setLongestStreak,totalSubmission,setTotalSubmission,currentStreak,setCurrentStreak,
            data,setData,difficultyWiseAnalysis,setDifficultyWiseAnalysis,fetchDataFromDB,rightPaneLoading,setRightPaneLoading,
            setPlatformNameToDisplay,platformNameToDisplay,languageWiseAnalysis,setlanguageWiseAnalysis,platformDetailsofUser,setPlatformDetailsofUser,totalProblemsSolved,
            codeforcesContestDetails,codechefContestDetails
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalState;
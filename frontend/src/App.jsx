import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'
import {Link} from "react-router-dom"
import SignUp from './signup'
import Home from './home'
import Login from './login'
import CreatePost from './createpost'
import ShowPost from './showpost'
import ShowProfile from './showprofile'
import Settings from './settings'
import ShowComment from './showcomment'
import Chat from './chat'
import Messages from "./messages"
import EditPost from './editpost'
import EditComment from './editcomment'
import SearchResults from './searchresults'
import QuotePost from './quotepost'
import EditProfile from './editprofile'
import ShowQuotes from './showquotes'
import ShowNotifications from './notifications'
let backendUrl = ''
if (import.meta.env.VITE_STATE == 'dev'){
  backendUrl = import.meta.env.VITE_DEV_BACKEND_URL
}else{
    backendUrl = import.meta.env.VITE_PROD_BACKEND_URL
}
function RootLayout(){
  const [user, setUser] = useState("")
  const [count, setCount] = useState(0)
  const [update, setUpdate] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [usersWithNewMessages, setUsersWithNewMessages2] = useState([])
  const [notifs, setNotifs] = useState(false)
  const [postsState, setPostsStatea] = useState("discover")
  const inputRef = useRef()
  // alert("pokp")

  useEffect(()=>{
      (
        async () =>{
            const response =  await fetch(`${backendUrl}/user`,{
                method:"GET",
                headers:{"Content-Type":"application/json"},
                credentials:"include"
        })
           
            const contentraw = await response.json()
            const content = contentraw.username
            if (content){
            setUser(contentraw)
            }
            if (content){
            /////////
            const notificationsraw = await fetch(`${backendUrl}/notifications/`+contentraw.id, {
              method:"GET",
              headers: { 'Content-Type': 'application/json' },
            })
            const notifications = await notificationsraw.json()
            const lastNotification = notifications[notifications.length-1]

            let lastseennotifmodel = await fetch(`${backendUrl}/getlastseennotif`, {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userid:contentraw.id
                    })
                })
              lastseennotifmodel = await lastseennotifmodel.json()
              if (lastseennotifmodel.id&&lastNotification){
                  if (lastseennotifmodel.lastseennotificationid!=lastNotification.id){
                  setNotifs(true)
                }
                
              }
            //////////
            //////////

            let rawUsers = await fetch(`${backendUrl}/chatusers/`+contentraw.id, {
                    method:"GET",
                    headers: { 'Content-Type': 'application/json' },
                })
                let users = await rawUsers.json()
                // setChatUsers(users)
                let lista = []
                for (let theuser of users){
                    let lastMessage = await fetch(`${backendUrl}/lastmessage`, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            meid:contentraw.id,
                            otherid:theuser.id
                        })
                    })
                    lastMessage = await lastMessage.json()

                let lastseenmessagemodel = await fetch(`${backendUrl}/getlastseen`, {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fromid:contentraw.id, 
                        toid:theuser.id
                    })
                })
                lastseenmessagemodel = await lastseenmessagemodel.json()

                if (lastseenmessagemodel.fromid){
                    if (lastseenmessagemodel.lastseenmessageid!=lastMessage.id){
                        lista.push(theuser.id)
                    }
                }else{
                    lista.push(theuser.id)
                }
                }
                setUsersWithNewMessages2(lista)
            }
            //////////
            setLoading(false)
        }
      )()
    }, [update])

  function handlesearchChange(value){
    setSearchValue(value)
  }

  function handleRef(){
    inputRef.current.focus()
  }

  if (loading){
    return <h1>Loading...</h1>
  }
  return <div>

        {user&&
        <div>
          <div className="leftside">
            <div className='leftside-content'>
              <div className='logo'>
                <img src="https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:zakx5dchfia5gtcvur5yarpe/bafkreihg35bxlqw5wkdrd7r2as5esvppbdtfwmebsy6rmo5ogronzej7nm@jpeg" alt="" />
              </div>
              <div className='leftside-items'>
                <Link to="/" className='left-item'>
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true">
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M12.63 1.724a1 1 0 0 0-1.26 0l-8 6.5A1 1 0 0 0 3 9v11a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V9a1 1 0 0 0-.37-.776l-8-6.5Z"></path>
                </svg>
                <div>Home</div></Link>
                <div onClick={()=>handleRef()} className='ss left-item' >
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true">
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-8 6a8 8 0 1 1 14.32 4.906l3.387 3.387a1 1 0 0 1-1.414 1.414l-3.387-3.387A8 8 0 0 1 3 11Z"></path>
                </svg>
                <div >Search</div></div>
                <Link className='chat left-item' to="/notifications">
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true">
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M4.216 8.815a7.853 7.853 0 0 1 15.568 0l1.207 9.053A1 1 0 0 1 20 19h-3.354c-.904 1.748-2.607 3-4.646 3-2.039 0-3.742-1.252-4.646-3H4a1 1 0 0 1-.991-1.132l1.207-9.053ZM9.778 19c.61.637 1.399 1 2.222 1s1.613-.363 2.222-1H9.778ZM12 4a5.853 5.853 0 0 0-5.802 5.08L5.142 17h13.716l-1.056-7.92A5.853 5.853 0 0 0 12 4Z"></path>
                </svg>
                <div>Notifications</div> < >{notifs==true&&<div className='red'></div>}</></Link>
                <Link to="/chat" className='chat left-item'>
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true" >
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M4 12a8 8 0 1 1 4.445 7.169 1 1 0 0 0-.629-.088l-3.537.662.7-3.415a1 1 0 0 0-.09-.66A7.961 7.961 0 0 1 4 12Zm8-10C6.477 2 2 6.477 2 12c0 1.523.341 2.968.951 4.262l-.93 4.537a1 1 0 0 0 1.163 1.184l4.68-.876A9.968 9.968 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2ZM7.5 13.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm4.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"></path>
                </svg>
                <div>Chat</div> <>{usersWithNewMessages.length>0&&<div className='red'>{usersWithNewMessages.length}</div>}</></Link>
                <div className='ss left-item'>
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true" >
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M9.124 3.008a1 1 0 0 1 .868 1.116L9.632 7h5.985l.39-3.124a1 1 0 0 1 1.985.248L17.632 7H20a1 1 0 1 1 0 2h-2.617l-.75 6H20a1 1 0 1 1 0 2h-3.617l-.39 3.124a1 1 0 1 1-1.985-.248l.36-2.876H8.382l-.39 3.124a1 1 0 1 1-1.985-.248L6.368 17H4a1 1 0 1 1 0-2h2.617l.75-6H4a1 1 0 1 1 0-2h3.617l.39-3.124a1 1 0 0 1 1.117-.868ZM9.383 9l-.75 6h5.984l.75-6H9.383Z"></path>
                </svg>
                <div>Feeds</div></div>
                <div className='ss left-item'>
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true" >
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M6 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM3 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm9 0a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1Zm-6 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm9 0a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2h-7a1 1 0 0 1-1-1Z"></path>
                </svg>
                <div>Lists</div></div>
                <Link to="/showprofile" state={{user:user}} className='left-item'>
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true" >
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M12 4a8 8 0 0 0-5.935 13.365C7.56 15.895 9.612 15 12 15c2.388 0 4.44.894 5.935 2.365A8 8 0 0 0 12 4Zm4.412 14.675C15.298 17.636 13.792 17 12 17c-1.791 0-3.298.636-4.412 1.675A7.96 7.96 0 0 0 12 20a7.96 7.96 0 0 0 4.412-1.325ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10a9.98 9.98 0 0 1-3.462 7.567A9.965 9.965 0 0 1 12 22a9.965 9.965 0 0 1-6.538-2.433A9.98 9.98 0 0 1 2 12Zm10-4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"></path>
                </svg>
                <div>{user.username}</div></Link>
                <Link to="/settings" className='left-item'>
                <svg fill="none" width="28" viewBox="0 0 24 24" height="28" aria-hidden="true" >
                  <path fill="hsl(211, 28%, 6%)" fill-rule="evenodd" clip-rule="evenodd" d="M11.1 2a1 1 0 0 0-.832.445L8.851 4.57 6.6 4.05a1 1 0 0 0-.932.268l-1.35 1.35a1 1 0 0 0-.267.932l.52 2.251-2.126 1.417A1 1 0 0 0 2 11.1v1.8a1 1 0 0 0 .445.832l2.125 1.417-.52 2.251a1 1 0 0 0 .268.932l1.35 1.35a1 1 0 0 0 .932.267l2.251-.52 1.417 2.126A1 1 0 0 0 11.1 22h1.8a1 1 0 0 0 .832-.445l1.417-2.125 2.251.52a1 1 0 0 0 .932-.268l1.35-1.35a1 1 0 0 0 .267-.932l-.52-2.251 2.126-1.417A1 1 0 0 0 22 12.9v-1.8a1 1 0 0 0-.445-.832L19.43 8.851l.52-2.251a1 1 0 0 0-.268-.932l-1.35-1.35a1 1 0 0 0-.932-.267l-2.251.52-1.417-2.126A1 1 0 0 0 12.9 2h-1.8Zm-.968 4.255L11.635 4h.73l1.503 2.255a1 1 0 0 0 1.057.42l2.385-.551.566.566-.55 2.385a1 1 0 0 0 .42 1.057L20 11.635v.73l-2.255 1.503a1 1 0 0 0-.42 1.057l.551 2.385-.566.566-2.385-.55a1 1 0 0 0-1.057.42L12.365 20h-.73l-1.503-2.255a1 1 0 0 0-1.057-.42l-2.385.551-.566-.566.55-2.385a1 1 0 0 0-.42-1.057L4 12.365v-.73l2.255-1.503a1 1 0 0 0 .42-1.057L6.123 6.69l.566-.566 2.385.55a1 1 0 0 0 1.057-.42ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm4-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"></path>
                </svg>
                <div>Settings</div></Link>
                <div className='addpost left-item'>
                  <Link to="/createpost" className='post-btn'>
                  <svg fill="none" width="16" viewBox="0 0 24 24" height="16" >
                    <path fill="hsl(211, 20%, 100%)" fill-rule="evenodd" clip-rule="evenodd" d="M17.293 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-9 9A1 1 0 0 1 12 16H9a1 1 0 0 1-1-1v-3a1 1 0 0 1 .293-.707l9-9ZM10 12.414V14h1.586l8-8L18 4.414l-8 8ZM3 4a1 1 0 0 1 1-1h7a1 1 0 1 1 0 2H5v14h14v-6a1 1 0 1 1 2 0v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Z"></path>
                  </svg>
                  <span >New Post</span></Link>
                </div>
              </div>
              
            </div>
          </div>
          
          <div className="rightside">
            <div className='rightside-content'>
              <div>
              <div className='search-input'>
                <svg fill="none" viewBox="0 0 24 24" width="20" height="20" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-8 6a8 8 0 1 1 14.32 4.906l3.387 3.387a1 1 0 0 1-1.414 1.414l-3.387-3.387A8 8 0 0 1 3 11Z">
                  </path>
                </svg>
                <input type="text" value={searchValue} onChange={(e)=>handlesearchChange(e.target.value)} ref={inputRef}/>
                <div className='search-btn'>
                    <Link to="/showsearchresults" state={{word:searchValue}}><button>Search</button></Link>
                </div>
              </div>
                {/* <h3></h3>
                <h4></h4>
                <h4></h4> */}
              </div>
              <div>
                <h3 style={{fontSize:"15px"}} className={postsState=="discover"?"discover clicked":"discover"}>Discover</h3>
                <h3 style={{fontSize:"15px"}} className={postsState=="following"?"following clicked":"following"}>Following</h3>
                <h3 style={{fontSize:"15px", color:"blue"}}>More feeds</h3>
              </div>
              <hr />
              <div className='support'>
                <h3>feedback<span>.</span></h3>
                <h3>privacy<span>.</span></h3>
                <h3>terms<span>.</span></h3>
                <h3>help<span>.</span></h3>
              </div>
            </div>
          </div>
        </div>
}
        <Outlet context={[user, setUser, setSearchValue, setUsersWithNewMessages2, setUpdate, setNotifs, setPostsStatea]}/>
      </div>
}


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children:[
      {
        path:"/",
        element:<Home backendUrl={backendUrl}/>
      },
      {
        path:"/signup",
        element:<SignUp backendUrl={backendUrl}/>
      },
      {
        path:"/login",
        element:<Login backendUrl={backendUrl}/>
      },
      {
        path:"/createpost",
        element:<CreatePost backendUrl={backendUrl}/>
      },
      {
        path:"/showpost",
        element:<ShowPost backendUrl={backendUrl}/>
      },
      {
        path:"/showprofile",
        element:<ShowProfile backendUrl={backendUrl}/>
      },
      {
        path:"/showcomment/:id",
        element:<ShowComment backendUrl={backendUrl}/>
      },
      {
        path:"/settings",
        element:<Settings backendUrl={backendUrl}/>
      },
      {
        path:"/chat",
        element:<Chat backendUrl={backendUrl}/>
      },
      {
        path:"/messages",
        element:<Messages backendUrl={backendUrl}/>
      },
      {
        path:"/editpost",
        element:<EditPost backendUrl={backendUrl}/>
      },
      {
        path:"/editcomment",
        element:<EditComment backendUrl={backendUrl}/>
      },
      {
        path:"/showsearchresults",
        element:<SearchResults backendUrl={backendUrl}/>
      },
      {
        path:"/quotepost",
        element:<QuotePost backendUrl={backendUrl}/>
      },
      {
        path:"/editprofile",
        element:<EditProfile backendUrl={backendUrl}/>
      },
      {
        path:"/showquotes",
        element:<ShowQuotes backendUrl={backendUrl}/>
      },
      {
        path:"/notifications",
        element:<ShowNotifications backendUrl={backendUrl}/>
      },
    ] 
  }
])

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}
export default App;

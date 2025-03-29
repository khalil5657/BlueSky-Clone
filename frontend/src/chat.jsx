import { useEffect, useState } from "react"
import { Link, useNavigate, useOutletContext } from "react-router"



function Chat({backendUrl}){
    const [user, setUser, setSearchValue, setUsersWithNewMessages2] = useOutletContext()
    const [chatUsers, setChatUsers] = useState("")
    const [update, setUpdate] = useState("")
    const [loading, setLoading] = useState(true)
    const [usersWithNewMessages, setUsersWithNewMessages] = useState([])
    const navigate = useNavigate()

    useEffect(()=>{
    (
        async () =>{
            if (!user){
                return navigate("/")
            }
            
                let rawUsers = await fetch(`${backendUrl}/chatusers/`+user.id, {
                    method:"GET",
                    headers: { 'Content-Type': 'application/json' },
                })
                let users = await rawUsers.json()
                setChatUsers(users)
                let lista = []
                for (let theuser of users){
                    let lastMessage = await fetch(`${backendUrl}/lastmessage`, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            meid:user.id,
                            otherid:theuser.id
                        })
                    })
                    lastMessage = await lastMessage.json()

                let lastseenmessagemodel = await fetch(`${backendUrl}/getlastseen`, {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fromid:user.id, 
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
                setUsersWithNewMessages(lista)
                // setUsersWithNewMessages2([])
                setLoading(false)
            }
    )()
    }, [update])

    function listIt(user){
        return <Link className="Link chatuser" to="/messages" state={{user:user}}>
                {user.img?<img src={user.img.url} />:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}<h3>{user.username}</h3>{usersWithNewMessages.includes(user.id)&&<span>New messages!!</span>}
            </Link>
    }

    if (loading){
        return <h1 className='loading'>Loading...</h1>
    }
    
    return <div className="content">
            {chatUsers.length>0?chatUsers.map(user=>listIt(user)):<div><h1>Nothing here</h1><p>You have no conversations yet. Start one!</p></div>}
        </div>
}

export default Chat
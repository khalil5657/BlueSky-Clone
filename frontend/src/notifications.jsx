import { useEffect, useState } from "react"
import { useOutletContext } from "react-router"

function ShowNotifications(){
    const [user, setUser, setSearchValue, setUsersWithNewMessages2, setUpdate, setNotifsa] = useOutletContext()
    const [notifs, setNotifs] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        (
            async ()=>{
                //
                const notificationsraw = await fetch("http://localhost:3003/notifications/"+user.id, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
                })
                const notifications = await notificationsraw.json()
                //
                let lastseennotifmodel = await fetch("http://localhost:3003/getlastseennotif", {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userid:user.id
                    })
                })
                lastseennotifmodel = await lastseennotifmodel.json()
                if (lastseennotifmodel.userid){
                    if (notifications.length>0){
                        await fetch("http://localhost:3003/updatelastseennotif", {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            modelid:lastseennotifmodel.id,
                            lastseennotificationid:notifications[notifications.length-1].id
                        })
                    })
                    }
                }else{
                    if (notifications.length>0){
                        await fetch("http://localhost:3003/createlastseennotif", {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userid:user.id,
                            lastseennotificationid:notifications[notifications.length-1].id
                        })
                    })
                    }else{
                        await fetch("http://localhost:3003/createemptylastseennotif", {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userid:user.id
                        })
                    })
                    }
                }
                // setUpdate({})
                let thenotifications = notifications.reverse()
                setNotifs(thenotifications)
                setNotifsa([])
                setLoading(false)
            }
        )()
    })
    function listIt(notif){
        return <div>
            {notif.from.username}//{notif.content}
            </div>
    }
    if (loading){
        return <h1>Loading...</h1>
    }
    return <div className="content">
            {notifs.length>0?notifs.map(notif=>listIt(notif)):"no notifications yet"}
        </div>
}

export default ShowNotifications
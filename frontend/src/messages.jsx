import { useEffect, useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router"
import { useRef } from "react"

function Messages(){
    const [user, setUser] = useOutletContext()
    const {state} = useLocation()
    const [messages, setMessages] = useState("")
    const [update, setUpdate] = useState("")
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState("")
    const [file, setFile] = useState('')
    const messagesEndRef =useRef()

    const navigate = useNavigate()

    useEffect(()=>{
    (
        async () =>{
            if (!user||!state){
                return navigate("/")
            }
            const rawMessages = await fetch("https://bluesky-clone.onrender.com/messages", {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid:user.id,
                    otherid:state.user.id
                })
            })
            
            const messages = await rawMessages.json()
            let lastseenmessagemodel = await fetch("https://bluesky-clone.onrender.com/getlastseen", {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromid:user.id, 
                    toid:state.user.id
                })
            })
            lastseenmessagemodel = await lastseenmessagemodel.json()

            if (lastseenmessagemodel.fromid){
                if (messages.length>0){
                    await fetch("https://bluesky-clone.onrender.com/updatelastseen", {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                            modelid:lastseenmessagemodel.id,
                            lastseenmessageid:messages[messages.length-1].id
                        })
                    })
                }
            }else{
                if (messages.length>0){
                    await fetch("https://bluesky-clone.onrender.com/createlastseen", {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                            fromid:user.id, 
                            toid:state.user.id,
                            lastseenmessageid:messages[messages.length-1].id
                        })
                    })
                }else{
                    await fetch("https://bluesky-clone.onrender.com/createemptylastseen", {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                            fromid:user.id, 
                            toid:state.user.id,
                        })
                    })
                }
                
            }
            setMessages(messages)
            setLoading(false)            
            scrollToBottom()
            }
    )()
    }, [update])
    const scrollToBottom = () => {
        window.requestAnimationFrame(
            function() {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
            });
    }
    function handleFile(file){
        setFile(file)
    }

    function handleMessage(value){
        setText(value)
    }

    async function send(e) {
        e.preventDefault()
        const messageRaw = await fetch("https://bluesky-clone.onrender.com/message/sent", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                    content:text,
                    fromid:user.id,
                    toid:state.user.id
                })
        })
        const message = await messageRaw.json()
        if (file){
            const theFile = file;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`https://bluesky-clone.onrender.com/addmessagefile/`+message.id, {
                method: 'POST',
                body:formData
            })
        }
        // update last seen message
        let lastseenmessagemodel = await fetch("https://bluesky-clone.onrender.com/getlastseen", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromid:user.id, 
                toid:state.user.id
            })
        })
        lastseenmessagemodel = await lastseenmessagemodel.json()
         console.log("hahah", lastseenmessagemodel)
        await fetch("https://bluesky-clone.onrender.com/updatelastseen", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                    modelid:lastseenmessagemodel.id,
                    lastseenmessageid:message.id
                })
        })
        setUpdate({})
        setText("")
        scrollToBottom()

    }

    function listIt(message){
        console.log(message)
        if (message.fromid==user.id){
            return <div className="green">
                    <div>
                        <h4>{message.content}</h4>
                        {message.img&&<img src={message.img.url} />}
                    </div>
                </div>
        }else{
            return <div className="gray">
                    <div>
                        <h4>{message.content}</h4>
                        {message.img&&<img src={message.img.url} />}
                    </div>
                
            </div>
        }
        
    }

    if (loading){
        return <h1>Loading...</h1>
    }
    
    return <div className="content" style={{display:"flex", flexDirection:"column", alignItems:"space-around", marginTop:"0"}}>
            <h2>{state.user.username}</h2>
            <div className="messages">
                {messages.length>0?messages.map((message)=>listIt(message)):<h1>Make the first move!!!</h1>}
                <div ref={messagesEndRef}></div>
            </div>
            <div style={{position:"fixed", bottom:"0", left:"0", right:"0", height:"30px"}} className="messageinput">
                <form onSubmit={send} encType="multipart/form-data">
                    <input type="text" value={text} onChange={(e)=>handleMessage(e.target.value)}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])}/>
                    <button type="submit">send</button>
                </form>
                {/* <input type="text" value={text} onChange={(e)=>handleMessage(e.target.value)}/>
                <button type="submit" onClick={send}>Send</button> */}
            </div>

        </div>
}

export default Messages
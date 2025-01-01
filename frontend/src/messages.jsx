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
            const rawMessages = await fetch("http://localhost:3003/messages", {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid:user.id,
                    otherid:state.user.id
                })
            })
            
            const messages = await rawMessages.json()
            let lastseenmessagemodel = await fetch("http://localhost:3003/getlastseen", {
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
                    await fetch("http://localhost:3003/updatelastseen", {
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
                    await fetch("http://localhost:3003/createlastseen", {
                    method:"POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                            fromid:user.id, 
                            toid:state.user.id,
                            lastseenmessageid:messages[messages.length-1].id
                        })
                    })
                }else{
                    await fetch("http://localhost:3003/createemptylastseen", {
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
        const messageRaw = await fetch("http://localhost:3003/message/sent", {
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
            const raw = await fetch(`http://localhost:3003/addmessagefile/`+message.id, {
                method: 'POST',
                body:formData
            })
        }
        // update last seen message
        let lastseenmessagemodel = await fetch("http://localhost:3003/getlastseen", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromid:user.id, 
                toid:state.user.id
            })
        })
        lastseenmessagemodel = await lastseenmessagemodel.json()
         console.log("hahah", lastseenmessagemodel)
        await fetch("http://localhost:3003/updatelastseen", {
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
    
    return <div className="content">
            <h2>{state.user.username}</h2>
            <div className="messages">
                {messages.length>0?messages.map((message)=>listIt(message)):<h1>Make the first move!!!</h1>}
                <div ref={messagesEndRef}></div>
            </div>
            <div style={{position:"fixed", bottom:"0", left:"0", right:"0", height:"30px", marginLeft:"30%"}}>
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
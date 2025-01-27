import { useEffect, useState } from "react"
import { Link, useLocation, useOutletContext, useNavigate } from "react-router"

function ShowComment({backendUrl}){
    const {state} = useLocation()
     const [loading, setLoading] = useState(true)
     const [user, setUser] = useOutletContext()
    const [comment, setComment] = useState("")
    const [update, setUpdate] = useState("")
    const [addReply, setAddReply] = useState(false)
    const [reply, setReply] = useState("")
    const [post, setPost] = useState("")
    const [repliedTo, setRepliedTo] = useState([])
    const [file, setFile] = useState("")
    const navigate = useNavigate()
    useEffect(()=>{
    (
        async () =>{

            if (!user||!state){
                return navigate("/")
            }
            const rawComment = await fetch(`${backendUrl}/comment/`+state.comment.id, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            })
            
            const comment = await rawComment.json()
                setComment(comment)
                setPost(state.post)

            let arr = []
            async function getRepliedTo(comment){
                
                const repliedtoRaw = await fetch(`${backendUrl}/comment/` + comment.repliedtoid, {
                    method:"GET",
                    headers: { 'Content-Type': 'application/json' },
                })
                const repliedto = await repliedtoRaw.json()

                // setRepliedTo([
                //     ...repliedTo,
                //     repliedto
                // ])
                arr.push(repliedto)
                if (repliedto.repliedtoid){
                    getRepliedTo(repliedto)
                }else{
                    
                    arr.reverse()
                    setRepliedTo(arr)
                }

            }
            if (comment.repliedtoid){
                // setRepliedTo([])
                getRepliedTo(comment)
            }else{
                setRepliedTo([])
            }
            setLoading(false)
            }
    )()
    }, [update, state])

    function listIt(comment){
        return <Link to={`/showcomment/${comment.id}`} state={{comment:comment, post:post}}className="Link" >
                    <div style={{border:"1px solid black", display:"grid", gridTemplateColumns:"40px 1fr"}}>
                        {comment.writer.img?<img style={{height:"40px", width:"40px", borderRadius:"20px"}} src={comment.writer.img.url} />:<img style={{height:"40px"}} src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                        <div className="comment-img">
                            <h3 style={{marginTop:"0px", marginBottom:"4px"}}>{comment.writer.username}</h3>
                            <p>{comment.content}</p>
                            {comment.img&&<img src={comment.img.url} alt="" />}

                        </div>
                        <em>replies:{comment.replies.length}</em>
                    </div>
                </Link>

        // return <Link to={`/showcomment/${comment.id}`} state={{comment:comment, post:post}} >
        //         <h4>{comment.writer.username}</h4>
        //         <p>{comment.content}</p>
        //         <em>replies: {comment.replies.length}</em>
        //     </Link>
    }
    async function submitComment(e) {
        e.preventDefault()
        const replyRaw = await fetch(`${backendUrl}/comment/reply`, {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content:reply,
                writerid:user.id,
                repliedtoid:comment.id,
                postid:comment.postid
            })
        })
        const commenta = await replyRaw.json()
        if (file){
            const theFile = file;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${backendUrl}/addcommentfile/`+commenta.id, {
                method: 'POST',
                body:formData
            })
        }
        


        setUpdate({})
    }
    function chnangeReplyState(){
        if (addReply ==  true){
            setAddReply(false)
        }else{
            setAddReply(true)
        }
    }
    function changeReplyValue(value){
        setReply(value)
    }

    function handleFile(file){
        setFile(file)
    }
    
    async function deleteIt(e, comment) {
        e.preventDefault()
        await fetch(`${backendUrl}/comment/`+comment.id, {
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
        })
        navigate("/showpost", {state:{post:post}})
    }


    if (loading){
        return <h1>Loading...</h1>
    }
    
    return <div className="post">

    
            <div className="post" >
                <div className="post-writer">
                    {post.writer.img?<img src={post.writer.img.url}/>:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                    <h2>{post.writer.username}</h2>
                </div>
                <p>{post.content}</p>
                {post.img.length==4&&<div className="four-images">
                    <img src={post.img[0].url}/>
                    <img src={post.img[1].url}/>
                    <img src={post.img[2].url}/>
                    <img src={post.img[3].url}/>
                </div>
                }
                {post.img.length==3&&<div className="three-images">
                    <img src={post.img[0].url}/>
                    <img src={post.img[1].url}/>
                    <img src={post.img[2].url}/>
                </div>}
                {post.img.length==2&&<div className="two-images">
                    <img src={post.img[0].url}/>
                    <img src={post.img[1].url}/>
                </div>}
                {post.img.length==1&&<div className="one-image">
                    <img src={post.img[0].url}/>
                </div>}

            </div>
            {/* {repliedTo.map(comment=><div style={{border:"1px solid black", display:"grid", gridTemplateColumns:"40px 1fr"}}>{comment.writer.img?<img style={{height:"40px", width:"40px", borderRadius:"20px"}} src={comment.writer.img.url} />:<img style={{height:"40px"}} src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}<div><h3 style={{marginTop:"0px", marginBottom:"4px"}}>{comment.writer.username}</h3><p>{comment.content}</p></div><em>Replies: {comment.replies.length}</em></div>)}////////////// */}
            {repliedTo.map((comment)=>listIt(comment))}
            <div >
            {/* {comment.repliedto&&getRepliedTo(comment)} */}
                <div style={{display:"grid", gridTemplateColumns:"50px 1fr"}} className="comment">
                    {comment.writer.img?<img style={{height:"50px", width:"50px",  borderRadius:"25px"}} src={comment.writer.img.url} />:<img style={{height:"50px", width:"50px", borderRadius:"25px"}} src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                    <div className="comment-img">
                        <h2>{comment.writer.username}</h2>
                        {comment.content=="this comment has been deleted"?<p style={{color:"gray"}}>{comment.content}</p>:<p>{comment.content}</p>}
                        {comment.img&&<img src={comment.img.url} alt="" />}

                    </div>
                    <em>replies: {comment.replies.length}</em>
                    {comment.writer.id==user.id&&<button style={{maxWidth:"max-content", maxHeight:"max-content"}} onClick={(e)=>deleteIt(e, comment)}>Delete</button>}
                    {comment.writer.id==user.id&&<Link to="/editcomment" state={{comment:comment}}>Edit</Link>}


                </div>
                
                {/* <button onClick={chnangeReplyState}>Add Reply</button> */}

                <form onSubmit={submitComment} encType="multipart/form-data">
                    <input value={reply} onChange={(e)=>changeReplyValue(e.target.value)}/>
                    <label htmlFor="">add file</label>
                    <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])}/>
                    <button type="submit">Reply</button>
                </form>

                </div>
                {comment.replies.length>0&&comment.replies.map((comment)=>listIt(comment))}
                
        </div>
}

export default ShowComment
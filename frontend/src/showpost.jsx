import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useOutletContext } from "react-router"

function ShowPost(){
    const {state} = useLocation()
    const [user, setUser] = useOutletContext()
    const navigate = useNavigate()
    const [commentInput, setCommentInput] = useState(false)
    const [commentValue, setCommentValue]= useState("")
    const [post, setPost] = useState("")
    const [update, setUpdate] = useState("")
    const [loading, setLoading] =useState(true)
    const [file, setFile] = useState("")
    const [usersWhoLiked, setUsersWhoLiked] = useState([])
    const [usersWhoLikedState, setUsersWhoLikedState] = useState(false)
    const [usersWhoRetweeted, setUsersWhoRetweeted] = useState([])
    const [usersWhoRetweetedState, setUsersWhoRetweetedState] = useState(false)
    const [postRetweets, setPostRetweets] = useState([])

    useEffect(()=>{
        
    (
        async () =>{
            if (!state||!user){
                return navigate("/")
            }
            const rawPost = await fetch("https://bluesky-clone.onrender.com/post/"+state.post.id, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            })
            let post = await rawPost.json()
                // setPost(post)
                setLoading(false)

                // const comments = post.comments.filter(function(comment){
                //         return comment.repliedtoid.length == 0
                // })
                // post.comments = comments
                let arr = []
                for (let ret of post.retweets){
                    arr.push(ret.id)
                }
                setPostRetweets(arr)
                setPost(post)
            }
    )()
    }, [update, state])

    async function removeRetweet(e, post){
        e.preventDefault()
        await fetch("https://bluesky-clone.onrender.com/removeretweet", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postid:post.id,
                userid:user.id
            })
        })
        setUpdate({})

    }

    async function addRetweet(e, post){
        e.preventDefault()
        await fetch("https://bluesky-clone.onrender.com/addretweet", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postid:post.id,
                userid:user.id
            })
        })
                setUpdate({})

    }

    async function showLikes(likesArray){
        let users = []
        for (let userid of likesArray){
            const userraw = await fetch("https://bluesky-clone.onrender.com/user/"+userid, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            })
            const user = await userraw.json()
            users.push(user)
        }
        if (usersWhoLikedState==false){
            setUsersWhoRetweetedState(false)
            setUsersWhoLikedState(true)
        }else{
            setUsersWhoLikedState(false)
        }
        setUsersWhoLiked(users)

    }
    async function showRetweets(retweetsArray){
        let users = []
        for (let obj of retweetsArray){
            const userraw = await fetch("https://bluesky-clone.onrender.com/user/"+obj.id, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            })
            const user = await userraw.json()
            users.push(user)
        }
        if (usersWhoRetweetedState==false){
            setUsersWhoLikedState(false)
            setUsersWhoRetweetedState(true)
        }else{
            setUsersWhoRetweetedState(false)
        }
        setUsersWhoRetweeted(users)
    }

    async function  addComment(e) {
        e.preventDefault()
        const commentRaw  = await fetch("https://bluesky-clone.onrender.com/post/comment", {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content:commentValue,
                postid:post.id,
                writerid:user.id
            })
        })
        const comment = await commentRaw.json()
        if (file){
            const theFile = file;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`https://bluesky-clone.onrender.com/addcommentfile/`+comment.id, {
                method: 'POST',
                body:formData
            })
        }
        

        setUpdate({})
        setCommentValue("")
    }

    async function handleLike(e, post){
        e.preventDefault()
        if (post.likes.includes(user.id)){
            let rawPosts = await fetch("https://bluesky-clone.onrender.com/post/unlike/"+post.id, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId:user.id
                        })
                        })
            let posts = await rawPosts.json()
        }else{
            let rawPosts = await fetch("https://bluesky-clone.onrender.com/post/like/"+ post.id, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId:user.id
                        })
                        })
            let posts = await rawPosts.json()
        }
        
        setUpdate({})
    }
    
    function changeCommentInput(){
        if (commentInput==true){
            setCommentInput(false)
        }else{
            setCommentInput(true)
        }
    }

    function listComment(comment){
        if (!comment.repliedtoid){
            return <Link className="Link comment" to={`/showcomment/${comment.id}`} state={{comment:comment, post:post}}>
                <div className="comment-writer-img">
                    {comment.writer.img?<img src={comment.writer.img.url} />:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                </div>
                <div className="comment-writer-content comment-img">
                    <h3>{comment.writer.username}</h3>
                    <p>{comment.content}</p>
                    {comment.img&&<img src={comment.img.url} alt="" />}
                    {comment.replies.length}
                </div>
            </Link>
        }
        
    }

    async function deleteIt(e, post) {
        e.preventDefault()
        await fetch("https://bluesky-clone.onrender.com/post/"+post.id, {
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
        })
        setUpdate({})
    }

    function handleFile(file){
        setFile(file)
    }
    function getQuote(post){
        return <div className="home-post" key={post.id}>
                        <Link className="Link home-post-writer" to="/showprofile" state={{user:post.writer}}>
                            {post.writer.img?<img className="home-post-img" src={post.writer.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                            {post.writer.id==user.id&&<span style={{color:"blue"}}>You</span>}<h4>{post.writer.username}</h4>

                        </Link>
                        <Link to="/showpost" state={{post:post}} className="Link home-post-content">
                            <div>
                            
                            </div>
                            <div>
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
                                </div>
                                }
                                {post.img.length==2&&<div className="two-images">
                                <img src={post.img[0].url}/>
                                <img src={post.img[1].url}/>
                                    </div>}
                                    {post.img.length==1&&<div className="one-image">
                                        <img src={post.img[0].url}/>
                                    </div>}
                            </div>
                            
                            
                        </Link>
                    </div>
    }
    function listUser(user){
        return <div>
            <h4>{user.username}</h4>
            </div>
    }
    if (loading){
        return <h1>Loading..</h1>
    }
    let commentsLength = 0
    for (let i=0;i<post.comments.length;i++){
            if (!post.comments[i].repliedtoid){
                commentsLength++
            }
    }
    return <div className="post" >
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
            {post.quotespostid&&getQuote(post.quotespost)}
            
            <h4 onClick={()=>showRetweets(post.retweets)}>Retweets:{post.retweets.length}</h4>
            <Link to="/showquotes" state={{post:post}}>Quotes {post.quotedby.length}</Link>
            <h4 onClick={()=>showLikes(post.likes)}>likes:{post.likes.length}</h4>
            
            <h4>Comments: {commentsLength}</h4>
            <Link to="/quotepost" state={{post:post}}>Add Quote</Link>
            {post.likes.includes(user.id)?<button onClick={(e)=>handleLike(e, post)}>Unlike</button>:<button onClick={(e)=>handleLike(e, post)}>Like</button>}
            {postRetweets.includes(user.id)?<button onClick={(e)=>removeRetweet(e, post)}>Remove Retweet</button>:<button onClick={(e)=>addRetweet(e, post)}>Retweet</button>}
            {post.writer.id==user.id&&<Link to="/editpost" state={{post:post}}>Edit</Link>}
            {post.writer.id==user.id&&<button onClick={(e)=>deleteIt(e, post)}>Delete</button>}
            <button onClick={changeCommentInput}>Add a comment</button>
            <br />{commentInput==true&&<form onSubmit={addComment} encType="multipart/form-data"><input value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}/>
            <label htmlFor="">add file</label>
             <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])}/>
                <button type="submit">comment</button></form>}
            {post.comments.length>0?post.comments.map(comment=>listComment(comment)):<h4>No comments here</h4>}
            {usersWhoLikedState&&<div className="likes">Likes:{usersWhoLiked.map(user=>listUser(user))}</div>}
            {usersWhoRetweetedState&&<div className="likes">Retweets:{usersWhoRetweeted.map(user=>listUser(user))}</div>}
            </div>
}

export default ShowPost
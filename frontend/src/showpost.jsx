import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useOutletContext } from "react-router"

function ShowPost({backendUrl}){
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
    const [retweetAndquote, setRetweetAndQuote] = useState('')
    const [more, setMore] = useState('')

    const [postRetweets, setPostRetweets] = useState([])

    useEffect(()=>{
        
    (
        async () =>{
            if (!state||!user){
                return navigate("/")
            }
            const rawPost = await fetch(`${backendUrl}/post/`+state.post.id, {
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

    function showMore(post){
        if (more==post.id){
            setMore('')
        }else{
            setMore(post.id)
        }
    }

    function showRetweetsAndQuotes(post){
        if (retweetAndquote==post.id){
            setRetweetAndQuote('')
        }else{
            setRetweetAndQuote(post.id)
        }
    }
    async function showRetweets(retweetsArray){
        let users = []
        for (let obj of retweetsArray){
            const userraw = await fetch(`${backendUrl}/user/`+obj.id, {
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

    async function showLikes(likesArray) {
        let users = []
        for (let userid of likesArray){
            const userraw = await fetch(`${backendUrl}/user/`+userid, {
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

    async function removeRetweet(e, post){
        e.preventDefault()
        await fetch(`${backendUrl}/removeretweet`, {
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
        await fetch(`${backendUrl}/addretweet`, {
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
            const userraw = await fetch(`${backendUrl}/user/`+userid, {
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
            const userraw = await fetch(`${backendUrl}/user/`+obj.id, {
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
        const commentRaw  = await fetch(`${backendUrl}/post/comment`, {
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
            const raw = await fetch(`${backendUrl}/addcommentfile/`+comment.id, {
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
            let rawPosts = await fetch(`${backendUrl}/post/unlike/`+post.id, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId:user.id
                        })
                        })
            let posts = await rawPosts.json()
        }else{
            let rawPosts = await fetch(`${backendUrl}/post/like/`+ post.id, {
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
                    <span style={{color:"gray"}}>{comment.replies.length} Replies</span>
                </div>
            </Link>
        }
        
    }

    async function deleteIt(e, post) {
        e.preventDefault()
        await fetch(`${backendUrl}/post/`+post.id, {
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
        return <h1 className='loading'>Loading..</h1>
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
            

            <div className="interact">
                        <h4>
                            <svg fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                                </path>
                            </svg>
                        {commentsLength}
                        </h4>
                        <h4 className="retweet">
                        <svg onClick={()=>showRetweetsAndQuotes(post)} fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill={postRetweets.includes(user.id)?"lime":"hsl(211, 20%, 53%)"} fill-rule="evenodd" clip-rule="evenodd" d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z">
                            </path>
                        </svg>
                        
                        {post.retweets.length}
                        {/* postRetweets.includes(user.id) */}
                        {retweetAndquote==post.id&&<div className="retweetAndquote"><button onClick={(e)=>{postRetweets.includes(user.id)?removeRetweet(e, post):addRetweet(e, post)}}>{postRetweets.includes(user.id)?"Remove retweet":"Retweet"}</button><Link to="/quotepost" state={{post:post}} className="addquote">Add Quote</Link></div>}
                        </h4>
                        <h4 >
                        {!post.likes.includes(user.id)?
                                <div onClick={(e)=>handleLike(e, post)}>
                                    <svg fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z">
                                        </path>
                                    </svg>
                                </div>
                                :
                                <div onClick={(e)=>handleLike(e, post)}>
                                    <svg fill="none" width="18" viewBox="0 0 24 24" height="18" class="r-84gixx"><path fill="#ec4899" fill-rule="evenodd" clip-rule="evenodd" d="M12.489 21.372c8.528-4.78 10.626-10.47 9.022-14.47-.779-1.941-2.414-3.333-4.342-3.763-1.697-.378-3.552.003-5.169 1.287-1.617-1.284-3.472-1.665-5.17-1.287-1.927.43-3.562 1.822-4.34 3.764-1.605 4 .493 9.69 9.021 14.47a1 1 0 0 0 .978 0Z">
                                        </path>
                                    </svg>
                                </div>
                                }
                        {post.likes.length}
                        </h4>
                        <h4 className="more">
                            <svg onClick={()=>showMore(post)} fill="none" viewBox="0 0 24 24" width="20" height="20"><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z">
                                </path>
                            </svg>
                            {more==post.id&&
                                        <div className="showmore">
                                            {post.writer.id==user.id&&
                                                <button onClick={(e)=>deleteIt(e, post)}>Delete</button>}
                                            {post.writer.id==user.id&&
                                                <Link to="/editPost" state={{post:post}} className="addquote">Edit</Link>}
                                            <Link to="/showquotes" state={{post:post}} className="addquote">Quotes</Link>
                                            <div onClick={()=>showRetweets(post.retweets)}>Retweets</div>
                                            <div onClick={()=>showLikes(post.likes)}>Likes</div>
                                        </div>
                            }
                        </h4>
                    </div>

            {usersWhoLikedState&&<div className="likes">Likes:{usersWhoLiked.map(user=>listUser(user))}</div>}
            {usersWhoRetweetedState&&<div className="likes">Retweets:{usersWhoRetweeted.map(user=>listUser(user))}</div>}



            {post.quotespostid&&getQuote(post.quotespost)}
            
            {/* <h4 onClick={()=>showRetweets(post.retweets)}>Retweets:{post.retweets.length}</h4>
            <Link to="/showquotes" state={{post:post}}>Quotes {post.quotedby.length}</Link>
            <h4 onClick={()=>showLikes(post.likes)}>likes:{post.likes.length}</h4> */}
            
            <h4>Comments: {commentsLength}</h4>
            {/* <Link to="/quotepost" state={{post:post}}>Add Quote</Link> */}
            {/* {post.likes.includes(user.id)?<button onClick={(e)=>handleLike(e, post)}>Unlike</button>:<button onClick={(e)=>handleLike(e, post)}>Like</button>} */}
            {/* {postRetweets.includes(user.id)?<button onClick={(e)=>removeRetweet(e, post)}>Remove Retweet</button>:<button onClick={(e)=>addRetweet(e, post)}>Retweet</button>} */}
            {/* {post.writer.id==user.id&&<Link to="/editpost" state={{post:post}}>Edit</Link>}
            {post.writer.id==user.id&&<button onClick={(e)=>deleteIt(e, post)}>Delete</button>} */}
            <button onClick={changeCommentInput}>Add a comment</button>
            <br />{commentInput==true&&
                        <form onSubmit={addComment} encType="multipart/form-data" className="add-comments">
                            <input value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}/><br></br>
                            <label htmlFor="">add file</label>
                            <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])}/>
                            <br />
                            <button type="submit">comment</button>
                        </form>}
            {post.comments.length>0?post.comments.map(comment=>listComment(comment)):<h4>No comments here</h4>}
            {usersWhoLikedState&&<div className="likes">Likes:{usersWhoLiked.map(user=>listUser(user))}</div>}
            {usersWhoRetweetedState&&<div className="likes">Retweets:{usersWhoRetweeted.map(user=>listUser(user))}</div>}
            </div>
}

export default ShowPost
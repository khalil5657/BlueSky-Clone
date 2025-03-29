import { useEffect, useState } from "react"
import { useLocation, Link, useOutletContext, useNavigate } from "react-router"

function ShowProfile({backendUrl}){
    const [usera, setUsera] = useOutletContext()
    const {state} = useLocation()
    const [posts, setPosts] = useState("")
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState("")
    const [user, setUser] = useState("")
    const [usersWhoLiked, setUsersWhoLiked] = useState([])
    const [usersWhoLikedState, setUsersWhoLikedState] = useState(false)
    const [usersWhoRetweeted, setUsersWhoRetweeted] = useState([])
    const [usersWhoRetweetedState, setUsersWhoRetweetedState] = useState(false)
    const [retweetAndquote, setRetweetAndQuote] = useState('')
    const [more, setMore] = useState('')
    const navigate = useNavigate()
    // useEffect(()=>{
    //     if (!state){
    //         return navigate("/")
    //     }
    // }, [])
    useEffect(()=>{
        
    (
        async () =>{
            if (!state){
            return navigate("/")
            }
            const rawPosts = await fetch(`${backendUrl}/posts/profile/`+state.user.id, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            })
            const postsa = await rawPosts.json()
            let posts = postsa.posts
            

            const rawUser = await fetch(`${backendUrl}/user/`+state.user.id, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },

            })
            const user = await rawUser.json()
            setUser(user)

            // get all posts
            const rawPosts2 = await fetch(`${backendUrl}/posts/profile/retweets/`+state.user.id, {
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            })
            const posts2 = await rawPosts2.json()
            let arr1 = posts2.posts
            let retPosts = []
            /// filter posts that this profile reteeted
            for (let post of arr1){
                if (post.retweets.length>0){
                    for (let item of post.retweets){
                        if (item.id==state.user.id&&post.writer.id!=state.user.id){
                            retPosts.push(post)
                        }
                    }
                }
            }
            ////-/////

            //concat all posts
            posts = posts.concat(retPosts)
            let lista = []

            for (let post of posts){
                if (post.retweets.length>0){
                    let date = ''
                    for (let item of post.retweets){
                        if (item.id == state.user.id){
                            date = Date.parse(item.date)
                        }
                    }
                    let obj = {id:post.id, date:date}
                    lista.push(obj)

                }else{
                    let obj = {id:post.id, date:Date.parse(post.posteddate)}
                    lista.push(obj)
                }
            }

            lista.sort((a, b)=>{
                if (a.date>b.date){
                    return -1
                }
                if (b.date>a.date){
                    return 1
                }
                return 0
            })
            let final = []
            for (let postid of lista){
                const rawPost =  await fetch(`${backendUrl}/post/`+postid.id, {
                    method:"GET",
                    headers: { 'Content-Type': 'application/json' },
                })
                const post = await rawPost.json()
                final.push(post)
            }
            ////-//////
            setPosts(final)
            setLoading(false)
            }
    )()
    }, [update, state])


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

    async function deleteIt(e, post) {
        e.preventDefault()
        await fetch(`${backendUrl}/post/`+post.id, {
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
        })
        setUpdate({})
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
    function listUser(user){
        return <div>
            <h4>{user.username}</h4>
            </div>
    }
    
    function showRetweetsAndQuotes(post){
        if (retweetAndquote==post.id){
            setRetweetAndQuote('')
        }else{
            setRetweetAndQuote(post.id)
        }
    }
    function showMore(post){
        if (more==post.id){
            setMore('')
        }else{
            setMore(post.id)
        }
    }
    function listIt(post){
        let commentsLength = 0
        for (let i=0;i<post.comments.length;i++){
                if (!post.comments[i].repliedtoid){
                    commentsLength++
                }
        }
        for (let item of post.retweets){
            if (item.id==state.user.id){
                return <div className="home-post" key={post.id}>
                         <p style={{color:"gray"}}>{state.user.username} Retweeted</p>
                        <Link className="Link home-post-writer" to="/showprofile" state={{user:post.writer}}>
                            {post.writer.img?<img className="home-post-img" src={post.writer.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                            <h4>{post.writer.username}</h4>

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
                                 {post.quotespostid&&getQuote(post.quotespost)}

                                {/* {post.likes.includes(usera.id)?<button onClick={(e)=>handleLike(e, post)}>Unlike</button>:<button onClick={(e)=>handleLike(e, post)}>Like</button>}
                                {post.writer.id==usera.id&&<Link to="/editpost" state={{post:post}}>Edit</Link>}
                                {post.writer.id==usera.id&&<button onClick={(e)=>deleteIt(e, post)}>Delete</button>}
                                <button onClick={(e)=>removeRetweet(e, post)}>Remove Retweet</button> */}
                            </div>
                            
                        
                        </Link>
                    <div className="interact">
                        <h4>
                            <svg fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                                </path>
                            </svg>
                        {commentsLength}</h4>
                        <h4 className="retweet">
                        <svg onClick={()=>showRetweetsAndQuotes(post)} fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(152, 82%, 42%)" fill-rule="evenodd" clip-rule="evenodd" d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z">
                            </path>
                        </svg>
                        
                        {post.retweets.length}
                        {retweetAndquote==post.id&&<div className="retweetAndquote"><button onClick={(e)=>removeRetweet(e, post)}>Remove Retweet</button><Link to="/quotepost" state={{post:post}} className="addquote">Add Quote</Link></div>}
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
                    
                    </div>
            }
        }
        return <div className="home-post" key={post.id}>
                <Link className="Link home-post-writer" to="/showprofile" state={{user:post.writer}}>
                    {post.writer.img?<img className="home-post-img" src={post.writer.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                    <h4>{post.writer.username}</h4>

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
                        {post.quotespostid&&getQuote(post.quotespost)}


                        {/* {post.likes.includes(usera.id)?<button onClick={(e)=>handleLike(e, post)}>Unlike</button>:<button onClick={(e)=>handleLike(e, post)}>Like</button>}
                        {post.writer.id==usera.id&&<Link to="/editpost" state={{post:post}}>Edit</Link>}
                        {post.writer.id==usera.id&&<button onClick={(e)=>deleteIt(e, post)}>Delete</button>}
                        <button onClick={(e)=>addRetweet(e,post)} >Retweet</button> */}

                    </div>
                    
                    
                </Link>
                <div className="interact">
                        <h4>
                            <svg fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                                </path>
                            </svg>
                        {commentsLength}
                        </h4>
                        <h4 className="retweet">
                        <svg onClick={()=>showRetweetsAndQuotes(post)} fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z">
                            </path>
                        </svg>
                        
                        {post.retweets.length}
                        {retweetAndquote==post.id&&<div className="retweetAndquote"><button onClick={(e)=>addRetweet(e, post)}>Retweet</button><Link to="/quotepost" state={{post:post}} className="addquote">Add Quote</Link></div>}
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
               
            </div>
    }

    async function handleLike(e, post){
        e.preventDefault()
        // setLoading(true)
        if (post.likes.includes(usera.id)){
            let rawPosts = await fetch(`${backendUrl}/post/unlike/`+post.id, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId:usera.id
                        })
                        })
            let posts = await rawPosts.json()
        }else{
            let rawPosts = await fetch(`${backendUrl}/post/like/`+ post.id, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId:usera.id
                        })
                        })
            let posts = await rawPosts.json()
        }
        
        setUpdate({})
        // setLoading(false)
    }

    async function handleFollow(e){
        e.preventDefault()
        // setLoading(true)
        if (user.followers.includes(usera.id)){
            await fetch(`${backendUrl}/unfollow`, {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                        userid:usera.id,
                        followedid:user.id
                })
            })
        }else{
            await fetch(`${backendUrl}/follow`, {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                        userid:usera.id,
                        followedid:user.id
                })
            })
        }
        setUpdate({})
        // setLoading(false)
    }

    if (loading){
        return <h1 className='loading'>Loading...</h1>
    }
    return <div className="profile">
                <div className="profile-info">
                    <div className="banner">
                        {user.bannerimg?<img src={user.bannerimg.url} />:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" alt="" />}
                    </div>
                    <div className="pic-info">
                        <div className="img-follow">
                            {user.img?<img src={user.img.url} />:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                            {user.id== usera.id?'':user.followers.includes(usera.id)?
                                <div>
                                    <Link to="/messages" state={{user:user}}>Message</Link>
                                    <button onClick={(e)=>handleFollow(e)}>UnFollow</button>
                                </div>:
                                <div>
                                    <Link to="/messages" state={{user:user}}>Message</Link>
                                    <button onClick={(e)=>handleFollow(e)}>Follow</button>
                                </div>}
                        </div>
                        <h1>{user.username}</h1>
                        {usera.id==user.id&&<Link to="/editprofile">Edit Profile</Link>}
                        <p><b>Followers: </b>{user.followers.length} <b>Following: </b>{user.following.length} <b>Posts: </b>{user.posts.length}</p>
                        {user.bio&&<p style={{wordWrap:"break-word"}}>{user.bio}</p>}
                    </div>
                </div>
                <div className="posts">
                    <h3><em style={{color:"gray"}}>Posts:</em></h3>
                    {posts.length>0?posts.map(post=>listIt(post)):<h3>No posts yet</h3>}
                    {usersWhoLikedState&&<div className="likes">Likes:{usersWhoLiked.map(user=>listUser(user))}</div>}
                    {usersWhoRetweetedState&&<div className="likes">Retweets:{usersWhoRetweeted.map(user=>listUser(user))}</div>}
                </div>
            </div>
}

export default ShowProfile
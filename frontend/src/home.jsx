import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { useOutletContext } from "react-router"
function Home(){
    const [user, setUser, setSearchValue, setUsersWithNewMessages2, setUpdatea, setNotifs, setPostsStatea] = useOutletContext()
    const [discoverPosts, setDiscoverPosts] = useState('')
    const [followingPosts, setFollowingPosts] = useState('')
    const [postsState, setPostsState] = useState('discover')
    const [loading, setLoading] = useState(true)
    const [update, setUpdate] = useState('')
    const navigate = useNavigate()
    const [followingIds, setFollowingIds] = useState([])
    const [usersWhoLiked, setUsersWhoLiked] = useState([])
    const [usersWhoLikedState, setUsersWhoLikedState] = useState(false)
    const [usersWhoRetweeted, setUsersWhoRetweeted] = useState([])
    const [usersWhoRetweetedState, setUsersWhoRetweetedState] = useState(false)
    const [retweetAndquote, setRetweetAndQuote] = useState('')
    const [more, setMore] = useState('')


    
    useEffect(()=>{
        
    (
        async () =>{

                const usersRaw = await fetch("http://localhost:3003/users/"+user.id, {
                    method:"GET",
                    headers: { 'Content-Type': 'application/json' },

                })
                const users = await usersRaw.json()
                let following = []
                for (let user of users){
                    let obj = {id:user.id, username:user.username}
                    following.push(obj)
                }
                console.log(following, 'okok')
                setFollowingIds(following)
                let rawDPosts = await fetch("http://localhost:3003/posts", {
                        method:"GET",
                        headers: { 'Content-Type': 'application/json' },
                        })
                    let dposts = await rawDPosts.json()
                    function sortIt(a, b){
                        if (a.likes.length > b.likes.length){
                            return -1
                        }else if (b.likes.length > a.likes.length){
                            return 1
                        }else{
                            return 0
                        }
                    }
                    dposts.posts.sort(sortIt)
                    if (dposts.posts){
                        setDiscoverPosts(dposts.posts)
                    }
                    console.log(dposts.posts, 'plpplplplplp')
                let rawFPosts = await fetch("http://localhost:3003/posts/"+user.id, {
                        method:"GET",
                        headers: { 'Content-Type': 'application/json' },
                        })
                    let fposts = await rawFPosts.json()
                    console.log(fposts, 'pp')
                    if (fposts.posts){

                        // setFollowingPosts(fposts.posts)

                    }
                    ////
                    let othersRaw = await fetch("http://localhost:3003/posts/ret", {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                            { userid:user.id }
                            )

                    })
                    let othersA = await othersRaw.json()
                    let aa = []
                    // posts that written by people i dont follow
                    for (let post of othersA){
                        if (!post.writer.followers.includes(user.id)){
                            aa.push(post)
                        }
                    }
                    let others = []
                    for (let post of aa){
                        if (post.retweets.length>0){
                            for (let retweet of post.retweets){
                                if (retweet.id==user.id){
                                    others.push(post)
                                }
                            }
                        }
                    }
                    console.log(others, 'hahhahhah')
                    let lista1 = fposts.posts
                    lista1 = lista1.concat(others)
                    let newLista = []
                    console.log("lo", lista1)
                    for (let post of lista1){
                        if (post.retweets.length==0){
                            let obj = {id:post.id, date:Date.parse(post.posteddate)}
                            newLista.push(obj)
                        }else{
                            let state = true 
                            for (let retweet of post.retweets){
                                if (retweet.id==user.id){
                                    let obj = {id:post.id, date:Date.parse(retweet.date)}
                                    newLista.push(obj)
                                    state = false
                                }
                            }
                            if (state == true){
                                for (let item of post.retweets){
                                    for (let user of following){
                                        if (user.id==item.id){
                                            let obj = {id:post.id, date:Date.parse(item.date)}
                                            newLista.push(obj)
                                        }
                                    }
                                }
                            }
                            
                        }
                    }
                    newLista.sort((a, b)=>{
                        if(a.date>b.date){
                            return -1
                        }
                        if (b.date>a.date){
                            return 1
                        }
                        return 0
                    })
                    let final = []
                    for (let postid of newLista){
                        const rawPost =  await fetch("http://localhost:3003/post/"+postid.id, {
                            method:"GET",
                            headers: { 'Content-Type': 'application/json' },
                        })
                        const post = await rawPost.json()
                        final.push(post)
                    }
                    setFollowingPosts(final)
            setLoading(false)
            }
    )()
    }, [update])

    async function deleteIt(e, post) {
        e.preventDefault()
        await fetch("http://localhost:3003/post/"+post.id, {
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
        })
        setUpdate({})
    }

    async function handleLike(e, post){
        e.preventDefault()
        if (post.likes.includes(user.id)){
            let rawPosts = await fetch("http://localhost:3003/post/unlike/"+post.id, {
                        method:"POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId:user.id
                        })
                        })
            let posts = await rawPosts.json()
        }else{
            let rawPosts = await fetch("http://localhost:3003/post/like/"+ post.id, {
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
    
    async function removeRetweet(e, post){
        e.preventDefault()
        await fetch("http://localhost:3003/removeretweet", {
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
        await fetch("http://localhost:3003/addretweet", {
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
                            </div>
                            
                            
                        </Link>
                    </div>
    }
    async function showLikes(likesArray){
        let users = []
        for (let userid of likesArray){
            const userraw = await fetch("http://localhost:3003/user/"+userid, {
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
            const userraw = await fetch("http://localhost:3003/user/"+obj.id, {
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
        // let lista = []
        // if (post.quotedby.length>0){
        //     for (let quote of post.quotedby){
        //         lista.push(quote.writer.id)
        //     }
        // }
        let commentsLength = 0
        for (let i=0;i<post.comments.length;i++){
                if (!post.comments[i].repliedtoid){
                    commentsLength++
                }
        }
        for (let item of post.retweets){
            if (item.id==user.id){
                return <div className="home-post" key={post.id}>
                        <p style={{color:"gray"}}>You Retweeted</p>
                        <Link className="Link home-post-writer" to="/showprofile" state={{user:post.writer}}>
                            {post.writer.img?<img className="home-post-img" src={post.writer.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                            <h4>{post.writer.username}</h4>

                        </Link>
                        <Link to="/showpost" state={{post:post}} className="Link home-post-content">
                            <div>
                            
                            </div>
                            <div>
                                <p style={{overflowWrap:"break-word"}}>{post.content}</p>
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

                                {/* <h4 onClick={()=>showLikes(post.likes)}>likes:{post.likes.length}</h4><h4>Comments: {commentsLength}</h4> */}

                                {/* {post.likes.includes(user.id)?<button onClick={(e)=>handleLike(e, post)}>Unlike</button>:<button onClick={(e)=>handleLike(e, post)}>Like</button>} */}
                                
                                {/* <button >Remove retweet</button> */}
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
                        {/* onClick={()=>showLikes(post.likes)} */}

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
                        {post.likes.length}</h4>
                       <h4 className="more">
                        <svg onClick={()=>showMore(post)} fill="none" viewBox="0 0 24 24" width="20" height="20"><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z">
                            </path>
                        </svg>
                        {more==post.id&&
                                    <div className="showmore" style={{overflow:"hidden"}}>
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
                        

                        {/* <Link to="/quotepost" state={{post:post}}>Add Quote</Link> */}
                    </div>
            }
        }
        for (let item of post.retweets){
            for (let user of followingIds){
                if (user.id==item.id){
                    return <div className="home-post" key={post.id}>
                        <p style={{color:"gray"}}>{user.username} Retweeted</p>
                        <Link className="Link home-post-writer" to="/showprofile" state={{user:post.writer}}>
                            {post.writer.img?<img className="home-post-img" src={post.writer.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                            <h4>{post.writer.username}</h4>

                        </Link>
                        <Link to="/showpost" state={{post:post}} className="Link home-post-content">
                            <div>
                            
                            </div>
                            <div>
                                <p style={{overflowWrap:"break-word"}}>{post.content}</p>
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

                                {/* <h4 onClick={()=>showLikes(post.likes)}>likes:{post.likes.length}</h4><h4>Comments: {commentsLength}</h4> */}


                                

                            </div>
                            
                            
                        </Link>
                        <div className="interact">
                    
                        <h4>
                         <svg fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                            </path>
                        </svg>
                         {commentsLength}</h4>
                              {/* {post.quotespostid&&getQuote(post.quotespost)} */}
                           <h4  className="retweet">
                            <svg onClick={()=>showRetweetsAndQuotes(post)} fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z">
                                </path>
                            </svg>{post.retweets.length}
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
                        {post.likes.length}</h4>
                        <h4 className="more">
                        <svg onClick={()=>showMore(post)} fill="none" viewBox="0 0 24 24" width="20" height="20"><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z">
                            </path>
                        </svg>
                        {more==post.id&&
                                    <div className="showmore" style={{overflow:"hidden"}}>
                                        {post.writer.id==user.id&&
                                            <button onClick={(e)=>deleteIt(e, post)}>Delete</button>}
                                        {post.writer.id==user.id&&
                                            <Link to="/editPost" state={{post:post}} className="addquote">Edit</Link>}
                                        <Link to="/showquotes" state={{post:post}} className="addquote">Quotes </Link>
                                        <div onClick={()=>showRetweets(post.retweets)}>Retweets</div>
                                        <div onClick={()=>showLikes(post.likes)}>Likes</div>
                                    </div>
                        }
                        </h4>
                        </div>
                        
                        {/* <Link to="/quotepost" state={{post:post}}>Add Quote</Link> */}
                    
                    </div>
                }
            }
            // if (followingIds.includes(item.id)){
                // const userRaw = await fetch("http://localhost:3003/user/"+item.id, {
                //     method:"GET",
                //     headers: { 'Content-Type': 'application/json' },

                // })
                // const user = await userRaw.json()
                
            // }
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
                        <p style={{overflowWrap:"break-word"}}>{post.content}</p>
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


                  
                        {/* <button onClick={(e)=>addRetweet(e, post)}>Retweet</button> */}
                    </div>
                    
                    
                </Link>
                <div className="interact">
                    <h4>
                        <svg fill="none" width="18" viewBox="0 0 24 24" height="18" ><path fill="hsl(211, 20%, 53%)" fill-rule="evenodd" clip-rule="evenodd" d="M2.002 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H12.28l-4.762 2.858A1 1 0 0 1 6.002 21v-2h-1a3 3 0 0 1-3-3V6Zm3-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v1.234l3.486-2.092a1 1 0 0 1 .514-.142h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-14Z">
                            </path>
                        </svg>
                    {commentsLength}</h4>
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
                                    <div className="showmore" style={{overflow:"hidden"}}>
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
                    
                {/* <Link to="/quotepost" state={{post:post}}>Add Quote</Link> */}

            </div>
    }


    function listUser(user){
        return <div>
            <h4>{user.username}</h4>
            </div>
    }
    function handlePostsState(thestate){
        setPostsState(thestate)
        setPostsStatea(thestate)
    }
    if (loading){
        return <h1>Loading...</h1>
    }
    let posts = []
    if (postsState=='discover'&&discoverPosts.length>0){
        posts = discoverPosts
    }else if (postsState == 'following'&& followingPosts.length>0){
        posts = followingPosts
    }
    return <div>
          <nav>
            {/* <div className="home-nav"> */}
                <div className="home-logo">
                    <svg fill="none" viewBox="0 0 64 57" width="28">
                        <path fill="#0085ff" d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z">
                        </path>
                    </svg>
                </div>
              
              <div className='nav-buttons'>
                <button onClick={()=>handlePostsState("discover")} className={postsState=="discover"?"cur":undefined}>Discover</button>
                <button onClick={()=>handlePostsState("following")} className={postsState=="following"?"cur":undefined}>Following</button>
              </div>
            {/* </div> */}
          </nav>
            <div className="content">
            {!user?<div>
               <h1>Dont have an Account?</h1>
               <Link to="/signup">Sign Up</Link>
               <h1>Already have an account?</h1>
               <Link to="/login">Log In</Link>
            </div>:
            posts.length==0?<h3>No posts yet</h3>:<div>  {posts.map(post=>listIt(post))}{usersWhoLikedState&&<div className="likes">Likes:{usersWhoLiked.map(user=>listUser(user))}</div>}{usersWhoRetweetedState&&<div className="likes">Retweets:{usersWhoRetweeted.map(user=>listUser(user))}</div>}</div>
            }
        </div>
        </div>
        
}
export default Home
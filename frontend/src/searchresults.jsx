import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useOutletContext } from "react-router"

function SearchResults(){
    const [profiles, setProfiles] = useState('')
    const [posts, setPosts] = useState("")
    const [loading, setLoading] = useState(true)
    const [user, setUser, setSearchValue] = useOutletContext()
    const {state} = useLocation()
    const navigate = useNavigate()
    const [resultsState, setResultsState] = useState("posts")

    useEffect(()=>{
        (
            async ()=>{
                if (!user||!state){
                    return navigate("/")
                }
                const rawData = await fetch("https://bluesky-clone.onrender.com/search/"+state.word, {
                    method:"GET",
                    headers: { 'Content-Type': 'application/json' },

                })
                const data = await rawData.json()
                setProfiles(data.profiles)
                setPosts(data.posts)
                // setSearchValue("")
                setLoading(false)
            }
        )()
    })

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

    function listIt(item){
        if (item.content){
            //
            let commentsLength = 0
            for (let i=0;i<item.comments.length;i++){
                    if (!item.comments[i].repliedtoid){
                        commentsLength++
                    }
            }
            return <div className="home-post" key={item.id}>
                <Link className="Link home-post-writer" to="/showprofile" state={{user:item.writer}}>
                    {item.writer.img?<img className="home-post-img" src={item.writer.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                    {item.writer.id==user.id&&<span style={{color:"blue"}}>You</span>}<h4>{item.writer.username}</h4>

                </Link>
                <Link to="/showpost" state={{post:item}} className="Link home-post-content">
                    <div>
                    
                    </div>
                    <div>
                        <p>{item.content}</p>
                            {item.img.length==4&&<div className="four-images">
                        <img src={item.img[0].url}/>
                        <img src={item.img[1].url}/>
                        <img src={item.img[2].url}/>
                        <img src={item.img[3].url}/>
                            </div>
                        }
                        {item.img.length==3&&<div className="three-images">
                        <img src={item.img[0].url}/>
                        <img src={item.img[1].url}/>
                        <img src={item.img[2].url}/>
                        </div>
                        }
                        {item.img.length==2&&<div className="two-images">
                        <img src={item.img[0].url}/>
                        <img src={item.img[1].url}/>
                            </div>}
                            {item.img.length==1&&<div className="one-image">
                                <img src={item.img[0].url}/>
                            </div>}
                        {item.quotespostid&&getQuote(item.quotespost)}
                        <h4>likes:{item.likes.length}</h4><h4>Comments: {commentsLength}</h4>

                        {item.likes.includes(user.id)?<button onClick={(e)=>handleLike(e, item)}>Unlike</button>:<button onClick={(e)=>handleLike(e, item)}>Like</button>}
                        {item.writer.id==user.id&&<button onClick={(e)=>deleteIt(e, item)}>Delete</button>}
                        {item.writer.id==user.id&&<Link to="/editPost" state={{post:item}}>Edit</Link>}
                    </div>
                    
                    
                </Link>
                
            </div>
            //
            // return <div style={{border:"1px solid black"}}>

            //     <p>{item.content}</p>
            //     </div>
        }
        return <div>
                <Link className="Link home-post-writer" to="/showprofile" state={{user:item}}>
                    {item.img?<img className="home-post-img" src={item.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                    <h4>{item.id==user.id&&<span style={{color:"blue", fontSize:"14px"}}>You </span>} {item.username}</h4>

                </Link>
                </div>
        
        
        //  <div style={{border:"1px solid black"}}>
        //         <h3>{item.username}</h3>
        //     </div>
    }

    async function deleteIt(e, post) {
        e.preventDefault()
        await fetch("https://bluesky-clone.onrender.com/post/"+post.id, {
            method:"DELETE",
            headers: { 'Content-Type': 'application/json' },
        })
        setUpdate({})
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
    let results = posts
    if (resultsState=="profiles"){
        results = profiles
    }
    if (loading){
        return <h1>Loading...</h1>
    }
    return <div className="content">
    <div>
        <button onClick={()=>setResultsState("posts")}>Show Posts</button>
        <button onClick={()=>setResultsState("profiles")}>Show Profiles</button>
    </div>
    {resultsState=="posts"?<h2>Posts:</h2>:<h2>Profiles</h2>}
    {results.length>0?results.map(item=>listIt(item)):resultsState=="posts"?<h3>No posts with that word</h3>:<h3>No profiles with that word</h3>}
    {/* <h2>Posts:</h2> */}
    {/* {posts.length>0?posts.map(post=>listIt(post)):<h3>no posts with that word</h3>} */}
    {/* <h2>Profiles</h2> */}
    {/* {profils.length>0?profils.map(profile=>listIt(profile)):<h3>no profiles with that word</h3>} */}
    </div>
}

export default SearchResults
import { useEffect, useState } from "react"
import { Link, useLocation, useOutletContext } from "react-router"

function ShowQuotes({backendUrl}){
    const [user, setUser] = useOutletContext()
    const {state } = useLocation()
    const [quotes, setQuotes] = useState("")
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        (
            async ()=>{
                // const postraw = await fetch("http://localhost:3003/post/"+state.post.id, {
                //     method:"GET",
                //     headers: { 'Content-Type': 'application/json' },

                // })
                // const post = await postraw.json()

                setQuotes(state.post.quotedby)
                setLoading(false)
            }
        )()
    }, [])

    function getQuote(){
        return <div className="home-post" key={state.post.id}>
                        <Link className="Link home-post-writer" to="/showprofile" state={{user:state.post.writer}}>
                            {state.post.writer.img?<img className="home-post-img" src={state.post.writer.img.url} />:<img className="home-post-img" src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg" />}
                            {state.post.writer.id==user.id&&<span style={{color:"blue"}}>You</span>}<h4>{state.post.writer.username}</h4>

                        </Link>
                        <Link to="/showpost" state={{post:state.post}} className="Link home-post-content">
                            <div>
                            
                            </div>
                            <div>
                                <p>{state.post.content}</p>
                                    {state.post.img.length==4&&<div className="four-images">
                                <img src={state.post.img[0].url}/>
                                <img src={state.post.img[1].url}/>
                                <img src={state.post.img[2].url}/>
                                <img src={state.post.img[3].url}/>
                                    </div>
                                }
                                {state.post.img.length==3&&<div className="three-images">
                                <img src={state.post.img[0].url}/>
                                <img src={state.post.img[1].url}/>
                                <img src={state.post.img[2].url}/>
                                </div>
                                }
                                {state.post.img.length==2&&<div className="two-images">
                                <img src={state.post.img[0].url}/>
                                <img src={state.post.img[1].url}/>
                                    </div>}
                                    {state.post.img.length==1&&<div className="one-image">
                                        <img src={state.post.img[0].url}/>
                                    </div>}
                            </div>
                            
                            
                        </Link>
                    </div>
    }

    function listIt(post){
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
                                {post.quotespostid&&getQuote()}
                            </div>
                            
                            
                        </Link>

                    </div>
    }
    if (loading){
        return <h1 className='loading'>Loading...</h1>
    }
    return <div className="content">
            <h2>Quotes:</h2>
            {quotes.length>0?quotes.map(post=>listIt(post)):<h4>No Quotes here--Yet</h4>}
        </div>
}
export default ShowQuotes
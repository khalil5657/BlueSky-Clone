import { useEffect, useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router"

function EditPost({backendUrl}){
    const [user, setUser] = useOutletContext()
    const navigate = useNavigate()
    const {state} = useLocation()
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        (async ()=>{
            if (!user||!state){
                return navigate("/")
            }
        setLoading(false)
        })()
        
    }, [])
    // const [text, setText] = useState(state?state.post?state.post.content:'')
    const [text, setText] = useState(state?state.post.content:'')
    const [post, setPost]  = useState(state?state.post:'')

    // const [file1, setFile1] = useState(post?post.img[0]?post.img[0]:'')
    const [file1, setFile1] = useState(post?post.img[0]:'')
    // const [file2, setFile2] = useState(post?post.img[1]?post.img[1]:'')
    const [file2, setFile2] = useState(post?post.img[1]:'')
    const [file3, setFile3] = useState(post?post.img[2]:'')
    const [file4, setFile4] = useState(post?post.img[3]:'')
    const [numOfImg, setNumOfImg] = useState(post&&post.img.length)


    

    async function handleFile1(file) {
        setFile1(file)
    }
    async function handleFile2(file) {
        setFile2(file)
    }
    async function handleFile3(file) {
        setFile3(file)
    }
    async function handleFile4(file) {
        setFile4(file)
    }
    function changeText(value){
        setText(value)
    }

    async function postIt(e) {
        e.preventDefault()
        let theFile1 = file1
        let theFile2 = file2
        let theFile3 = file3
        let theFile4 = file4
        

        if (file1){
            if (!file1.url){
                const theFile = file1;
                const formData = new FormData();
                formData.append('image', theFile);
                const raw = await fetch(`${backendUrl}/editpostfile/`+post.id, {
                method: 'POST',
                body:formData
                })
                const newFile = await raw.json()
                setFile1(newFile)
                theFile1 = newFile
                await fetch(`${backendUrl}/postimg/`+newFile.id, {
                    method:"DELETE",
                    headers: { 'Content-Type': 'application/json' },
                })
            }
        }

        if (file2){
            if (!file2.url){
                const theFile = file2;
                const formData = new FormData();
                formData.append('image', theFile);
                const raw = await fetch(`${backendUrl}/editpostfile/`+post.id, {
                method: 'POST',
                body:formData
                })
                const newFile = await raw.json()
                setFile2(newFile)
                theFile2 = newFile
                await fetch(`${backendUrl}/postimg/`+newFile.id, {
                    method:"DELETE",
                    headers: { 'Content-Type': 'application/json' },
                })
            }

        }

        if (file3){
            if (!file3.url){
                const theFile = file3;
                const formData = new FormData();
                formData.append('image', theFile);
                const raw = await fetch(`${backendUrl}/editpostfile/`+post.id, {
                method: 'POST',
                body:formData
                })
                const newFile = await raw.json()
                setFile3(newFile)
                theFile3 = newFile
                await fetch(`${backendUrl}/postimg/`+newFile.id, {
                    method:"DELETE",
                    headers: { 'Content-Type': 'application/json' },
                })
            }

        }

        if (file4){
            if (!file4.url){
                const theFile = file4;
                const formData = new FormData();
                formData.append('image', theFile);
                const raw = await fetch(`${backendUrl}/editpostfile/`+post.id, {
                method: 'POST',
                body:formData
                })
                const newFile = await raw.json()
                setFile4(newFile)
                theFile4 = newFile
                await fetch(`${backendUrl}/postimg/`+newFile.id, {
                    method:"DELETE",
                    headers: { 'Content-Type': 'application/json' },
                })
            }

        }

        await fetch(`${backendUrl}/editpost`, {
            method:"POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                postid:post.id,
                num:numOfImg,
                files:[theFile1, theFile2, theFile3, theFile4]
            })
        })
    } 

    if (loading){
        return <h1 className='loading'>Loading...</h1>
    }

    return <div className="content">
            <form action="" onSubmit={postIt} encType="multipart/form-data">
                <label htmlFor="">Write whats in your mind..</label>
                <textarea name="" id="" placeholder="Whats Up" onChange={(e)=>changeText(e.target.value)} value={text}></textarea>

                {post.img.length==4&&<div className="four-images">
                    <img src={file1.url}/>
                    <img src={file2.url}/>
                    <img src={file3.url}/>
                    <img src={file4.url}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile1(e.target.files[0])} />
                    <input type="file" name="picture" onChange={(e)=>handleFile2(e.target.files[0])}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile3(e.target.files[0])}/>  
                    <input type="file" name="picture" onChange={(e)=>handleFile4(e.target.files[0])}/>

                </div>
                }
                {post.img.length==3&&<div className="three-images">
                    <img src={file1.url}/>
                    <img src={file2.url}/>
                    <img src={file3.url}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile1(e.target.files[0])}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile2(e.target.files[0])}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile3(e.target.files[0])}/>
                </div>}
                {post.img.length==2&&<div className="two-images">
                    <img src={file1.url}/>
                    <img src={file2.url}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile1(e.target.files[0])}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile2(e.target.files[0])}/>

                </div>}
                {post.img.length==1&&<div className="one-image">
                    <img src={file1.url}/>
                    <input type="file" name="picture" onChange={(e)=>handleFile1(e.target.files[0])}/>
                </div>}

                

                <button type="submit">Post</button>
            </form>
        </div>
}

export default EditPost
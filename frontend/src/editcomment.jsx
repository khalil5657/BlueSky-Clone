import { use } from "react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router"

function EditComment({backendUrl}){
    const [user, setUser] = useOutletContext()
    const {state} = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState(state?state.comment.content:'')
    const [file, setFile] = useState(state?state.comment.img:'')

    useEffect(()=>{
        (
            async ()=>{
                if (!state||!user){
                    return navigate("/")
                }
                setLoading(false)
            }
        )()
    }, [])

    function handleComment(value){
        setComment(value)
    }

    function handleFile(file){
        setFile(file)
    }

    async function sendComment(e){
            e.preventDefault()
            let theFile1 = file
            if (file){
                if (!file.url){
                    console.log('kokok',state.comment)
                    ///
                    await fetch(`${backendUrl}/commentimg/`+state.comment.img.id, {
                        method:"DELETE",
                        headers: { 'Content-Type': 'application/json' },

                    })
                    ///
                    const theFile = file;
                    const formData = new FormData();
                    formData.append('image', theFile);
                    console.log(formData)
                    const raw = await fetch(`${backendUrl}/editcommentfile/`+state.comment.id, {
                    method: 'POST',
                    body:formData
                    })
                    const newFile = await raw.json()
                    theFile1 = newFile
                    // await fetch("http://localhost:3003/commentimg/"+newFile.id, {
                    //     method:"DELETE",
                    //     headers: { 'Content-Type': 'application/json' },

                    // })

                }
            }
            await fetch(`${backendUrl}/editcomment/`+state.comment.id, {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content:comment,
                })
            })
    }
    if (loading){
        return <h1>Loading...</h1>
    }
    return <div className="content">
            <form action="" onSubmit={sendComment} encType="multipart/form-data">
                <label htmlFor="">Comment:</label>
                <input type="text" value={comment} onChange={(e)=>handleComment(e.target.value)}/>
                {file.url&&<img src={file.url}/>}
                <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])}/>
                <button type="submit">Send</button>
            </form>
        </div>
}


export default EditComment
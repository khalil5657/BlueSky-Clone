import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"


function CreatePost({backendUrl}){
    const [user, setUser] = useOutletContext()
    const [text, setText] = useState("")
    const [file1, setFile1] = useState("")
    const [file2, setFile2] = useState("")
    const [file3, setFile3] = useState("")
    const [file4, setFile4] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        ( async ()=>{
            if (!user){
                return navigate("/")
            }
        }
        )()
    }, [])

    async function post(e) {
        e.preventDefault()

        const rawPost = await fetch(`${backendUrl}/addpost`, {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                id:user.id
            })
        })
        const post = await rawPost.json()
        if (file1){
            const theFile = file1;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${backendUrl}/addpostfile/`+post.id, {
            method: 'POST',
            body:formData
        })
        }

        if (file2){
            const theFile = file2;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${backendUrl}/addpostfile/`+post.id, {
            method: 'POST',
            body:formData
        })
        }

        if (file3){
            const theFile = file3;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${backendUrl}/addpostfile/`+post.id, {
            method: 'POST',
            body:formData
        })
        }

        if (file4){
            const theFile = file4;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${backendUrl}/addpostfile/`+post.id, {
            method: 'POST',
            body:formData
        })
        }
        return navigate("/")
    }

    function handleFile1(file){
        setFile1(file)
    }
    function handleFile2(file){
        setFile2(file)
    }
    function handleFile3(file){
        setFile3(file)
    }
    function handleFile4(file){
        setFile4(file)
    }
    function changeText(value){
        setText(value)
    }
    return <div className="content">
            <form action="" onSubmit={post} encType="multipart/form-data">
                <label htmlFor="">Write whats in your mind..</label>
                <textarea name="" id="" placeholder="Whats Up" onChange={(e)=>changeText(e.target.value)} value={text}></textarea>
                <input type="file" name="picture" onChange={(e)=>handleFile1(e.target.files[0])}/>
                <input type="file" name="picture" onChange={(e)=>handleFile2(e.target.files[0])}/>
                <input type="file" name="picture" onChange={(e)=>handleFile3(e.target.files[0])}/>
                <input type="file" name="picture" onChange={(e)=>handleFile4(e.target.files[0])}/>

                <button type="submit">Post</button>
            </form>
        </div>
}


export default CreatePost
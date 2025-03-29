import { useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router"
function SignUp({backendUrl}){
    const [user, setUser] = useOutletContext()
    const [file, setFile] = useState("")
    const [bannerFile, setBannerFile] = useState("")
        const [bio, setBio] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
        const [usera, setUsera] = useState("")
    const navigate = useNavigate()
    useEffect(()=>{
        ( async ()=>{
            if (user){
                return navigate("/")
            }
        }
        )()
    }, [])
    

    function changeUsername(value){
        setUsername(value)
    }

    function changePassword(value){
        setPassword(value)
    }

    function handleFile(file){
        setFile(file)
    }
    function handleBannerFile(file){
        setBannerFile(file)
    }
    function handleBio(value){
        setBio(value)
    }
    async function signUp(e){
        e.preventDefault()

        const res = await fetch(`${backendUrl}/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username,
                password,
                bio:bio
              })
        })
        const data = await res.json()

        // if (!data.username){
        //     return
        // }
        if (file && data.username ){
            const theFile = file;
            const formData = new FormData();
            formData.append('image', theFile);
            const raw = await fetch(`${backendUrl}/addprofileimage/`+data.id, {
            method: 'POST',
            body:formData
        })
        }
        if (bannerFile && data.username ){
            const theFile = bannerFile;
            const formData = new FormData();
            formData.append('image', theFile);///////
            const raw = await fetch(`${backendUrl}/editprofilefile/`+data.id+"/banner", {
            method: 'POST',
            body:formData
        })
        }
        // setUsera("true")
        if (data.username){
                return navigate("/login")

        }
        // if (data.username){
        //     setUser(data)

        // }
    
    }

    return <>
        <div className="signup-container">
            <h1>Create An Account</h1>
            <h4>We're so excited to have you join us! </h4> 
            <form method="post" onSubmit={signUp} encType="multipart/form-data">
                <div className="first">
                    <div className="cont">
                        <div>
                            <label htmlFor="">Username</label>
                            <input type="text" placeholder="Call me ..." value={username} onChange={(e)=>changeUsername(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="">Password</label>
                            <input type="password" value={password} onChange={(e)=>changePassword(e.target.value)}/>
                        </div>
                    </div>
                    <h3>Choose Profile Picture</h3>
                    <input type="file" name="picture" onChange={(e)=>handleFile(e.target.files[0])}/>
                </div>
                <div className="second">
                    <h3>Choose A Banner</h3>
                    <input type="file" name="picture" onChange={(e)=>handleBannerFile(e.target.files[0])}/>
                </div>
                <h2>Create a Bio</h2>
                <textarea   name="" id="" value={bio} onChange={(e)=>handleBio(e.target.value)}></textarea>
                <br /><button type="submit">Create</button>

            </form> 
        </div>
        
        </>
}

export default SignUp 
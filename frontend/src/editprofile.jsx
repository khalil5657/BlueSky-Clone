import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router"


function EditProfile({backendUrl}){
    const [user, setUser] = useOutletContext()
    const [bannerFile, setBannerFile] = useState('')
    const [avatarFile, setAvatarFile] = useState("")
    const [bioContent, setBioContent] = useState(user.bio?user.bio:'')
    const navigate = useNavigate()

    async function postIt(e) {
        e.preventDefault()
        if (bioContent){
            await fetch(`${backendUrl}/editprofile`, {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bio:bioContent,
                    userid:user.id
                })
            })
        }
        if (bannerFile){
            const theFile = bannerFile
            const formData = new FormData();
            formData.append('image', theFile);
            console.log(formData)
            const raw = await fetch(`${backendUrl}/editprofilefile/`+user.id+"/banner", {
                method: 'POST',
                body:formData
                })
            const newFile = await raw.json()
        }
        if (avatarFile){
            const theFile = avatarFile
            const formData = new FormData();
            formData.append('image', theFile);
            console.log(formData)
            const raw = await fetch(`${backendUrl}/editprofilefile/`+user.id+"/avatar", {
                method: 'POST',
                body:formData
                })
            const newFile = await raw.json()
        }
        return navigate("/", {state:{user:user}})
    }
    function handleBio(value){
        setBioContent(value)
    }

    function handleBannerFile(file){
        setBannerFile(file)
    }
    function handleAvatarFile(file){
        setAvatarFile(file)
    }
    return <div className="content">
            <form action="" onSubmit={postIt} encType="multipart/form-data">
                <div className="editbanner">
                    <div className="editbannerimg">
                        {user.bannerimg?<img src={user.bannerimg.url} />:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg"/>}
                    </div>
                    <div className="editbannerinput">
                        <label htmlFor="">Choose Banner</label>
                        <input type="file" onChange={(e)=>handleBannerFile(e.target.files[0])}/>    
                    </div>
                </div>
                <div className="editavatar">
                    <div className="editavatarimg">
                        {user.img?<img src={user.img.url} />:<img src="https://res.cloudinary.com/dlwgxdiyp/image/upload/v1730058205/d76lwdwx5ojtcdk302eb.jpg"/>}
                    </div>
                    <div className="editavatarinput">
                        <label htmlFor="">Choose Avatar</label>
                        <input type="file" onChange={(e)=>handleAvatarFile(e.target.files[0])}/>
                    </div>
                    
                </div>
                <div className="bio">
                    <label htmlFor="">Bio:</label>
                    <textarea name="" id="" value={bioContent} onChange={(e)=>handleBio(e.target.value)}></textarea>
                </div>
                <button type="submit" className="editprofilebtn">Update</button>
            </form>
        </div>
}

export default EditProfile
const express = require("express");

const cookieParser = require("cookie-parser")
const bcrypt = require("bcryptjs")

const fs = require('fs')

const jwt = require('jsonwebtoken')
const app = express();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

app.use(express.json())
app.use(cookieParser())
var cors = require('cors');

app.set("trust proxy", 1);

require("dotenv").config()


const cloudinary = require('cloudinary').v2
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
let originUrl = ''
if (process.env.STATE == "dev"){
    originUrl = process.env.DEV_ORIGIN_URL
}else{
    originUrl = process.env.PROD_ORIGIN_URL
}
app.use(cors({
    origin: originUrl,
    methods : ["PUT", "DELETE", "POST", "GET"],
    credentials: true
}))

app.get("/", (req, res)=>{
    res.send("hello YOO")
})

app.get("/sendtest", async(req, res)=>{
    await prisma.test.create({
        data:{
            content:"397ddko87836763576d"
        }
    })
    res.send({message:"success"})
})

app.post("/signup", async (req, res)=>{
  const { username, password } = req.body
  try{
    
    const existingUser = await prisma.user.findUnique({
      where: {
         username: username
        }
    })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
          data: {
            username: username,
            password: hashedPassword,
            bio:req.body.bio
          }
        })
    res.send(user)

  }catch{
    res.send("hahahahhhahahah")
  }
})

app.post("/addprofileimage/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    await prisma.user.update({
      where:{
        id: req.params.id
      },
      data:{
        img:{
          create:{
            name: originalname,
            url: results.secure_url
          }
        }
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    res.send({message:"success"})
    }catch(error){
      console.log(error)
      res.send({message:'unsucsessfull'})
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    try {
      const user = await prisma.user.findUnique({
        where: { username }
      })
    //   console.log(user)
      if (!user) {
        return res.status(400).json({ message: 'User doesnt exist.' })
      }
      
      const isMatch = await bcrypt.compare(password, user.password)
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' })
      }
  
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        'secret',
        // { expiresIn: '1h' }
      )
      res.cookie('jwt', token, {
        httpOnly:true,
        maxAge: 24 *60 *60 * 1000,
        sameSite:"none",
          secure:true
      })
      res.json(user)
    }catch (error) {
      res.status(500).json({ message: 'Server error.', error: error.message })
    }
})

app.post("/logout", (req, res)=>{
    res.cookie("jwt", "", {maxAge:0})
  res.send({message:"secsess"})
})

app.get("/user", async(req, res)=>{
    console.log("ttttt")
    try{
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, "secret")
        console.log(claims, 'pdko')
        if (!claims){
            return res.status(404).send({message:"unauthenticated"})
        }
        const user = await prisma.user.findUnique({
            where:{
            id:claims.userId
            },
            include:{
              img:true,
              bannerimg:true
            }
        })
        res.send(user)

    }catch{
    return res.status(404).send({message:"something went wrong"})
    }
})

app.get("/posts", async(req, res)=>{
    const posts = await prisma.post.findMany({
        include:{
            quotedby:{
                include:{
                    img:true,
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            },
            writer:{
                include:{
                    img:true,
                    comments:true,
                    posts:true
                }
            },
            comments:{
                include:{
                    img:true
                }
            },
            img:true
        },
        orderBy:[{
            posteddate:"desc"
        }]
        
    })
    res.status(200).json({posts:posts})
})

app.get("/posts/:id", async(req, res)=>{
    const posts = await prisma.post.findMany({
        where:{
            OR:[
                {writer:{
                is:{
                    followers:{
                    has: req.params.id
                }
                }
                
            }},
            {writerid:req.params.id}
            ]
        },
        include:{
            writer:{
                include:{
                    img:true,
                    comments:true,
                    posts:true
                }
            },
            comments:true,
            img:true,
            quotedby:{
                include:{
                    img:true,
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            }
        },
        orderBy:[
            {posteddate:"desc"}
        ]
    })
    res.status(200).json({posts:posts})
})

app.get("/user/:id", async(req, res)=>{
    const user = await prisma.user.findUnique({
        where:{
            id:req.params.id
        },
        include:{
            img:true,
            bannerimg:true,
            posts:true,
            comments:true,
        }
    })
    res.send(user)
})

app.post("/addpost", async(req, res)=>{
    const post = await prisma.post.create({
        data:{
            content:req.body.text,
            writerid:req.body.id
        }
    })
    res.send(post)
})
app.post("/addpostfile/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    await prisma.postImages.create({
      data:{
        name:originalname,
        url:results.secure_url,
        postid:req.params.id
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    res.send({message:"success"})
    }catch(error){
      console.log(error)
      res.send({message:'unsucsessfull'})
    }
})
app.post("/post/like/:postid", async(req, res)=>{
   const post  =  await prisma.post.update({
        where:{
            id:req.params.postid
        },
        data:{
            likes:{
                push:req.body.userId
            }
        },
        include:{
            quotedby:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    }
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            },
            writer:true
        }
    })
    const theuser = await prisma.user.findUnique({
        where:{
            id:req.body.userId
        }
    })
    if (theuser.id==post.writer.id){
            res.status(200).json({message:"success"})
    }else{
        await prisma.notification.create({
        data:{
            content:`${theuser.username} liked your post`,
            fromid:req.body.userId,
            toid:post.writer.id
        }
    })
    res.status(200).json({message:"success"})
    }
})
app.post("/post/unlike/:postid", async(req, res)=>{
    const post = await prisma.post.findUnique({
        where:{
            id:req.params.postid
        },
    })
    for (let i = 0; i < post.likes.length; i++) {
            if (post.likes[i] === req.body.userId) {
                 spliced = post.likes.splice(i, 1);
            }
    }
    await prisma.post.update({
        where:{
            id:req.params.postid
        },
        data:{
            likes:post.likes
        }
    })
    res.status(200).json({message:"success"})
})
app.get("/post/:id", async(req, res)=>{
    const post = await prisma.post.findUnique({
        where:{
            id:req.params.id
        },
        include:{
            quotedby:{
                include:{
                    img:true,
                    writer:{
                        include:{
                            img:true
                        }
                    }
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            },
            img:true,
            comments:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    replies:true,
                    img:true
                },
                orderBy:{
                    commenteddate:"desc"
                }
            },
            writer:{
                include:{
                    img:true
                }
            }
        }

    })
    res.send(post)
})
app.post("/post/comment", async(req, res)=>{
    const comment = await prisma.comment.create({
        data:{
            content:req.body.content,
            writerid:req.body.writerid,
            postid:req.body.postid
        },
        include:{
            post:{
                include:{
                    writer:true
                }
            }
        }
        
    })
    const theuser = await prisma.user.findUnique({
        where:{
            id:req.body.writerid
        }
    })
    if (theuser.id==comment.post.writer.id){
        res.send(comment)
    }else{
        await prisma.notification.create({
        data:{
            content:`${theuser.username} commented on your post`,
            fromid:req.body.writerid,
            toid:comment.post.writer.id
        }
        })
        res.send(comment)
    }
    
})
app.get("/posts/profile/:id", async(req, res)=>{
    const posts = await prisma.post.findMany({
        where:{
            writerid:req.params.id
        },
        include:{
            writer:{
                include:{
                    img:true,
                    bannerimg:true
                }
            },
            comments:true,
            img:true,
            quotedby:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    }
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            }
        },
        orderBy:[{
            posteddate:"desc"
        }]
    })
    res.status(200).json({posts:posts})
})

app.post("/follow", async(req, res)=>{ 
    // add to the person being folllowed
    await prisma.user.update({
        where:{
            id:req.body.followedid
        },
        data:{
            followers:{
                push: req.body.userid
            }
        }
    })
    // add to the person following
    await prisma.user.update({
        where:{
            id:req.body.userid
        },
        data:{
            following:{
                push:req.body.followedid
            }
        }
    })
    res.status(200).json({message:"success"})
})

app.post("/unfollow", async(req, res)=>{ 
    const user = await prisma.user.findUnique({
        where:{
            id:req.body.followedid
        }
    })
    for (let i = 0; i < user.followers.length; i++) {
            if (user.followers[i] === req.body.userid) {
                 spliced = user.followers.splice(i, 1);
            }
    }
    await prisma.user.update({
        where:{
            id:req.body.followedid
        },
        data:{
            followers:user.followers
        }
    })
    ////
    const user2 = await prisma.user.findUnique({
        where:{
            id:req.body.userid
        }
    })
    for (let i = 0; i < user2.following.length; i++) {
            if (user2.following[i] === req.body.followedid) {
                console.log("one")
                 spliced = user2.following.splice(i, 1);
            }
    }
    await prisma.user.update({
        where:{
            id:req.body.userid
        },
        data:{
            following:user2.following
        }
    })
    res.status(200).json({message:"success"})
})

app.get("/comment/:id", async(req, res)=>{
    const comment= await prisma.comment.findUnique({
        where:{
            id:req.params.id
        },
        include:{
            img:true,
            repliedto:true,
            writer:{
                include:{
                    img:true
                }
            },
            replies:{
                include:{
                    img:true,
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    replies:true
                }
            },
            

        }
    })
    // console.log(comment)
    res.send(comment)
})

app.post("/comment/reply", async(req, res)=>{
    const reply = await prisma.comment.create({
        data:{
            content:req.body.content,
            writerid:req.body.writerid,
            repliedtoid:req.body.repliedtoid,
            postid:req.body.postid
        },
        include:{
            post:{
                include:{
                    writer:true
                }
            },
            repliedto:{
                include:{
                    writer:true
                }
            }
        }
        })
    const theuser = await prisma.user.findUnique({
        where:{
            id:req.body.writerid
        }
    })
    if (theuser.id==reply.repliedto.writer.id){
            res.send(reply)
    }else{
        await prisma.notification.create({
        data:{
            content:`${theuser.username} replied to your comment`,
            fromid:req.body.writerid,
            toid:reply.repliedto.writer.id
        }
        })
        res.send(reply)
    }
    
})

app.post("/addcommentfile/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    await prisma.comment.update({
      where:{
        id: req.params.id
      },
      data:{
        img:{
          create:{
            name: originalname,
            url: results.secure_url
          }
        }
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    res.send({message:"success"})
    }catch(error){
      console.log(error)
      res.send({message:'unsucsessfull'})
    }
})

app.post("/addmessagefile/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    await prisma.message.update({
      where:{
        id: req.params.id
      },
      data:{
        img:{
          create:{
            name: originalname,
            url: results.secure_url
          }
        }
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    res.send({message:"success"})
    }catch(error){
      console.log(error)
      res.send({message:'unsucsessfull'})
    }
})

app.get("/chatusers/:id", async(req, res)=>{
    const messages = await prisma.message.findMany({
        where:{
            OR:[
                {fromid:req.params.id},
                {toid:req.params.id}
            ]
        },
        orderBy:[
            {
                sentdate:"desc"
            }
        ]
    })
    let arr = []
    for (let message of messages){
        if (message.fromid==req.params.id){
            if (arr.includes(message.toid) == false){
                arr.push(message.toid)
            }
        }else{
            if (arr.includes(message.fromid) == false){
                arr.push(message.fromid)
            }
        }
    }
    const users = []
    for (let userid of arr){
        const aUser = await prisma.user.findUnique({
            where:{
                id:userid
            },
            include:{
                img:true
            }
        })
        users.push(aUser)
    }
    res.send(users)
})
app.post("/messages", async(req, res)=>{
    const messages = await prisma.message.findMany({
        where:{
            OR:[
                {fromid:req.body.userid, toid:req.body.otherid},
                {fromid:req.body.otherid, toid:req.body.userid}
            ]
        },
        include:{
            img:true
        },
        orderBy:[
            {
                sentdate:"asc"
            }
        ]
    })

    res.send(messages)
})
app.post("/message/sent", async(req, res)=>{
    const message = await prisma.message.create({
        data:{
            content:req.body.content,
            fromid:req.body.fromid,
            toid:req.body.toid
        },
        include:{
            img:true
        }
    })
    res.send(message)
})

app.delete("/post/:id", async(req, res)=>{
    // const post = await prisma.post.findUnique({
    //     where:{
    //         id:req.params.id
    //     }, 
    //     include:{
    //         img:true
    //     }
    // })
        await prisma.postImages.deleteMany({
        where:{
            postid:req.params.id
        }
        })
    await prisma.comment.deleteMany({
        where:{
            postid:req.params.id
        }
        })
    await prisma.post.delete({
        where:{
            id:req.params.id
        }
    })
    res.status(200).json({message:"sucess"})
})
app.delete("/comment/:id", async(req, res)=>{

    const comment = await prisma.comment.findUnique({
        where:{
            id:req.params.id
        },
        include:{
            replies:true
        }
    })
    await prisma.commentImage.delete({
        where:{
            commentid:req.params.id
        }
    })
    if (comment.replies.length==0){
        await prisma.comment.delete({
        where:{
            id:req.params.id
        }
        })
    }else{
        await prisma.comment.update({
            where:{
                id:req.params.id
            },
            data:{
                content:"this comment has been deleted"
            }
        })
    }
    
    res.status(200).json({message:"sucess"})
})

app.delete("/postimg/:id", async(req, res)=>{
    await prisma.postImages.delete({
        where:{
            id:req.params.id
        }
    })
    res.status(200).json({message:"success"})
})

app.post("/editpostfile/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    const image = await prisma.postImages.create({
      data:{
        name:originalname,
        url:results.secure_url,
        postid:req.params.id
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    res.send(image)
    }catch(error){
      console.log(error)
      res.send({message:'unsucsessfull'})
    }
})

app.post("/lastmessage", async(req,res)=>{
    const messages = await prisma.message.findMany({
        where:{
            OR:[
                {fromid:req.body.meid, toid:req.body.otherid},
                {fromid:req.body.otherid, toid:req.body.meid}
            ]
        },
        orderBy:[
            {
                sentdate:"asc"
            }
        ]
    })
    // console.log('last mssage = ',req.body.meid, req.body.otherid,  messages[messages.length-1])
    const message = messages[messages.length-1]
    res.send(message)
})

app.post("/editpost", async(req, res)=>{
    console.log("plplppl")
    const post = await prisma.post.findUnique({
        where:{
            id:req.body.postid
        },
        include:{
            img:true
        }
    })
    for (let i = 0;i<req.body.num;i++){
        let oldImgId = post.img[i].id
        await prisma.postImages.update({
            where:{
                id:oldImgId
            },
            data:{
                url:req.body.files[i].url,
                name:req.body.files[i].name
            }
        })
        
    }
    await prisma.post.update({
        where:{
            id:req.body.postid
        },
        data:{
            content:req.body.text
        }
    })



    res.status(200).json({message:"success"})
})

app.post("/editcommentfile/:id", upload.single("image"), async(req, res)=>{
    const { originalname, size, path } = req.file;
    try{
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret :process.env.API_SECRET
    });
    const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
    const image = await prisma.commentImage.create({
      data:{
        commentid:req.params.id,
        name:originalname,
        url:results.secure_url
      }
    })
    // Clear temporary local download
    fs.unlinkSync(path);
    res.send(image)
    }catch(error){
      console.log(error)
      res.send({message:'unsucsessfull'})
    }
})

app.post("/editcomment/:id", async(req, res)=>{
    const comment = await prisma.comment.findUnique({
        where:{
            id:req.params.id
        },
        include:{
            img:true
        }
    })
    // if (req.body.file.img){
    //     await prisma.commentImage.update({
    //         where:{
    //             id:comment.img.id
    //         },
    //         data:{
    //             name:req.body.file.name,
    //             url:req.body.file.url
    //         }
    //     })
    // }
    await prisma.comment.update({
        where:{
            id:req.params.id
        },
        data:{
            content:req.body.content
        }
    })
    res.status(200).json({message:"success"})
})

app.delete("/commentimg/:id", async(req, res)=>{
    await prisma.commentImage.delete({
        where:{
            id:req.params.id
        }
    })
    res.status(200).json({message:"success"})
})

app.get("/search/:word", async(req, res)=>{
    const profiles = await prisma.user.findMany({
        where:{
            username:{
                contains: req.params.word
            }
        },
        include:{
            img:true
        }
    })
    const posts = await prisma.post.findMany({
        where:{
            content:{
                contains: req.params.word
            }
        },
        include:{
            comments:{
                include:{
                    repliedto:true
                }
            },
            img:true,
            writer:{
                include:{
                    img:true
                }
            },
            quotedby:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    }
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            }
        }
    })
    res.status(200).json({profiles:profiles, posts:posts})
})

app.post("/addretweet", async(req, res)=>{
    let object = {id:req.body.userid, date:Date()}
    const post = await prisma.post.update({
        where:{
            id:req.body.postid
        },
        data:{
            retweets:{
                push: object
            }
        },
        include:{
            writer:true
        }
    })
    const theuser = await prisma.user.findUnique({
        where:{
            id:req.body.userid
        }
    })
    if (theuser.id==post.writer.id){
            res.status(200).json({message:"success"})
    }else{
        await prisma.notification.create({
        data:{
            content:`${theuser.username} retweeted your post`,
            fromid:req.body.userid,
            toid:post.writer.id
        }
        })
        res.status(200).json({message:"success"})
    }
    
})

app.post("/removeretweet", async(req, res)=>{
    const post = await prisma.post.findUnique({
        where:{
            id:req.body.postid
        }
    })

    for (let i =0;i<post.retweets.length;i++){
        if (post.retweets[i].id==req.body.userid){
            spliced = post.retweets.splice(i, 1)
        }
    }

    await prisma.post.update({
        where:{
            id:req.body.postid
        },
        data:{
            retweets:post.retweets
        }
    })
    res.status(200).json({message:"success"})
})

app.get("/posts/profile/retweets/:id", async(req, res)=>{
    const posts = await prisma.post.findMany({
        include:{
            writer:true,
            quotedby:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    }
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            }
        }
    })
    res.status(200).json({posts:posts})
})

app.get("/users/:id", async(req, res)=>{
    const users = await prisma.user.findMany({
        where:{
                followers:{
                has:req.params.id
            }
        },
        include:{
            bannerimg:true
        }
    })
    res.send(users)
})


app.post("/posts/ret", async(req, res)=>{
    const posts  = await prisma.post.findMany({
        where:{
            NOT:{
                writerid:req.body.userid
            },
            // writer:{
            //     NOT:{
            //         followers:{
            //             has:req.body.userid
            //         }
            //     },
                
            // }
        },
        include:{
            writer:true,
            quotedby:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    }
                }
            },
            quotespost:{
                include:{
                    writer:{
                        include:{
                            img:true
                        }
                    },
                    img:true
                }
            }
        }
    })
    res.send(posts)
})
app.post("/quotepost", async(req, res)=>{
    const post = await prisma.post.create({
        data:{
            content:req.body.text,
            writerid:req.body.userid,
            quotespostid:req.body.quotespostid
        },
        include:{
            quotespost:{
                include:{
                    writer:true
                }
            }
        }
    })
    const theuser = await prisma.user.findUnique({
        where:{
            id:req.body.userid
        }
    })
    if (theuser.id==post.quotespost.writer.id){
        res.send(post)
    }else{
        await prisma.notification.create({
        data:{
            content:`${theuser.username} quoted your post`,
            fromid:req.body.userid,
            toid:post.quotespost.writer.id
        }
        })
        res.send(post)
    }
    
})

app.post("/editprofilefile/:userid/:thing", upload.single("image"), async(req, res)=>{
    if (req.params.thing=="banner"){
        const { originalname, size, path } = req.file;
        try{
        cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret :process.env.API_SECRET
        });
        const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
        await prisma.banner.deleteMany({
            where:{
                userid:req.params.userid
            }
        })
        const image = await prisma.banner.create({
        data:{
            name:originalname,
            url:results.secure_url,
            userid:req.params.userid
        }
        })
        // Clear temporary local download
        fs.unlinkSync(path);
        res.send(image)
        }catch(error){
        console.log(error)
        res.send({message:'unsucsessfull'})
        }
    }else if (req.params.thing=="avatar"){
        const { originalname, size, path } = req.file;
        try{
        cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret :process.env.API_SECRET
        });
        const results = await cloudinary.uploader.upload(path, {resource_type: 'auto'})
        await prisma.image.deleteMany({
            where:{
                userid:req.params.userid
            }
        })
        // await prisma.user.update({
        //     where:{
        //         id:req.params.userid
        //     },
        //     data:{
        //         img:{
        //             create:{
        //                 name: originalname,
        //                 url: results.secure_url
        //             }
        //         }
        // }
        // })
        const image = await prisma.image.create({
            data:{
                name:originalname,
                url:results.secure_url,
                userid:req.params.userid
            }
        })
        // Clear temporary local download
        fs.unlinkSync(path);
        res.send(image)
        }catch(error){
        console.log(error)
        res.send({message:'unsucsessfull'})
        }
    }
    
    
})
app.post("/editprofile", async(req, res)=>{
    await prisma.user.update({
        where:{
            id:req.body.userid
        },
        data:{
            bio:req.body.bio
        }
    })
    res.status(200).json({message:"sucess"})
})
app.post("/createlastseen", async(req, res)=>{
    const lastseen = await prisma.lastSeenMessages.create({
        data:{
            fromid:req.body.fromid,
            toid:req.body.toid,
            lastseenmessageid:req.body.lastseenmessageid
        }
    })
    res.send(lastseen)
})
app.post("/createemptylastseen", async(req, res)=>{
    const lastseen = await prisma.lastSeenMessages.create({
        data:{
            fromid:req.body.fromid,
            toid:req.body.toid,
        }
    })
    res.send(lastseen)
})
app.post("/updatelastseen", async(req, res)=>{
    
    const lastseen = await prisma.lastSeenMessages.update({
        where:{
            id:req.body.modelid
        },
        data:{
            lastseenmessageid:req.body.lastseenmessageid
        }
    })
    res.send(lastseen)
})
app.post("/getlastseen", async(req, res)=>{
    const lastseenarray = await prisma.lastSeenMessages.count({
        where:{
            fromid:req.body.fromid,
            toid:req.body.toid
        }
    })
    // console.log(lastseenarray)
    if (lastseenarray>0){
        let lastseenmodel = await prisma.lastSeenMessages.findMany({
            where:{
                fromid:req.body.fromid,
                toid:req.body.toid
            }
        })
        res.send(lastseenmodel[0])
    }else{
        res.json({message:"no"})
    }
    // const lastseen = await prisma.lastSeenMessages.findMany({
    //     where:{
    //         OR:[
    //             {fromid:req.body.fromid,
    //             toid:req.body.toid},
    //             {id:"ij"}
    //         ]
    //         }

    // })
    // res.send(lastseen)
})

app.post("/getlastseennotif", async(req, res)=>{
    const lastSeenNotification = await prisma.lastSeenNotification.findUnique({
        where:{
            userid:req.body.userid
        }
    })
    if (lastSeenNotification){
        res.send(lastSeenNotification)
    }else{
        res.json({message:"no"})
    }
})

app.get("/notifications/:id", async(req, res)=>{
    const notifications = await prisma.notification.findMany({
        where:{
            toid:req.params.id
        },
        include:{
            from:true
        }
    })
    res.send(notifications)
})

app.post("/createlastseennotif", async(req, res)=>{
    const lastseen = await prisma.lastSeenNotification.create({
        data:{
            userid:req.body.userid,
            lastseennotificationid:req.body.lastseennotificationid
        }
    })
    res.send(lastseen)
})
app.post("/createemptylastseennotif", async(req, res)=>{
    const user = await prisma.user.update({
        where:{
            id:req.body.userid
        },
        data:{
            lastseennotification:{
                create:{
                    
                }
            }
        },
        include:{
            lastseennotification:true
        }
    })
    // const lastseen = await prisma.lastSeenNotification.create({
    //     data:{
    //         userid:req.body.userid
    //     }
    // })
    
    res.send(user.lastSeenNotification)
})
app.post("/updatelastseennotif", async(req, res)=>{
    
    const lastseen = await prisma.lastSeenNotification.update({
        where:{
            id:req.body.modelid
        },
        data:{
            lastseennotificationid:req.body.lastseennotificationid
        }
    })
    res.send(lastseen)
})

app.listen(3003)

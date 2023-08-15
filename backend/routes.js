const express = require('express')
const b = require('bcrypt')
const { User } = require('./models/user.model')
const { Quiz } = require('./models/quiz.model')
const router = express.Router()

router.get('/user', async(req, res)=>{
    try {
        let users = await User.find()
        return res.status(200).send({msg : "all users", isOk : true, users : users})
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})

router.post('/user/login', async(req, res)=>{
    let {email , password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user) return res.status(404).send({msg : "User Not found !", isOk : false})
        else{
            let ispassword = b.compareSync(password, user.password)
            if(!ispassword) return res.status(400).send({msg: "Wrong Credientials !", isOk : false})
            else{
                return res.status(200).send({msg : "login successful", isOk : true, user : user })
            }
        }
        
    } catch (error) {
        console.log(error)
        return res.status(404).send({msg : "Wrong Credientials !", isOk : false})
    }
})

router.post('/user/register', async(req, res)=>{
    let {email , password} = req.body
    try {
        let user = await User.findOne({email})
        if(user){
            return res.status(400).send({msg : "User already registered, try loging in !", isOk : false})
        }
        else {
            b.hash(password, 8, async (err, result)=>{
                if(err){
                    console.log(err)
                    return res.status(400).send({msg : "Something went wrong !", isOk : false }) 
                }
                else{
                    let user = new User({email, password : result})
                    await user.save()
                    return res.status(200).send({msg : "Registeration Successful", isOk : true, user  : user})
                }
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong- !", isOk : false })
    }
})


router.get('/getquiz', async(req, res)=>{
    try {
        let quizes = await Quiz.find()
        res.status(200).send({msg :"all quizes", isOK : true, quizes : quizes})
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})

router.get('/getquiz/:id', async(req, res)=>{
    try {
        let id = req.params.id
        let quizes = await Quiz.findById(id)
        res.status(200).send({msg :"Quizes data", isOK : true, quiz : quizes})
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})

router.post('/createquiz', async(req, res)=>{
    try {
        let {creator, title, description, questions, leaderboard} = req.body

        const quiz = new Quiz({creator, title, description, questions,leaderboard})
        await quiz.save()

        return res.status(200).send({msg : "quiz created", isOk:true, quiz : quiz})        
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})


router.delete('/delete/:id',async(req,res)=>{
    let id = req.params?.id
    try {
        let quiz = await Quiz.findByIdAndDelete(id)
        return res.status(200).send({msg:" Quiz deleted ..", isOk: true, deletedquiz:quiz})
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})

router.patch('/setScore/:quizId', async (req,res)=>{
    let quizID =req.params.quizId
    let {email , score} = req.body
    try {
        let quiz = await Quiz.findById(quizID)
        let filtered  = quiz.leaderboard.filter((el)=> el.email == email)
        if(filtered.length >0){
            for(let i = 0; i<quiz.leaderboard.length; i++){
                if(quiz.leaderboard[i].email == email ){
                    quiz.leaderboard[i].score = score
                }
            }
        }else{
            quiz.leaderboard.push(req.body)
        }

        let updated = await Quiz.findByIdAndUpdate(quizID, quiz)

        return res.status(200).send({msg: "score updated successfully", isOk : true, quiz : quiz})
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})

router.patch('/updateQuiz', async(req,res)=>{
    try {
        let id = req.body._id
        let updatedQuiz = await Quiz.findByIdAndUpdate(id, req.body,{returnOriginal : true})
        return res.status(200).send({msg: "Quiz updated successfully", isOk : true, quiz : updatedQuiz})
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})

router.get('/getleaderboard/:quizId', async(req,res)=>{
    try {
        let id = req.params.quizId
        let quiz = await Quiz.findById(id)
        return res.status(200).send({msg: "leaderboard data", isOk : true, leaderboard : quiz.leaderboard, title : quiz.title}) 
    } catch (error) {
        console.log(error)
        return res.status(400).send({msg : "Something went wrong", isOk : false, error : error})
    }
})
module.exports = {router}
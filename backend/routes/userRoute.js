import express from 'express';
import User from '../models/userModel';
import { getToken , isAuth} from '../util';

const router = express.Router();

router.post('/signin', async(req, res) => {
    const signinUser = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if(signinUser){
        const isBlocked = signinUser.isBlocked;
        if (!isBlocked){
            res.send({
                _id: signinUser.id,
                name: signinUser.name,
                email: signinUser.email,
                isAdmin: signinUser.isAdmin,
                isBlocked: signinUser.isBlocked,
                token: getToken(signinUser)
            })
        }else{
            res.status(405).send({msg: 'Sorry your account is Blocked!'});
        }
    }else{
        res.status(401).send({msg: 'Invalid Email or Password.'});
    }
})

router.post('/register', async(req, res) =>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    const newUser = await user.save();
    if(newUser){
        res.send({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            isBlocked: newUser.isBlocked,
            token: getToken(newUser)
        })

    }else{
        res.status(401).send({msg: 'Invalid User Data.'});
    }
})

router.get("/createadmin", async (req, res) =>{
    try {
        const user = new User({
            name: 'Ten',
            email: 'ten-admin@futuretech.com',
            password : '12345',
            isAdmin: true,
            isBlocked: false
        });
        const newUser = await user.save();
        res.send(newUser);
    }catch (error){
        res.send({msg: error.message});
    }
})

export default router;
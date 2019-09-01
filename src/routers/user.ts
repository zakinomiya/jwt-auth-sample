{
const express = require('express');
const router = express.Router();
const UserObj = require('../models/User');
const auth = require("../middleware/auth")


router.post('/users', async (req: any, res: any) => {
    try{
        const user = new UserObj(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/login', async(req: any, res: any) => {
    console.log("/users/login");
    console.log(req.body);
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await UserObj.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'});
        }
        const token = await user.generateAuthToken();
        console.log({user, token});
        res.send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }

})

router.get('/users/me', auth, async(req: any, res: any) => {
    res.send(req.user);
})

router.post('/users/me/logout', auth, async (req: any, res: any) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token: {token: string}) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/me/logoutall', auth, async(req: any, res: any) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router
}
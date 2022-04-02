const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const{name, email, password, picture} = req.body;

    //checks if user already exists in database
    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error('user with email already exists')
    }

    //if user does not exit
    const user = await User.create({
        name,
        email,
        password,
        picture,
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.picture,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Error Occured')

    }

    
})


const authUser = asyncHandler(async (req, res) => {
    const{email, password} = req.body;

    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            picture: user.picture,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('invalid email or password')

    }



    
})

module.exports = {registerUser, authUser}
import User from "../model/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//This function is to get list of users
export const getAllUser = async(req, res, next)=> {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log(error)
    }
    if(!users){
        return res.status(404).json({message: " No Users Found"});
    }
    return res.status(200).json({users})
};

//this function is for signing up
export const signup = async(req, res, next) => {
    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return console.log(error)
    }
    if(existingUser) {
        return res.status(400).json({message: "User already exists"})
   
    }
   
    const hashedPassword = bcrypt.hashSync(password);

    
    const user = new User({
        name,
        email,
        password: hashedPassword,
        posts: []
    });
    
    try {
        await user.save();
    } catch (error) {
        return console.log(error)
        
    }
    return res.status(201).json({user});
}

//This function is for login 
export const login = async(req, res, next)=> {
    const {email, password} = req.body;
   
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return console.log(error)
    }
    if(!existingUser) {
        return res
        .status(404)
        .json({message: "User Does not exist"})
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect Password"})
    }

    const token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        'your_secret_key_here',
        { expiresIn: '365d' }
    );
// Store the generated token in the User schema
existingUser.token = token;
await existingUser.save();    
return res.status(200).json({message: "Login Successfull!", user: existingUser, token});
    
}





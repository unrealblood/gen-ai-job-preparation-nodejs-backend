import { connectAndGetMongoDbClient } from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const client = await connectAndGetMongoDbClient();
    const db = client.db();

    const user = await db.collection("users").findOne({email});
    
    if(user) {
        return res.status(400).json({message: "User with email address already exists"});
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
        name,
        email,
        password: passwordHash
    };

    await db.collection("users").insertOne(newUser);

    await client.close();

    return res.status(201).json({message: "User created successfully. You can now login"});
}

export async function login(req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    const client = await connectAndGetMongoDbClient();
    const db = client.db();

    const user = await db.collection("users").findOne({email});

    await client.close();
    
    if(!user) {
        return res.status(400).json({message: "Invalid email or password"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({message: "Invalid email or password"});
    }

    const token = jwt.sign({id: user._id.toString()}, process.env.JWT_SECRET);

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({message: "login successfull", user: {...user, _id: user._id.toString()}});
}

export async function logout(req, res) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(400).json({message: "token not found"});
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);

        res.clearCookie("token");

        return res.status(200).json({message: "logged out successfully"});
    }
    catch(error) {
        return res.status(400).json({message: "Invalid token: " + error.message});
    }
}
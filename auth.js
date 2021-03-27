const express = require("express");
const router = express.Router();
const UserModel = require("./UserModel");
const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret", (err, user) => {
            if (!user) return res.json({ message: "User not authenticated" });
            else next();
        });
    }
}

router.get("/protected", isAuthenticated, async (req, res) => {
    return res.json({ message: "This is a protected route" });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body.data;

    if (!username || !password)
        return res.json({ message: "Invalid credentials" });

    const user = await UserModel.findOne({ username: username });
    if (user) {
        if (user.password === password) {
            const payload = {
                username
            };
            jwt.sign(payload, "secret", { expiresIn: "1d" }, (err, token) => {
                if (err) console.log(err);
                else {
                    return res.json({
                        message: "User logged In!",
                        token: token
                    });
                }
            });
        } else {
            return res.json({ message: "Incorrect password" });
        }
    } else {
        return res.json({ message: "Incorrect credentials" });
    }
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body.data;

    if (!username || !password)
        return res.json({ message: "Invalid credentials" });

    const userExists = await UserModel.findOne({ username: username });
    console.log(userExists);

    if (userExists) return res.json({ message: "User already exists" });
    else {
        const newUser = new UserModel({
            username,
            password
        });
        newUser.save();
        return res.json({ message: "User created", newUser });
    }
});

module.exports = router;

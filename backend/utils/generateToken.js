import jwt from 'jsonwebtoken';

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks; not assisible via JavaScript
        sameSite: "Strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development" // cookie will only be set in production mode
    });
};

export default generateTokenAndSetCookie;
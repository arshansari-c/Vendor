import jwt from 'jsonwebtoken';

export const CreateAndSaveCookie = async ({ userId, res }) => {
  try {
    const token = jwt.sign({ userId }, process.env.SECRET_TOKEN, {
      expiresIn: '7d',
    });

    res.cookie("jwt", token, {
      httpOnly: true,         // Prevent JS access (XSS protection)
      secure: true, // Set secure in production
      sameSite: "strict",     // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    return token; // Optional: return the token if needed
  } catch (error) {
    console.error("CreateAndSaveCookie error:", error);
    throw new Error("Cookie creation failed");
  }
};

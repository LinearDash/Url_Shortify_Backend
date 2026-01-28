import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.get('/google',passport.authenticate('google',{
    scope:['profile','email'],
    session:false  // Because i am using JWT not sessions
}))

router.get('/google/callback',
    passport.authenticate('google',{ session:false, failureRedirect: '/login' } ),
    (req,res) => {
        const user = req.user as any;
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }

        );
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
)

export default router;
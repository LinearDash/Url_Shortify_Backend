import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../config/db";


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "/api/auth/google/callback",
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findUnique({
                    where: { googleId: profile.id },
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            googleId: profile.id,
                            email: profile.emails ? profile.emails[0]?.value : '' as string,
                            name: profile.displayName,
                            avatarUrl: profile.photos ? profile.photos[0]?.value : '',
                        },
                    });
                }

                const userPayload = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatarUrl: user.avatarUrl,
                };
                
                return done(null, userPayload);
            } catch (error) {
                return done(error as Error, undefined);
                
            }
        }
    )
)

export default passport;
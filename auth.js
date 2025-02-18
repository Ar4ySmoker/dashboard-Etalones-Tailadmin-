import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./src/lib/db";
import User from "./src/models/User";
import Manager from "./src/models/Manager";

const providers = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  session: {
    strategy: "jwt", 
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token", 
      options: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        maxAge: 24 * 60 * 60, 
      },
    },
  },
  callbacks: {
    // Этот колбэк выполняется при получении сессии
    async session({ session, token }) {
      // Проверяем наличие данных в токене и добавляем их в сессию
      if (token.managerId) {
        session.managerId = token.managerId;  // ID менеджера
      }
      if (token.managerRole) {
        session.managerRole = token.managerRole;  // Роль менеджера
      }
      if (token.role) {
        session.user.role = token.role;  // Роль пользователя
      }
      return session;
    },

    // Этот колбэк выполняется при попытке входа
    async signIn({ profile }) {
      try {
        await connectDB();

        const userExist = await User.findOne({ email: profile.email });
        if (!userExist) {
          await User.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            role: 'user',
            googleId: profile.id
          });
        }

        const manager = await Manager.findOne({ email: profile.email });

        if (manager) {
          return true;  
        }

        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user && user.email) {
        const manager = await Manager.findOne({ email: user.email }).populate('role');  
        if (manager) {
          if (manager.role && manager.role.name) {
            token.managerRole = manager.role.name.toString();  
          } else {
            console.log("Manager role not found or incorrect structure");
          }

          token.managerId = manager._id.toString();  
          token.managerRole = manager.role.name.toString();  
        }

        if (user.role) {
          token.role = user.role;
        }
      }
      return token;
    },
  },
});

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToMongoDb from "@/app/lib/connect";
import User from "@/models/User"; 

const handler= NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username:    { label: "Username",    type: "text",  },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        await connectToMongoDb();                                    // ✅ call it as a function
        const user = await User.findOne({ username: credentials.username }); // ✅ query via User model

        if (!user) return null;

        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.password        
        );

        if (!passwordValid) return null;

        return {
          id:    user._id.toString(), 
          email: user.email,
          name:  user.username,    
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: { signIn: "/auth/signin" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {       
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
export { handler as GET, handler as POST };
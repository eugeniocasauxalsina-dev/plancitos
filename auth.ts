import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Configuración de autenticación (Auth.js / NextAuth v5).
// Las credenciales van en variables de entorno (ver .env.local.example):
//   AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
});

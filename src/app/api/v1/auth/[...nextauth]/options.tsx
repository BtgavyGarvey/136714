import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import DbConnect from "../../utils";
import { loginUser } from "../../controller/user/route";

const authOptions:AuthOptions={
    session:{
        strategy:'jwt',
        maxAge: 10*60

    },
    providers:[
        CredentialsProvider({
            type:'credentials',
            credentials:{email:{},password:{}},
            async authorize(credentials,req){

                let user:any
                
                if (typeof credentials !=='undefined') {

                    await DbConnect();

                    user=await loginUser(credentials.email,credentials.password,req)
                }
                else{
                    throw new Error('Invalid credentials')
                }

                if (!user.success) {
                    throw new Error(user.message)
                }
                
                const userData=user.user

                return {
                    id:userData._id,
                    access:user.access,
                }
            }
        })
        
    ],
    // database:process.env.DB_URL,
    pages:{
        signIn:'/',
        signOut:'/'
    },
    callbacks:{
        async jwt({token,user}){

            if(user){
                token.id=user.id
                token.access=user.access
            }
            return token
        },
        async session({session,token}){
            if(session.user){
                session.user.id=token.id
                session.user.access=token.access
            } 
            return session
        }
        
    }
    
}

export default authOptions
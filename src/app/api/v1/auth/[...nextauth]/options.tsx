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
            async authorize(credentials,request){

                // let pharmacyData:any
                
                // if (typeof credentials !=='undefined') {

                //     await DbConnect();

                //     pharmacyData=await loginUser(credentials.email,credentials.password,request)
                // }
                // else{
                //     throw new Error('Invalid credentials')
                // }

                // if (!pharmacyData.success) {
                //     throw new Error(pharmacyData.message)
                // }
                
                // return {
                //     id:pharmacyData.pharmacy.id,
                //     access:pharmacyData.access,
                // }

                return true
            }
        })
        
    ],
    // database:process.env.DB_URL,
    pages:{
        signIn:'/',
        signOut:'/'
    },
    callbacks:{
        async jwt({token,user}:any){

            if(user){
                token.id=user.id
                token.access=user.access
            }
            return token
        },
        async session({session,token}:any){
            if(token){
                session.user=token.user
            } 
            return session
        }
        
    }
    
}

export default authOptions
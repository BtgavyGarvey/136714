import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import DbConnect from "../../v1/utils";
import { loginUser } from "../../v1/controller/user/route";

const authOptions:AuthOptions={
    session:{
        strategy:'jwt',
        maxAge: 360*60

    },
    providers:[
        CredentialsProvider({
            type:'credentials',
            credentials:{username:{},password:{}},
            async authorize(credentials,request){

                let pharmacyData:any
                
                if (typeof credentials !=='undefined') {

                    await DbConnect();

                    pharmacyData=await loginUser(credentials.username,credentials.password,request)
                }
                else{
                    throw new Error('Invalid credentials')
                }

                if (!pharmacyData.success) {
                    throw new Error(pharmacyData.message)
                }
                
                return {
                    id:pharmacyData.pharmacy.id,
                    access:pharmacyData.access,
                    role:pharmacyData.user.role,
                    user:pharmacyData.user.id,
                    name:pharmacyData.pharmacy.pharmacy
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
        async jwt({token,user}:any){

            if(user){
                token.id=user.id
                token.user=user.user
                token.access=user.access
                token.name=user.name
                token.role=user.role
            }
            return token
        },
        async session({session,token}:any){
            if(token){
                session.user.id=token.id
                session.user.user=token.user
                session.user.access=token.access
                session.user.name=token.name
                session.user.role=token.role
            } 
            return session
        }

    }
    
}

export default authOptions
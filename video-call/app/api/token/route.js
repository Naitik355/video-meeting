import { StreamClient } from "@stream-io/node-sdk";

const api_key=process.env.STREAM_API_KEY;
const api_secret=process.env.STREAM_API_SECRET;

export async function POST(request) {
    try {
        const {userId} = await request.json();
        
        if(!api_key || !api_secret) {
            return new Response(JSON.stringify({error: "API key or secret not configured"}), {status: 500});
        }
        const ServerClient=new StreamClient(api_key, api_secret);
        const newUser={id: userId,role:'admin',name: userId};
        
        await ServerClient.upsertUsers([newUser]);
        const now=Math.floor(Date.now()/1000);
        const validity=60*60*24; 
        const token=ServerClient.generateUserToken({user_id:userId, validity_in_sec:{validity},iat:now-60});
        return Response.json({ token } );
    }
    catch(error){
        console.error("Token generation error:", error);
        return Response.json({error: "Internal Server Error"}, {status: 500});
    }
}

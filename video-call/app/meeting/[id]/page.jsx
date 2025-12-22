'use client';

import MeetingRoom from '@/app/components/meeting-room';
import StreamProvider from '@/app/components/stream-provider';
import { StreamTheme } from '@stream-io/video-react-sdk';
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const MeetingPage = () => {
  const searchParams=useSearchParams();
  const params=useParams();
  const router=useRouter();

  const callId=params.id;
  const name=searchParams.get('username') || "Anonymous";

  const [user,setUser]=useState(null);
  const [token,setToken]=useState(null);
  const[error,setError]=useState(null);

  useEffect(() => {
    setUser({
      id:name.toLowerCase().replace(/\s+/g,'-'),
      name,
    });
  }, [name]);

  useEffect(() => {
    if(!user){
      return;
    }
    fetch('/api/token',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({ userId:user.id }),
    })
    .then((res) => res.json())  
    .then((data) => {
      if(data.token) setToken(data.token);
      else setError('Failed to retrieve token');
    })
    .catch((err) => {
      console.error('Error fetching token:', err);
      setError(err.message);
    }); 
},[user]);

  if(error){
    return(
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="bg-red-600 p-6 rounded-lg shadow-lg">
          <p className="text-white text-xl font-semibold">Error: {error}</p>
          <button
            className="mt-4 px-4 py-2 bg-white text-red-600 font-semibold rounded-lg"
            onClick={() => router.push('/')}>Back</button>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-1g">Connecting ...</p>
          </div>
        </div>
    );
  }

  const handleLeave=()=>{
    router.push("/");
  };

  return( 
  <StreamProvider user={user} token={token}>
    <StreamTheme><MeetingRoom callId={callId} onLeave={handleLeave} userId={user.id} /></StreamTheme>
  </StreamProvider>
  );
}
export default MeetingPage;
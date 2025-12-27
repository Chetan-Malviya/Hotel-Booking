import React, { useEffect } from 'react'
import {useAppContext} from '../context/AppContext'
import { useParams, useSearchParams } from 'react-router-dom'

const Loader = () => {
  const {navigate, axios} = useAppContext()
  const {nextUrl} = useParams()
  const [searchParams] = useSearchParams()

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id')
    if(sessionId) {
      try {
        await axios.post('/api/bookings/verify-payment', { sessionId })
      } catch (error) {
        console.error('Payment verification failed:', error)
      }
    }
  }

  useEffect(() => {
    const handleRedirect = async () => {
      if(nextUrl) {
        await verifyPayment()
        setTimeout(()=>{
          navigate(`/${nextUrl}`)
        }, 2000)
      }
    }
    handleRedirect()
  },[nextUrl])
 
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

export default Loader
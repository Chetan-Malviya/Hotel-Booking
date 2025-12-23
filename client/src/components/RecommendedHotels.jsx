import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {

  const {rooms, searchedCities} = useAppContext();
  const [recommeded, setRecommeded] = useState([]);

  const filterHotels = () => {
    if (!Array.isArray(searchedCities) || searchedCities.length === 0) {
      setRecommeded([]);
      return;
    }
    const filterHotels = rooms.slice().filter( room => room.hotel && searchedCities.includes(room.hotel.city));
    setRecommeded(filterHotels);
  }

  useEffect(()=> {
    filterHotels()
  }, [rooms, searchedCities])

  return recommeded.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

      <Title title='Recommended Hotels' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.' />

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {recommeded.slice(0,4).map((room, index)=>(
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

    </div>
  )
}

export default RecommendedHotels
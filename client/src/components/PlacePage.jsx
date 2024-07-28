import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PlaceGallery from '../PlaceGallery';
import BookingWidget from '../BookingWidget';

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

const PlacePage = () => {
    const {id}=useParams();
    const [place,setPlace] = useState(null);
    const [source, setSource] = useState('')
    const [travelDetails, setTravelDetails] = useState([])
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get(`http://localhost:4000/places/${id}`).then((res)=>{
            setPlace(res.data);
        })

    },[id]);
    useEffect(()=>{
      if(!id){
          return;
      }
      // axios.get(`http://localhost:4000/api/travel`).then((res)=>{
      //     setPlace(res.data);
      // })

  },[id]);

    if(!place) return '';

    const getIcon = (type) => {
      switch (type) {
        case 'flight':
          return <FlightTakeoffIcon />;
        case 'bus':
          return <DirectionsBusIcon />;
        default:
          return null;
      }
    };

  function handleTravelClick() {
    const destination = place.title
    axios.get(`http://localhost:4000/api/travel?source=${source}&destination=${destination}`)
      .then(res => {
        console.log(res.data)
        console.log(res.data[0].commute)
        setTravelDetails(res.data[0].commute)
      })
  }

  

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      {/* <AddressLink>{place.address}</AddressLink> */}
      <a  target='_blank' href={'https://maps.google.com/?q='+place.address}  className=' font-500 my-2 block font-semibold underline'  >{place.address}</a> 
      {/* {/* <h2>{place.address}</h2> */}
      {/* <PlaceGallery place={place} /> */}
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <input type="text" placeholder='source' value={source} onChange={e => setSource(e.target.value)}/>
            <button onClick={handleTravelClick} className="primary mt-4">Set source</button>
            <h2 className="font-semibold text-2xl">Description</h2>
            {/* {place.description} */}
            <div>
            {travelDetails.map((detail, index) => (
              <div key={index} className="travel-detail">
                {getIcon(detail.type)}
                <div className="travel-info">
                  <p><strong>Type:</strong> {detail.type}</p>
                  <p><strong>Name:</strong> {detail.name}</p>
                  <p><strong>Departure:</strong> {new Date(detail.departureTime).toLocaleString()}</p>
                  <p><strong>Arrival:</strong> {new Date(detail.arrivalTime).toLocaleString()}</p>
                </div>
              </div>
            ))}
            </div>
          </div>
          {/* Check-in: {place.checkin}<br />
          Check-out: {place.checkout}<br />
          Max number of guests: {place.maxGuests} */}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>

      

      </div>
      {/* <div className="bg-white -mx-8 px-8 py-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
      </div> */}
    </div>
  )
}

export default PlacePage
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PhotosUploader from '../PhotosUploader';
import { Navigate, useParams } from 'react-router-dom';
const PlacesFormPage = () => {
  const { id } = useParams(); 
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('http://localhost:4000/places/' + id).then(res => {
      const { data } = res;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.addedPhotos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckin(data.checkin);
      setCheckout(data.checkout);
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title, address, addedPhotos,
      description, perks, extraInfo,
      checkin, checkout,
      
    };
    if (id) {
      // update
      await axios.put('http://localhost:4000/places', { 
        id, ...placeData
      });
    } else {
      // new place
      await axios.post('http://localhost:4000/places', placeData);
    }
    setRedirect(true);
  }

 if (redirect) {
    return (<Navigate to={'/Account/places'} />);
  }

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg bg-blue-100">
      <h2 className="text-3xl font-semibold text-blue-600 mb-4">Create Your Camp</h2>
      <form onSubmit={savePlace}>
        <div className="mb-4">
          <label className="text-lg text-blue-600" htmlFor="title">Title</label>
          <p className="text-blue-400 text-sm">Title for your camp</p>
          <input
            type="text"
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            id="title"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Title"
          />
        </div>

        <div className="mb-4">
          <label className="text-lg text-blue-600" htmlFor="address">Address</label>
          <p className="text-blue-400 text-sm">Address to your camp</p>
          <input
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            type="text"
            id="address"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Address"
          />
        </div>

        <PhotosUploader addedPhotos={addedPhotos} setAddedPhotos={setAddedPhotos} />

        <div className="mb-4">
          <label className="text-lg text-blue-600" htmlFor="description">Description</label>
          <p className="text-blue-400 text-sm">Description of the camp</p>
          <textarea
            id="description"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Description"
            rows="6"
          />
        </div>

        <div className="mb-4">
          <label className="text-lg text-blue-600" htmlFor="extra-info">Extra Information</label>
          <p className="text-blue-400 text-sm">Rules of the camp and the other information</p>
          <textarea
            value={extraInfo}
            onChange={ev => setExtraInfo(ev.target.value)}
            id="extra-info"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Extra Info"
            rows="6"
          />
        </div>

        <h2 className="text-lg text-blue-600">Arrival & Departure time</h2>
        <p className="text-blue-400 text-sm">Add Arrival & Departure time for the trainer</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg text-blue-600">Arrival Time</h3>
            <input
              type="text"
              value={checkin}
              onChange={ev => setCheckin(ev.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="14:00"
            />
          </div>
          <div>
            <h3 className="text-lg text-blue-600">Departure Time</h3>
            <input
              type="text"
              value={checkout}
              onChange={ev => setCheckout(ev.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="00:00"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Save
        </button>
        
      </form>
    </div>
  );
};

export default PlacesFormPage;

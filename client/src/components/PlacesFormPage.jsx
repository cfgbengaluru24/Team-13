import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Perks from '../Perks';
import PhotosUploader from '../PhotosUploader';
import { Navigate, useParams } from 'react-router-dom';

const PlacesFormPage = () => {
  const { id } = useParams(); 
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [nameOfQuiz, setNameOfQuiz] = useState('');
  const [question, setQuestion] = useState({
    questionText: '',
    options: ['', ''],
    correctOption: '',
  });

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

  const handleQuestionChange = (field, value) => {
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      [field]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestion(prevQuestion => {
      const newOptions = [...prevQuestion.options];
      newOptions[index] = value;
      return { ...prevQuestion, options: newOptions };
    });
  };

  const addOption = () => {
    setQuestion(prevQuestion => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ''],
    }));
  };

  const deleteOption = index => {
    setQuestion(prevQuestion => {
      const newOptions = [...prevQuestion.options];
      newOptions.splice(index, 1);
      return { ...prevQuestion, options: newOptions };
    });
  };

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title, address, addedPhotos,
      description, perks, extraInfo,
      checkin, checkout,
      quiz: { nameOfQuiz, questions: [question] },
    };
    if (id) {
      // update
      await axios.put('http://localhost:4000/places', {
        id, ...placeData,
      });
    } else {
      // new place
      await axios.post('http://localhost:4000/places', placeData);
    }
    setRedirect(true);
  }

  async function saveQuiz(ev) {
    ev.preventDefault();
    const quizData = {
      nameOfQuiz,
      questions: [question],
    };
    await axios.post('http://localhost:4000/quiz', quizData);
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
            placeholder="State"
          />
        </div>

        <div className="mb-4">
          <label className="text-lg text-blue-600" htmlFor="address">Address</label>
          <p className="text-blue-400 text-sm">Address to your camp</p>
          <input
            value={address}
            onChange={ev => setAddress(ev.target.value)}
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
            placeholder="Extra Information"
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

        {/* {/* Quiz Section
        <div className="mb-4">
          <h2 className="text-lg text-blue-600">Quiz</h2>
          <label className="text-lg text-blue-600" htmlFor="quiz-name">Quiz Name</label>
          <input
            type="text"
            value={nameOfQuiz}
            onChange={ev => setNameOfQuiz(ev.target.value)}
            id="quiz-name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Quiz Name"
          />
          <div className="mb-4">
            <label className="text-lg text-blue-600">Question</label>
            <input
              type="text"
              value={question.questionText}
              onChange={ev => handleQuestionChange('questionText', ev.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Question"
            />
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={ev => handleOptionChange(index, ev.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => deleteOption(index)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            ))}
            <button type="button" onClick={addOption} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Add Option
            </button>
            <div className="mt-2">
              <label className="text-blue-600">Correct Option</label>
              <input
                type="text"
                value={question.correctOption}
                onChange={ev => handleQuestionChange('correctOption', ev.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Correct Option"
              />
            </div>
          </div>
        </div> */}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Save
        </button>
      </form>
    </div>
  );
};

export default PlacesFormPage;

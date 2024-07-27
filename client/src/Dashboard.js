import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { getPointsAndBadges, getActiveDays } from '../apiService'; // Correct import path
import axios from 'axios';

const Dashboard = () => {
  const [points, setPoints] = useState(110);
  const [badges, setBadges] = useState(1);
  const [chartData, setChartData] = useState([
    { name: 'Day 1', activeDays: 3 },
    { name: 'Day 2', activeDays: 5 },
    { name: 'Day 3', activeDays: 2 },
    { name: 'Day 4', activeDays: 4 },
    { name: 'Day 5', activeDays: 7 },
    { name: 'Day 6', activeDays: 1 },
    { name: 'Day 7', activeDays: 6 },
  ]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    // // Fetch points and badges
    // getPointsAndBadges()
    //   .then(data => {
    //     setPoints(data.points);
    //     setBadges(data.badges);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching points and badges:', error);
    //   });

    // // Fetch active days
    // getActiveDays()
    //   .then(data => {
    //     const updatedData = data.map((day, index) => ({
    //       name: `Day ${index + 1}`,
    //       activeDays: day.activeDays
    //     }));
    //     setChartData(updatedData);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching active days:', error);
    //   });

    // Fetch quizzes
    axios.get('http://localhost:4000/quiz')
      .then(response => {
        console.log(response);
        setQuizzes(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error);
      });
  }, []);

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;

    quizzes.forEach(quiz => {
      quiz.questions.forEach((question, index) => {
        
        if (selectedOptions[index] === question.correctOption) {
          score += 100;
        }
      });
    });

    if (score>=100) {
      setPoints(prev => prev + 10);
      // Update badges on the server if needed
      axios.get('http://localhost:4000/score')
        .catch(error => {
          console.error('Error updating badges:', error);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 m-8">
      {/* Navbar */}
      <nav className="bg-red-500 text-white p-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <a href="#dashboard" className="hover:text-gray-200">Dashboard</a>
          <a href="#contest" className="hover:text-gray-200 font-bold">Contest</a>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center">
            U
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Points Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{points}</div>
              <div className="text-lg text-gray-600 mt-2">Total Points</div>
            </div>
          </div>

          {/* Badges Card */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{badges}</div>
              <div className="text-lg text-gray-600 mt-2">Badges</div>
            </div>
          </div>
        </div>


        {/* Quiz Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quiz</h2>
          {quizzes.map(quiz => (
            <div key={quiz._id} className="mb-4">
              <h3 className="text-lg font-bold mb-2">{quiz.title}</h3>
              {quiz.questions.map(question => (
                <div key={question._id} className="mb-2">
                  <p className="font-semibold">{question.question_text}</p>
                  {question.options.map(option => (
                    <div key={option} className="flex items-center mb-1">
                      <input
                        type="radio"
                        id={`${question._id}-${option}`}
                        name={question._id}
                        value={option}
                        checked={selectedOptions[question._id] === option}
                        onChange={() => handleOptionChange(question._id, option)}
                      />
                      <label htmlFor={`${question._id}-${option}`} className="ml-2">{option}</label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmitQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

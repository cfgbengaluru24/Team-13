import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { getPointsAndBadges, getActiveDays } from '../apiService'; // Correct import path

const Dashboard = () => {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState(0);
  const [chartData, setChartData] = useState([
    { name: 'Day 1', activeDays: 3 },
    { name: 'Day 2', activeDays: 5 },
    { name: 'Day 3', activeDays: 2 },
    { name: 'Day 4', activeDays: 4 },
    { name: 'Day 5', activeDays: 7 },
    { name: 'Day 6', activeDays: 1 },
    { name: 'Day 7', activeDays: 6 },
  ]);

//   useEffect(() => {
//     // Fetch points and badges
//     getPointsAndBadges()
//       .then(data => {
//         setPoints(data.points);
//         setBadges(data.badges);
//       })
//       .catch(error => {
//         console.error('Error fetching points and badges:', error);
//       });

//     // Fetch active days
//     getActiveDays()
//       .then(data => {
//         const updatedData = data.map((day, index) => ({
//           name: `Day ${index + 1}`,
//           activeDays: day.activeDays
//         }));
//         setChartData(updatedData);
//       })
//       .catch(error => {
//         console.error('Error fetching active days:', error);
//       });
//   }, []);

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

        {/* Recommended Section */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md flex flex-col item-center justify-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center flex item-center justify-center">Active Days</h2>
          <div className='flex item-center justify-center'>
            <BarChart
              width={600}
              height={300}
              data={chartData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="activeDays" fill="#a3e693" />
            </BarChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

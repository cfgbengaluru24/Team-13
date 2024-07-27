import React, { useState } from 'react';
import axios from 'axios';

const QuizQuestion = () => {
  // Quiz state
  const [nameOfQuiz, setNameOfQuiz] = useState('');
  const [question, setQuestion] = useState({ questionText: '', options: ['', ''], correctOption: '' });

  const handleQuestionChange = (field, value) => {
    setQuestion({ ...question, [field]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const addOption = () => {
    setQuestion({ ...question, options: [...question.options, ''] });
  };

  const deleteOption = (index) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    setQuestion({ ...question, options: newOptions });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = { title: nameOfQuiz, questions:[question] };
      await axios.post('http://localhost:4000/quiz', data);
      alert('Quiz saved successfully!');
      // Optionally, reset the form here
      setNameOfQuiz('');
      setQuestion({ questionText: '', options: ['', ''], correctOption: '' });
    } catch (error) {
      alert('Failed to save the quiz.');
    }
  };

  return (
    <div>
      {/* Quiz Section */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-lg text-blue-600">Quiz</h2>
          <label className="text-lg text-blue-600" htmlFor="quiz-name">Question of the day</label>
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
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Save
        </button>
      </form>
    </div>
  );
};

export default QuizQuestion;

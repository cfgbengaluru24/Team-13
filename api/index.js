const express = require('express');
const app = express();
const cors = require('cors');
const Rg = require('./schema/theSchema');
const imageDownloader = require('image-downloader');
const Place = require('./schema/Place');
const Booking = require('./schema/Booking');
const VolunteerRequest = require('./schema/volunteerRequest');
const RequestVolunteer = require('./schema/Requestvolunteer');
const bcrypt = require('bcryptjs');
const dbConnect = require('./config/database');
const { JsonWebTokenError } = require('jsonwebtoken');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const secret = 'sumitbhardwaj';
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const { resolve } = require('path');
const { rejects } = require('assert');
const Quiz = require('./schema/quiz');
const Travel = require('./schema/Travel')
const authenticateToken = require('./auth/authenticate');

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/test', (req, res) => {
  res.send('ok ok ok');
});

// Wrap the registration route in an async function
app.post('/register', async (req, res) => {
  const { name, email, password, selectedOption } = req.body;

  try {
    const output = await Rg.create({
      name,
      email,
      selectedOption,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(output);
  } catch (error) {
    // alert('failed');
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const output = await Rg.findOne({ email: email });
    if (output) {
      const passOk = bcrypt.compareSync(password, output.password);
      if (passOk) {
        jwt.sign(
          { email: output.email, id: output._id, name: output.name },
          secret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json(output);
          }
        );
        // res.status(201).json('login success');
      } else {
        res.status(452).json({
          message: 'login fail',
          value: passOk,
        });
      }
    } else {
      alert('you have not Registered. Register to Login');
    }
  } catch (error) {
    res.status(401).send('failed to login register instead');
  }
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, secret, {}, async (err, userData) => {
      if (err) {
        throw err;
      }
      const { name, email, _id } = await Rg.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
  // You might want to remove this line because it's unreachable
  // res.json(`user info`);
});

app.post('/quiz', authenticateToken, async (req, res) => {
    console.log(req.user?.selectedOption)
    if(!req.user || req.user.selectedOption !== 'Admin')
        res.status(401).send("You are not authorized to create quiz")

    const { title, description, questions } = req.body

    try {
        const quiz = new Quiz({
            title,
            description,
            questions
        });
  
        await quiz.save();
        res.status(201).send('Quiz created successfully');
    } catch (error) {
      res.status(400).send('Error creating quiz: ' + error);
    }
})

app.get('/quiz', async (req, res) => {
    let results;
    try {
        results = await Quiz.find()
        res.status(200).send({data: results})
    } catch(error) {
        res.status(400).send({error: error})
    }
})

app.post('/checkQuizResponse', async (req, res) => {
    // console.log(req.user?.selectedOption)
    // if(!req.user || req.user.selectedOption !== 'Trainee')
    //     res.status(401).send("You are not authorized to create quiz")

    const { quizId, userId, responses } = req.body

    try {

        const quiz = await Quiz.findById(quizId)
        if(!quiz)
            res.status(400).send("Invalid Quiz Id")
        let results = []

        const user = await User.findById(userId)
        if(!user)
            res.status(400).send("Invalid User Id")

        const existingUserResponse = await UserResponse.find({user_id: userId, quiz_id: quizId})
        if(existingUserResponse)
            res.status(400).send("User has already taken this quiz")

        console.log(quiz)
        var score = 0
        for(var i = 0; i < responses.length ; i++) {
            if(responses[i] === quiz.questions[i].correct_option)
                score++
            results.push({
                selectedOption: responses[i],
                correctOption: quiz.questions[i].correct_option
            })
        }

        const userResponse = new UserResponse({
            user_id: userId,
            quiz_id: quizId,
            score: score
        })

        await userResponse.save()

        res.status(200).send({
            quiz: quiz,
            results: results,
            score: score
        })

    } catch(error) {
        res.status(400).send('Error: ' + error)
    }
})

app.get('/score', authenticateToken, async (req, res) => {
    if(!req.user || req.user.selectedOption !== 'trainee') {
        res.status(400).send("Invalid User")
    }

    const quizResults = UserResponse.find({user_id: req.user._id})
    for(var i = 0; i < quizResults.length ; i++) {
        const quizResult = quizResults[i];
        score += quizResult.score
    }

    res.status(200).send({score: score})
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link, // This is where the URL should be provided
    dest: `${__dirname}/uploads/${newName}`,
  });

  res.json(newName);
  console.log(__dirname);
});
const photosMiddleware = multer({ dest: 'uploads' });
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const fileInfo = req.files[i];
    const { path, originalname } = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath);
  }
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkin,
    checkout,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, secret, {}, async (err, userData) => {
    if (err) {
      throw err;
    }
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkin,
      checkout,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get('/places', async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, userData) => {
    if (err) {
      throw err;
    }
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.get('/place/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  // mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkin,
    checkout,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, secret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkin,
        checkout,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/home', async (req, res) => {
  res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
  const userData = await getUserFromReq(req);
  const { place, checkin, checkout, numberOfGuests, name, phone, price } =
    req.body;

  const doc = await Booking.create({
    checkin,
    checkout,
    name,
    numberOfGuests,
    phone,
    place,
    price,
    user: userData.id,
  });

  

  res.json(doc);
  //.then((err,doc)=>{
  //     if(err){
  //         throw err;
  //     }
  //     res.json(doc);
  // })
});

app.get('/api/travel', async (req, res) => {
  const { source, destination } = req.query;
console.log("here i am **")
const alltravels = await Travel.findOne({source: "Chicago"})
console.log(alltravels)
  try {
      console.log("here i am #######***");

      const travelDetails = await Travel.find({ source: source, destination: destination });
      console.log(travelDetails);
      console.log("here i am #######***");

      if (!travelDetails) {
          return res.status(404).json({ message: 'Travel details not found' });
      }

      res.json(travelDetails);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});

function getUserFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, secret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/bookings', async (req, res) => {
  const userData = await getUserFromReq(req);

  res.json(await Booking.find({ user: userData.id }).populate('place'));
});

//   app.get('/bookings', async (req, res) => {
//     try {
//       const userData = await getUserFromReq(req);
//       const bookings = await Booking.find({ user: userData.id })
//         .populate('place')
//         .exec();

//       res.status(202).json(bookings);
//     } catch (error) {
//       // Handle any potential errors, e.g., send an error response or log the error.
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

// app.get('/bookings', async (req, res) => {
//     try {
//       const userData = await getUserFromReq(req);
//       const bookings = await Booking.find({ user: userData.id }).populate('place');
//       res.json(bookings);
//     } catch (error) {
//       // Handle any potential errors, e.g., send an error response or log the error.
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
// Create Volunteer Request
app.post('/volunteer-requests', authenticateToken, async (req, res) => {
  const { campId } = req.body;

  try {
    // Validate that the user is authenticated and has a trainer role
    const userId = req.user.id; // Assuming req.user contains the authenticated user's information
    const user = await Rg.findById(userId);
    if (!user || user.selectedOption !== 'Trainer') {
      return res.status(400).json({ error: 'User must have a trainer role' });
    }

    // Validate that the camp exists
    const camp = await Place.findById(campId);
    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    // Create the volunteer request
    const volunteerRequest = await VolunteerRequest.create({
      user: userId,
      camp: campId,
    });

    res.status(201).json(volunteerRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Volunteer Request
app.put('/volunteer-requests/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { campId } = req.body;

  try {
    // Validate that the user is a trainer
    const user = await Rg.findById(req.user.id);
    if (!user || user.selectedOption !== 'Trainer') {
      return res.status(400).json({ error: 'User must have a trainer role' });
    }

    // Validate that the camp exists
    const camp = await Place.findById(campId);
    if (!camp) {
      return res.status(404).json({ error: 'Camp not found' });
    }

    // Update the volunteer request
    const volunteerRequest = await VolunteerRequest.findByIdAndUpdate(
      id,
      { camp: campId },
      { new: true }
    );

    if (!volunteerRequest) {
      return res.status(404).json({ error: 'Volunteer request not found' });
    }

    res.json(volunteerRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update volunteer request' });
  }
});

// Delete Volunteer Request
app.delete('/volunteer-requests/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const volunteerRequest = await VolunteerRequest.findByIdAndDelete(id);

    if (!volunteerRequest) {
      return res.status(404).json({ error: 'Volunteer request not found' });
    }

    res.json({ message: 'Volunteer request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete volunteer request' });
  }
});

app.post('/add-user-to-place', async (req, res) => {
  const { placeId, userId } = req.body;

  try {
    // const user_ = await Rg.findById(req.user.id);
    // if (!user_ || user_.selectedOption !== 'Admin') {
    //   return res.status(400).json({ error: 'User must have a trainer role' });
    // }

    // Validate the place
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    // Validate the user
    const user = await Rg.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the user to the place
    place.users.push(user._id);
    await place.save();

    res.status(200).json(place);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/requests-volunteer', authenticateToken, async (req, res) => {
    const { campId, userId } = req.body;
  
    try {
      // Validate that the user is authenticated and has a trainer role
      // Assuming req.user contains the authenticated user's information
      const user = await Rg.findById(userId);
      if (!user || user.selectedOption !== 'Trainer') {
        return res.status(400).json({ error: 'User must have a trainer role' });
      }
  
      // Validate that the camp exists
      const camp = await Place.findById(campId);
      if (!camp) {
        return res.status(404).json({ error: 'Camp not found' });
      }
  
      // Create the volunteer request
      const volunteerRequest = await RequestVolunteer.create({
        user: userId,
        camp: campId,
      });
  
      res.status(201).json(volunteerRequest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  // Delete Volunteer Request
  app.delete('/requests-volunteer/:id', authenticateToken, async (req, res) => {
  
    try {
      const volunteerRequest = await RequestVolunteer.findByIdAndDelete(id);
  
      if (!volunteerRequest) {
        return res.status(404).json({ error: 'Volunteer request not found' });
      }
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete volunteer request' });
      }
    });

dbConnect();

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

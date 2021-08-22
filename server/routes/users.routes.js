const { Router } = require('express');
const shortid = require('shortid');
const Link = require('../models/Post');
const auth = require('../middleware/auth.middleware');
const Games = require('../models/Games');
const User = require('../models/User');
const router = Router();

router.post('/updateAvatar', async (req, res) => {
 try {
  const { userData } = req.body;
  //   const user = await User.find({ username: userData.username });
  console.log(userData);
  const user1 = await User.updateOne(
   { email: userData.email },
   {
    username: userData.username,
    avatar: userData.avatar,
    description: userData.description,
   }
  );
  res.json(user1);
 } catch (e) {
  res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
 }
});

router.post('/updateGames', async (req, res) => {
 try {
  const { gameReview } = req.body;
  //   const user = await User.find({ username: userData.username });
  console.log(gameReview);
  const user = await User.findOne(
   { email: gameReview.email },
   async (err, obj) => {
    let counter = 0;
    obj.games.map((game) => {
     if (gameReview.title === game.title) {
      counter++;
     }
    });
    console.log('counter: ', counter);
    if (counter > 0) {
     res.status(404).json({ message: 'You have already reviewed this game' });
    } else if (!gameReview.title) {
     res.status(404).json({ message: 'Please fill in the fields' });
    } else {
     let arr = obj.games;

     arr.push(gameReview);
     //  console.log(arr);
     try {
      const user1 = await User.updateOne(
       { email: gameReview.email },
       {
        games: arr,
       }
      );
      res.status(200).json('Your review was updated successfuly');
     } catch (error) {
      console.log(error.message);
     }
    }
   }
  );
 } catch (e) {
  res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
 }
});
module.exports = router;

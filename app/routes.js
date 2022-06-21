module.exports = function(app, passport, db, ObjectId, multer) {

  // Image Upload Code =======================================================================
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + ".png")
  }
});
var upload = multer({storage: storage}); 

// LANDING SECTION
  app.get('/', function(req, res) {
      res.render('landing.ejs');
  });

// PORTFOLIO SECTION 
app.get('/portfolioPage', isLoggedIn, function(req, res) {
  db.collection('repositories').find({creator: req.user.local.email}).toArray((err1, repos) => {
    console.log(repos)
    db.collection('userPortfolioInfo').find({email: req.user.local.email}).toArray((err1, infoFromUser) => {
      db.collection('users').find({email: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('portfolioPage.ejs', {
          user : req.user.local, 
          info : infoFromUser,
          projects : repos
        })
      })
      })
    })
  });        
  
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
  
    app.post('/aboutMe', (req, res) => {
      console.log(req.user.local.fName, 'saving')
      db.collection('userPortfolioInfo')
      .insertOne({fName: req.user.local.fName,lName: req.user.local.lName, email: req.user.local.email, aboutMe: req.body.aboutMe}
      )
      res.redirect('/portfolioPage')
    })  

// PROJECTS SECTION  
// New Repository
app.get('/newRepo', isLoggedIn, function(req, res) {
db.collection('repositories').find({creator: req.user.local.email}).toArray((err1, repos) => {
  console.log(repos)
  db.collection('userPortfolioInfo').find({email: req.user.local.email}).toArray((err1, infoFromUser) => {
    db.collection('users').find({email: req.user.local.email}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('newRepo.ejs', {
        user : req.user.local, 
        info : infoFromUser,
        projects : repos
        })
      })
    })
  })
});

  app.post('/newRepo', upload.single('file-to-upload'), (req, res) => {
    let user = req.user._id
    db.collection('repositories').save({img: 'images/uploads/' + req.file.filename, creator: req.user.local.email, creatorId:user, repoName: req.body.repoName, repoDescription: req.body.repoDescript, comments:[]}, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/portfolioPage')
    })
  })

// Existing Project Profile 
app.get('/projectProfile/:projectId', isLoggedIn, function(req, res) {
  let projectId = ObjectId(req.params.projectId)
  console.log(projectId)
  db.collection('repositories').find({_id: projectId}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('projectProfile.ejs', {
      projects: result[0],
      comments: result
    })
  })
})

// Comments
app.get('/comments/:projectId', isLoggedIn, function(req, res) {
  let projectId = ObjectId(req.params.projectId)
  console.log(projectId)
  db.collection('repositories').find({_id: projectId}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('projectProfile.ejs', {
      comments: result.comments
    })
  })
});

app.post('/newComment/:projectId', isLoggedIn, function(req, res) {
  let projectId = ObjectId(req.params.projectId)
  let userId = req.user._id
  let userF = req.user.local.fName
  db.collection('repositories').findOneAndUpdate({_id:projectId},{$push:{comments: {comment: req.body.comment, userId: userId, userFName : userF, likes: 0 }}}),((err, result) => {
    if (err) return res.send(err);
    console.log('COMMENT SAVED to database')
    // res.redirect('/projectProfile/:projectId')
    res.redirect('back')
  })
})


    // app.put('/newLike', (req, res) => {
    //   console.log(req.body)
    //   // let id = ObjectId(req.body.projectId)
    //   db.collection('repositories')
    //   .findOneAndUpdate({comments:{$elemMatch:{comment:req.body.comment}}}, 
    //   {$set:{'likes':req.body.likes+1}},
    //     {
    //     // sort: {_id: -1},
    //     new: true,
    //     upsert: true
    //   },
    //   (err, result) => {
    //     if (err) return res.send(err)
    //     console.log('RESULT',result)
    //     res.send(result)
    //   })
    // })

    // app.put('/newLike', (req, res) => {
    //   console.log(req.body)
    //   // let id = ObjectId(req.body.projectId)
    //   db.collection('repositories')
    //   .findOneAndUpdate({comments:['comment':req.body.comment]},{ 
    //   $set:[{'likes':req.body.likes+1},
    //   ]},{
    //     // sort: {_id: -1},
    //     new: true,
    //     upsert: true
    //   },
    //   (err, result) => {
    //     if (err) return res.send(err)
    //     console.log('RESULT',result)
    //     res.send(result)
    //   })
    // })

    app.put('/newLike', (req, res) => {
      console.log(req.body)
      // let id = ObjectId(req.body.projectId)
      db.collection('repositories')
      .findOneAndUpdate({'comments.comment':req.body.comment}, 
      {$set:{'likes':req.body.likes+1}},
        {
        sort: {_id: -1},
        upsert: true
      },
      (err, result) => {
        if (err) return res.send(err)
        console.log('RESULT',result)
        res.send(result)
      })
    })



app.delete('/deleteComment', (req, res) => {
  db.collection('repositories').findOneAndDelete({comments: comment.req.body.comment}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Comment deleted!')
  })
})

// SEARCH SECTION
app.get('/search', isLoggedIn, function(req, res) {
  db.collection('repositories').find({creator: req.user.local.email}).toArray((err1, repos) => {
    console.log(repos)
    db.collection('userPortfolioInfo').find({email: req.user.local.email}).toArray((err1, infoFromUser) => {
      db.collection('users').find({email: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('search.ejs', {
          user : req.user.local, 
          info : infoFromUser,
          projects : repos
        })
      })
    })
  })
});
//Search Reaults Page  
app.get('/projectsFrame', isLoggedIn, function(req, res) {
  db.collection('repositories').find({creator: req.user.local.email}).toArray((err1, repos) => {
    console.log(repos)
    db.collection('userPortfolioInfo').find({email: req.user.local.email}).toArray((err2, infoFromUser) => {
      db.collection('users').find({email: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('projectsFrame.ejs', {
          user : req.user.local, 
          info : infoFromUser,
          projects : repos
        })
      })
    })
  })
});

// EVENTS SECTION
app.get('/events', function(req, res) {
  res.render('events.ejs');
});

// AUTH
        app.get('/signIn', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/portfolioPage', 
            failureRedirect : '/signIn', 
            failureFlash : true 
        }));

        
        app.get('/signUp', function(req, res) {
            res.render('signUp.ejs', { message: req.flash('signupMessage') });
        });

        
        app.post('/signUp', passport.authenticate('local-signup', {
            successRedirect : '/portfolioPage', 
            failureRedirect : '/signUp', 
            failureFlash : true 
        }));



    app.get('/unlink/local', isLoggedIn, function(req, res) {
        const user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/userProfile');
        });
    });

};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}



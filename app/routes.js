module.exports = function (app, passport, db, ObjectId, multer, cookieParser) {

  // Image Upload Code =======================================================================
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
  });
  var upload = multer({ storage: storage });

  // LANDING SECTION
  app.get('/', function (req, res) {
    res.render('landing.ejs');
  });

  // PORTFOLIO SECTION 
  app.get('/portfolioPage', isLoggedIn, function (req, res) {
    db.collection('repositories').find({ creator: req.user.local.email }).toArray((err1, repos) => {
      console.log(repos)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err2, infoFromUser) => {
        db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('portfolioPage.ejs', {
            user: req.user.local,
            info: infoFromUser,
            projects: repos
          })
        })
      })
    })
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.post('/aboutMe', (req, res) => {
    console.log(req.user.local.fName, 'saving')
    db.collection('userPortfolioInfo')
      .insertOne({ fName: req.user.local.fName, lName: req.user.local.lName, email: req.user.local.email, aboutMe: req.body.aboutMe }
      )
    res.redirect('/portfolioPage')
  })

  // app.post('/portfolioPage', upload.single('file-to-upload'), (req, res) => {
  //   let user = req.user._id
  //   db.collection('userPortfolioInfo').save({fName: req.user.local.fName, lName: req.user.local.lName, email: req.user.local.email, aboutMe: req.body.aboutMe, img: 'images/uploads/' + req.file.filename}, (err, res) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/portfolioPage')
  //   })
  // })

  // PROJECTS SECTION  
  // New Repository
  app.get('/newRepo', isLoggedIn, function (req, res) {
    db.collection('repositories').find({ creator: req.user.local.email }).toArray((err1, repos) => {
      console.log(repos)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err1, infoFromUser) => {
        db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('newRepo.ejs', {
            user: req.user.local,
            info: infoFromUser,
            projects: repos
          })
        })
      })
    })
  });

  app.post('/newRepo', upload.single('file-to-upload'), (req, res) => {
    let user = req.user._id
    db.collection('repositories').save({ creatorId: user, creator: req.user.local.email, type: 'repo', repoName: req.body.repoName, repoDescription: req.body.repoDescript, category: req.body.category, img: '/images/uploads/' + req.file.filename, comments: [], }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/portfolioPage')
    })
  })

  // Existing Project Profile 
  app.get('/projectProfile/:projectId', isLoggedIn, function (req, res) {
    let projectId = ObjectId(req.params.projectId)
    console.log(projectId)
    db.collection('repositories').find({ _id: projectId }).toArray((err, result) => {
      console.log(result[0])
      if (err) return console.log(err)
      res.render('projectProfile.ejs', {
        projects: result[0],
        user: req.user,
        comments: result[0].comment
      })
    })
  })

  app.delete('/deleteRepo', (req, res) => {
    let projectId = ObjectId(req.body.projectId)
    console.log(projectId)
    db.collection('repositories').findOneAndDelete({ _id: projectId }, (err, result) => {
      if (err) return res.send(500, err);
      res.send('Comment deleted!')
      // res.redirect('/portfolioPage')
    })
  })

  // Comments
  // app.get('/comments/:projectId', isLoggedIn, function (req, res) {
  //   let projectId = ObjectId(req.params.projectId)
  //   console.log(projectId)
  //   console.log('THIS THE REQ', req.body)
  //   db.collection('repositories').find({ _id: projectId }).toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.redirect('/projectProfile', {
  //       'comments': result
  //     })
  //   })
  // });


  app.post('/projectProfile/:projectId', isLoggedIn, function (req, res) {
    let projectId = ObjectId(req.params.projectId)
    let string = String(projectId)
    let userId = req.user._id
    let userF = req.user.local.fName
    db.collection('repositories').findOneAndUpdate({ _id: projectId }, { $push: { comments: { comment: req.body.comment, userId: userId, userFName: userF, likes: 0 } } }), ((err, result) => {
      if (err) return res.send(err);
      console.log('COMMENT SAVED to database')
      res.redirect('/projectProfile/'+ string)
      // res.send(result)
    })
  })


  app.put('/newLike', (req, res) => {
    console.log(req.body)
    // let id = ObjectId(req.body.projectId)
    db.collection('repositories')
      .findOneAndUpdate({ comments: { $elemMatch: [{ comment: req.body.comment }] } },
        { $set: [{ likes: req.body.likes + 1 }] },
        {
          sort: { _id: -1 },
          upsert: true
        },
        (err, result) => {
          if (err) return res.send(err)
          console.log('RESULT', result)
          res.send(result)
        })
  })

  app.delete('/deleteComment', (req, res) => {
    db.collection('repositories').findOneAndDelete({ comments: comment.req.body.comment }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Comment deleted!')
    })
  })

  // SEARCH SECTION
  app.get('/search', isLoggedIn, function (req, res) {
    let category = ObjectId(req.params.category)
    console.log(category)
    db.collection('repositories').find({ type: 'repo', category: category }).toArray((err1, repos) => {
      console.log(repos)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err2, infoFromUser) => {
        db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('search.ejs', {
            user: req.user.local,
            info: infoFromUser,
            projects: repos
          })
        })
      })
    })
  });

  app.get('/searchPage/:cat', isLoggedIn, function (req, res) {
    // let searchId = (req.body.searchId).toLowerCase()
    let catId = req.params.cat
    console.log(catId)
    db.collection('repositories').find({ category: catId }).toArray((err1, search) => {
      console.log('SEARCH RESULT', search)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err2, infoFromUser) => {
        db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('searchPage.ejs', {
            user: req.user.local,
            info: infoFromUser,
            search
          })
        })
      })
    })
  });

  //Search Results Page  
  // RESULT RENDER PAGE
  app.get('/projectsFrame', isLoggedIn, function (req, res) {
    db.collection('repositories').find({ type: 'repo' }).toArray((err1, repos) => {
      console.log(repos)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err2, infoFromUser) => {
        db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('projectsFrame.ejs', {
            user: req.user.local,
            info: infoFromUser,
            projects: repos
          })
        })
      })
    })
  });
  // app.get('/projectsFrame', isLoggedIn, function (req, res) {
  //   db.collection('repositories').find({ type: 'repos' }).toArray((err1, repos) => {
  //     console.log('GET PROJECT FRAME IS WORKING',repos)
  //     db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err2, infoFromUser) => {
  //       db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
  //         if (err) return console.log(err)
  //         res.render('projectsFrame.ejs', {
  //           user: req.user.local,
  //           info: infoFromUser,
  //           projects: repos
  //         })
  //       })
  //     })
  //   })
  // });

  // EVENTS SECTION
  app.get('/events', function (req, res) {
    db.collection('repositories').find({ creator: req.user.local.email }).toArray((err1, repos) => {
      console.log(repos)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err2, infoFromUser) => {
        db.collection('events').find({ type: 'event' }).toArray((err, result) => {
          console.log('EVENTS', result)
          if (err) return console.log(err)
          res.render('events.ejs', {
            user: req.user.local,
            info: infoFromUser,
            projects: repos,
            events: result
          })
        })
      })
    })
  });

  app.get('/eventPage/:eventId', isLoggedIn, function (req, res) {
    let eventId = ObjectId(req.params.eventId)
    console.log(eventId)
    db.collection('events').find({ _id: eventId }).toArray((err, result) => {
      console.log(result[0])
      if (err) return console.log(err)
      res.render('eventPage.ejs', {
        events: result[0],
        user: req.user.local
      })
    })
  })

  app.get('/newEvent', isLoggedIn, function (req, res) {
    db.collection('repositories').find({ creator: req.user.local.email }).toArray((err1, repos) => {
      console.log(repos)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err1, infoFromUser) => {
        db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('newEvent.ejs', {
            user: req.user.local,
            info: infoFromUser,
            projects: repos,
            events: result
          })
        })
      })
    })
  });
  app.post('/newEvent', upload.single('file-to-upload'), (req, res) => {
    let user = req.user._id
    db.collection('events').save({ type: 'event', img: 'images/uploads/' + req.file.filename, creator: req.user.local.email, creatorId: user, eventName: req.body.eventName, eventDescription: req.body.eventDescript, eventLocation: req.body.eventLocation, eventDate: req.body.eventDate }, (err, result) => {
      console.log(result)
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/events')
    })
  })
  app.delete('/deleteEvent', (req, res) => {
    let eventId = ObjectId(req.body.eventId)
    console.log(eventId)
    db.collection('events').findOneAndDelete({ _id: eventId }, (err, result) => {
      if (err) return res.send(500, err)
      res.redirect('/events')
    })
  })
  // ABOUT PAGE
  app.get('/about', isLoggedIn, function (req, res) {
    db.collection('repositories').find({ creator: req.user.local.email }).toArray((err1, repos) => {
      console.log(repos)
      db.collection('userPortfolioInfo').find({ email: req.user.local.email }).toArray((err2, infoFromUser) => {
        db.collection('users').find({ email: req.user.local.email }).toArray((err, result) => {
          if (err) return console.log(err)
          res.render('about.ejs', {
            user: req.user.local,
            info: infoFromUser,
            projects: repos
          })
        })
      })
    })
  });



  // AUTH
  app.get('/signIn', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/portfolioPage',
    failureRedirect: '/signIn',
    failureFlash: true
  }));


  app.get('/signUp', function (req, res) {
    res.render('signUp.ejs', { message: req.flash('signupMessage') });
  });


  app.post('/signUp', passport.authenticate('local-signup', {
    successRedirect: '/portfolioPage',
    failureRedirect: '/signUp',
    failureFlash: true
  }));



  app.get('/unlink/local', isLoggedIn, function (req, res) {
    const user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/userProfile');
    });
  });

};


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}



var express = require('express');
var admin = require("firebase-admin");
var path = require("path");
var bodyParser = require('body-parser');
var firebase = require('firebase');
var session = require("express-session");

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: "fypproject-acd2d",
		clientEmail: "firebase-adminsdk-bjrxy@fypproject-acd2d.iam.gserviceaccount.com",
		privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDJFVm4ijx18t2t\ns42cz24mRzh3bGPfj1fVXoOTPOezBAblfl6ApizmMJsJENWXe/E7pW/8sREy3Pse\n1NNS7LKXJNBfXwREwJk3eJB3ZvibXJf4oCVY5ucpWnneTRmWowjgEj7hn3OV8roU\nr7whj8qsAbdnNamNGGZS8yhTCBt410a5UxKg+RHOm7eevNlImfkpOLzOFR4v8/RM\nPC5SQXWmU2EOMxqEASnjWn8TcnkvbuRvFAsYO9Z51ivAteQ1F2lEz3v1VlYS4vm4\nmTX2YiXYEiqq0Yx6K9LDD6ctntCe65+dtwqmVwF4Rw/bHEH7h86QsNOt+/sY5vp8\nuUtIx3VbAgMBAAECggEBALEgZn0A/8siGRVGQarsqWl8eQfxaXRnLwabj6kmEC8H\nkA+dph8KwigujpKIyqz6l39j9maPjsfQEkCRVmkIaTRsUESCTR9GzHApepBDGyC3\nioKOhvdtxhgOQ6WHItAnYs0GJW/XZhiizDkmp8CkifHEPUrj4SuRX6kX2eByFsj0\nvpUmyadpmykQl5vGGFHfWWBAl+ak+ZwKtuiuN+LKK71BwSXHqJa2YqvZte+XXREw\nwaFcMLbHTIwAKB2yE0jnwrWHPbBYMxE83fC2TcuM8zEDKNHQCnONm4KczGTMqo2w\napNBy7x9UjGOJp7Xgh1k6YqQfR+nMwEwe6o/uDehrgECgYEA/Q2l6Ef6YZTfgFfg\nEc2ojHEiIYiR5E3SsbifB/soF3m7G2YhZv3ym7kfWnfmumDnWfxf+SCrnPe2VhD9\n5ajeVt4c1a6KjN75QpkGzWTYwV53VZLbqnVGZYY2jVi1rQFP/vE7BXwX+mjLJLIK\nsFVt25WL5RbidgMZbpW2U+1jkwECgYEAy2zHs9EQBlhg+QuwiSGSRI625VBEUALv\nXPbzaW4Qr+sJhxuJLcAgfcGXsli60JUPF2PBZUPb7wL3TF4wecdMoBdostiGBBPv\nm6YhtkHjuGBMyAHppr2IBJGjlc4BgnfjWat3oUom+woAYHClQZNEku+tLeoZWlWx\ndp9SULqGNFsCgYAKfa9cIufJdd+SNZJvioQrVmFg3IWX3nYWsh29ufbeikhsiV5n\nI64UMKeRG5lwLqZIv8LG1EjpGAfyJ4AvLkIRfeHaJgNOdcwFq8xxZXXrBlySKqV6\nuqPxf4/xajUV+BD189BLmOpxkjihy9PPnasRSHDlTX6T/+rk/8XwUs4nAQKBgQC1\n3vaYtKRQF/nzD1lw8PvVoYaxdFbu9gDNK9ip/QacUVW+XocByVEDPe8DO8MiMvJA\nJibFA6uBgDRbKabLabz/MI6hv2XqBWzmytw/F5+huy9KbjNYqQEPnKoViA3feJJi\nHCQjpqk9Lk7x6iRFgYYAnJpHf5HVKuIzvPOaS3krGwKBgQD46RPRiRzs4Siy7gvf\nNPO8J9aYQ1rfTLrSin9q8kA8oZJL+kqQQD3s23WugHhF+wR2cX91ueqTKjDHuao5\n2SucRG/QGF59mQHIqvUg9l73jwaQTbelU7Lk1zhYCXV9mmYqZcSu/OoOBERloy8p\nNsZ9oTAIEl394VHQmEWCKA3xIw==\n-----END PRIVATE KEY-----\n"
	}),
	databaseURL: "https://fypproject-acd2d.firebaseio.com"
});


var config = {
	apiKey: "AIzaSyAZo1G2k8H57D6biUecI5rCSloZrPa6Auo",
	authDomain: " fypproject-acd2d.firebaseapp.com",
	databaseURL: "https://fypproject-acd2d.firebaseio.com"
};

firebase.initializeApp(config);

var server = express();
server.use(bodyParser.urlencoded({
	extended: true
}));
server.use(bodyParser.json());
server.use(session({
	secret: 'keyboard',
	resave: false,
	saveUninitialized: true,
	cookie:{maxAge: 60000}
}));
//server.use("/views", express.static(__dirname + '/views'));
server.use("/css", express.static(__dirname + '/css'));
server.use("/js", express.static(__dirname + '/js'));
server.use("/image", express.static(__dirname + '/image'));
server.use("/views", express.static(__dirname + '/views'));
server.use(express.static('/public'));

server.set('view engine', 'ejs');
var firebaseAuth = firebase.auth();
var firebaseDB = firebase.database();

var sessionData = null;

server.get('/', function(req, res) {
	if(!sessionData) {
		return res.status(200).sendFile('login.html', {root: __dirname + "/public" });
	} else {
		return res.redirect('/homepage');
	}
});

server.post('/login', function(req, res) {
	var userEmail = req.body.user.email;
	var userPassword = req.body.user.password;
	getTeacherEmail(userEmail, function(userId){
		if (userId == null) {
			console.log("Invalid User. You cannot enter the homepage");
			return res.redirect('/');
		} else {
			login(userEmail, userPassword, function(result) {
				if(result) {
					sessionData = req.session;
					sessionData.teacherId = userId;
					sessionData.courseId = [];
					getTeacherCourseCode(userId, function() {
						return res.redirect('/homepage');
					});
				}else {
					return res.redirect('/');
				}
			});
		}
	});
});

server.post('/question', function(req, res) {
	console.log(req.body);

    increaseQuizQuestionCount(req.body.subject, function(index){
    	console.log(index);
    	insertQuizQuestion(req.body, index, function(){
    		console.log("Finish insertion");
    	});
    });

});

server.post('/createquickquiz', function(req, res) {
	console.log("createQuicQuiz");
	console.log(req.body);

	
	newQuizInsertion(req.body, function(quizId){
	  console.log("Finished Insertion");
	  req.body.quizId = quizId;
	 // console.log(req.body.quizId);
	  getLatestQuestionCount(req.body.subject, function(num) {
		 // This callback is working
	     req.body.question = [];
	     req.body.subject_total_count = num;
	     //console.log(req.body.subject_total_count);
	       generateRandomNumber(req.body.total_num_quiz, req.body.subject_total_count, null, function(arr){
	         var randNum = arr;
	   	     //console.log("callbackfrom Generate random NUm", randNum);
	   	    getNumQuestion(req.body.subject, randNum, function(questionNum) {
	   	    	
	   	       isValidQuizQuestion(req.body, questionNum);
	     });
	   });
	 });
	});
});

//This function is a mass!!!!
function isValidQuizQuestion(quizInfo, quizArray) {
	//console.log("isValudQ IS CALLED");
	var easyNum = parseInt(quizInfo.easy);
	var mediumNum = parseInt(quizInfo.medium);
	var hardNum = parseInt(quizInfo.hard);
	var maxNum = parseInt(quizInfo.total_num_quiz);
	var questionToInsert = quizInfo.question;

	for(var i = 0; i < quizArray.length; i++) {
	  var mode = quizArray[i].difficulty;
    // Condition 2 easy, 1 medium, 1 hard
      var isValidMode = false;
      switch(mode) {
      	case "Easy":
      	     easyNum--;
      	     isValidMode = checking(easyNum);
      	     break;
      	case "Medium":
      	     mediumNum--;
      	     isValidMode = checking(mediumNum);
      	     break;
      	case "Hard":
      	     hardNum--;
      	     isValidMode = checking(hardNum);
      	     break;
      	default:
      	     console.log("error");
      	     break;
      }

      if(isValidMode) {
      	maxNum--;
      	questionToInsert.push(quizArray[i].index);
      }
    }
    var updatedQuiz = {
      easy: easyNum,
      medium: mediumNum,
      hard: hardNum,
      subject: quizInfo.subject,
      total_num_quiz: maxNum,
      question: questionToInsert,
      subject_total_count: quizInfo.subject_total_count,
      quizId: quizInfo.quizId
    };
    //console.log("The updatedQuiz", updatedQuiz);
    auxiliaryQuiz(updatedQuiz);
}

function auxiliaryQuiz(updatedQuizInfo) {
    if (updatedQuizInfo.total_num_quiz > 0) {
    	 generateRandomNumber(updatedQuizInfo.total_num_quiz, updatedQuizInfo.subject_total_count,  updatedQuizInfo.question, function(arr){
	   	  console.log("second randomnumber");
	   	  var randNum = arr;  	
	   	  getNumQuestion(updatedQuizInfo.subject, randNum, function(questionNum) {
	   	 // console.log(questionNum.length);
	   	  isValidQuizQuestion(updatedQuizInfo, questionNum);
	     });
	   });
    } else {
    	//console.log("done finished all question are searched");
    	updateQuiz(updatedQuizInfo, function() {
    		console.log("update done");
    	});
    }
}

function updateQuiz(quizInfo, callback) {
	var questionNum = {};
	for(var i = 0; i < quizInfo.question.length; i++) {
		questionNum['question_' + [i]] = quizInfo.question[i];
	}
	var path = '/quiz' + '/' + quizInfo.subject.toLowerCase() + '/' + quizInfo.quizId + '/' +'questionNum';
	firebaseDB.ref(path).update(questionNum).
	then(function(){
		callback();
	});
}

function newQuizInsertion(quiz, callback) {
	const root = '/quiz';
	var path = root + '/' + quiz.subject.toLowerCase();
	var ref = firebaseDB.ref(path).push();
	    ref.set({
	    id: ref.key,
	    subject: quiz.subject,
	    easy: parseInt(quiz.easy),
	    medium: parseInt(quiz.medium),
	    hard: parseInt(quiz.hard),
	    author: sessionData.teacherId,
	    start_time: quiz.quizStartTime,
	    time_limit: quiz.quizTimeLimit,
	    date: quiz.date,
	    random_question_sequence: (quiz.random_question_sequence == 'true'),
	    random_answer_sequence: (quiz.random_answer_sequence == 'true'),
	    totalNum: parseInt(quiz.total_num_quiz)
	    }).then(function() {
		callback(ref.key);
	});	
}

function checking(count) {
	//Working
	//console.log("checking");
	if(count >= 0) {
		return true;
	} else {
		return false;
	}
}

function getNumQuestion(subject, arr, callback) {
	const root = '/quiz_question';
	var path = root + '/' + subject.toLowerCase();
	var question = [];
	for(var i = 0; i < arr.length ; i++) {
		firebaseDB.ref(path).orderByChild('index').startAt(arr[i]).limitToFirst(1).once('value')
		.then(function(snapshot) {
			snapshot.forEach(function(childSnapShot) {
				if (childSnapShot.exists()) {
					//console.log("the data is exist");
				  	question.push(childSnapShot.val());
			   }
			});
			if (question.length === arr.length) {
				//console.log("length done callback");
				callback(question);
			}
		});
	}
}

function generateRandomNumber(num, totalNum, storedQuestion, callback) {
	const minNum = 1;
	var arr = [];
	var requiredNum = multiplySearchNum(num);
	//console.log("After multiple requiredNum", requiredNum);
	var max = parseInt(totalNum);
	var stored = storedQuestion;
	//console.log("The stored array is", stored);
	while(arr.length < requiredNum) {
		var randomnumber = Math.ceil(Math.random() * max);
		if(arr.indexOf(randomnumber) > -1 || arr.indexOf(stored) > -1) continue;
		arr[arr.length] = randomnumber;
	}
	callback(arr);
}

function multiplySearchNum(num) {
	//modify later////
	var x = parseInt(num);
	if (x < 5) {
		x = x * 5;
	} else {
		x = x * 2;
	}
	return x;
}

function insertQuizQuestion(quiz, index, callback) {
	var subLowerCase = quiz.subject.toLowerCase();
	const root = "/quiz_question";
	var path = root + "/" + subLowerCase;
	console.log(path);
	//var quizRef = firebaseDB.ref('quiz_question').push();
	if (quiz.type == "Single" || quiz.type == "Multiple") {
	    firebaseDB.ref(path).push().set({
	    index: index,
		question: quiz.question,
		author: sessionData.teacherId,
		difficulty: quiz.difficulty,
		type: quiz.type,
		answer: quiz.answer,
		numOfAnswer: quiz.choices
	    }).then(function() {
		
            callback();
	});
	} else {
		firebaseDB.ref(path).push().set({
		index: index,
		question: quiz.question,
		author: sessionData.teacherId,
		difficulty: quiz.difficulty,
		type: quiz.type,
	    }).then(function() {
	       callback();
	  });
	}
}

function increaseQuizQuestionCount(subject,callback) {
	const root = "/count/quiz_subject_count";
	var path = root + "/" + subject.toLowerCase();
	var countRef = firebaseDB.ref(path);
	countRef.transaction(function (current_value) {
		if (current_value != null) {
			callback(current_value + 1);
		}
		return(current_value || 0) + 1;
	});
}

function getLatestQuestionCount(subject, callback) {
	const root = "/count/quiz_subject_count";
	var path = root + "/" + subject.toLowerCase();

   firebaseDB.ref(path).once('value').
   then(function(snapshot){
   	  callback(snapshot.val());
   });
}

function getTeacherEmail(email, callback) {
	firebaseDB.ref('/teachers').orderByChild('email').equalTo(email).once('value')
	.then(function(snapshot) {
		var x = null;
		snapshot.forEach(function(childSnapShot) {
			if (childSnapShot.exists()) {
				x = childSnapShot.child('id').val();
			}
		});
		callback(x);
		return;
	});
}

function login(email, password, callback) {
	var isValidUser = false;
	firebaseAuth.signInWithEmailAndPassword(email,password)
	.then(function(userRecord){
		//console.log("Successfully fetched user data:", userRecord.toJSON());
		isValidUser = true;
		callback(isValidUser);
		return;
	})
	.catch(function(error){
		console.log("Error fetching user data:", error);
		callback(isValidUser)
		return;
	});
}

function getTeacherCourseCode(id, callback) {
	var x = 0;
	firebaseDB.ref('/courses').orderByChild('lecturerId').equalTo(id).once('value')
	.then(function(snapshot){
		snapshot.forEach(function(childSnapShot) {
			if (childSnapShot.exists()) {
				sessionData.courseId.push(childSnapShot.child('id').val());
				x++;
			}

			if( x === snapshot.numChildren()) {
				callback();
			}
		});
	});
}

function getStudentQuiz(courseId, callback) {
	//console.log("get Student Quiz function");
	var course = courseId.toLowerCase();
	var quizAnswerSheet = [];
	firebaseDB.ref('/quiz_answer_sheet/' + course).once('value')
	.then(function(snapshot) {
		snapshot.forEach(function(snapshot){
			var quiz = snapshot.val();
			quiz.key = snapshot.key;
			quizAnswerSheet.push(quiz);
			//console.log(quiz);
		});
		console.log("after for loop");
		callback(quizAnswerSheet);
	});
}

function getQuizDetail(courseId, key, callback) {
	var course = courseId.toLowerCase();
	console.log(key);
	firebaseDB.ref('/quiz_answer_sheet/' + course).orderByKey().equalTo(key).once('value')
	.then(function(snapshot) {
		console.log("inside then");
		//console.log(snapshot.val());
		snapshot.forEach(function(childSnapShot) {
			if(childSnapShot.exists())  {
				var x = childSnapShot.val();
				callback(x);
			}
		})
	});
}

function getEechQuestion(courseId, questionNum, callback) {
	var listOfQuestion = [];
	console.log(questionNum);
	for(var num in questionNum) {
	firebaseDB.ref('/quiz_question/' + courseId.toLowerCase()).orderByChild('index').equalTo(questionNum[num]).once('value')
	.then(function(snapshot) {
		//console.log("get each question inside then");
		snapshot.forEach(function(childSnapShot) {
			if (childSnapShot.exists()) {
				listOfQuestion.push(childSnapShot.val());
				//console.log("get each question childSnapShot");
			}
		})
		console.log(listOfQuestion.length);
		if(questionNum.length === listOfQuestion.length) {
			console.log("callback is call in get each question")
			callback(listOfQuestion);
		}
	});
  }
}

function setQuizAndAnswerSheet(answerSheet, quizQuestion, callback) {
	for(var x in quizQuestion) {
		quizQuestion[x].correctAnswer = answerSheet.correct_answer[x];
		quizQuestion[x].studentAnswer = answerSheet.student_answer[x];
		quizQuestion[x].isMarked = answerSheet.marked;
		//console.log(quizQuestion[x].isMarked);
	}
	callback(quizQuestion);
}

function setAnswerToInt(quizQuestion, callback) {
	const single = "Single";
	const multiple = "Multiple";
	//console.log("setAnswerToInt");
	//console.log(quizQuestion.length);
	for (var i in quizQuestion) {
		//console.log("inside for loop");
		console.log(quizQuestion[i].type);
		if (quizQuestion[i].type == single) {
			//console.log("inside single");
		  quizQuestion[i].answerInt = convertAnswerToInteger(quizQuestion[i].answer);
	      console.log(quizQuestion[i].answerInt);
    	} else if(quizQuestion[i].type == multiple) {
    		//console.log("inside multiple");
    		quizQuestion[i].answerInt = [];
    		for(var y in quizQuestion[i].answer) {
    			quizQuestion[i].answerInt.push(convertAnswerToInteger(quizQuestion[i].answer[y]));
    		}
    	}
    	//console.log(quizQuestion[i]);
    }
    callback(quizQuestion);
}

function checkAuth(req, res, next) {
  if (!sessionData) {
  	res.send('You are not authorized to view this page');
  } else {
    next();
  }
}


function updateQuizAnswerSheet(updatedObject, callback) {
	firebaseDB.ref('/quiz_answer_sheet/' + updatedObject.courseId.toLowerCase() + '/' + updatedObject.key).update({
		marked:true,
		multipleChoice: updatedObject.multipleChoice,
		comment: updatedObject.comment,
		score: updatedObject.score
	}).then(function() {
		callback();
	});
}

function convertAnswerToInteger(stringNum) {
	var x = "error";
	switch(stringNum) {
    case 'Zero':
         x = '0';
         break;
    case 'One':
        x = '1';
         break;
    case 'Two':
        x = '2';
         break;
    case 'Three':
        x = '3';
         break;
    case 'Four':
        x = '4';
         break;
    case 'Five':
        x = '5';
         break;
    default:
        x = "error";
        break;  }
    return parseInt(x);
}

///:courseId/quiz
server.post('/:courseId/quiz', checkAuth, function(req, res) {
	//console.log("----------------");
	//console.log(req.body);
	//console.log("----------------");
	updateQuizAnswerSheet(req.body, function() {
		//console.log("xxxx");
	})
	res.redirect('/homepage');
});

server.get('/homepage', checkAuth, function(req, res) {
	res.render('homepage');
	//console.log(sessionData.courseId);
});

server.get('/singlequestion', checkAuth, function(req, res) {
	res.render('singlequestionpage', {subject:sessionData.courseId});
});

server.get('/multiplequestion', checkAuth, function(req, res) {
	res.render('multiplequestionpage', {subject:sessionData.courseId});
});

server.get('/openquestion', checkAuth, function(req, res) {
	res.render('openquestionpage', {subject:sessionData.courseId});
});

server.get('/quickquiz', checkAuth, function(req, res) {
	res.render('oneclickcreatequizpage', {subject:sessionData.courseId});
});

server.get('/quizcoursecatalogpage', checkAuth, function(req, res) {
	res.render('quizcoursecatalogpage', {subject:sessionData.courseId});
});

server.get('/quizcatalog/:courseId', checkAuth, function(req, res) {
	//console.log(req.params.courseId);
	getStudentQuiz(req.params.courseId, function(result) {
		//console.log(result.length);
		res.render('quizcatalogpage', {quizAnswerSheet: result, courseId:req.params.courseId});
		
	});
});

server.get('/:courseId/quiz' , checkAuth, function(req, res) {
	//console.log(req.query.id);
	//console.log(req.params.courseId);
	var courseId = req.params.courseId;
	var key = req.query.key;
	getQuizDetail(courseId, key, function(result) {
		//console.log(result);
		var savedAnswerSheet = result;
		getEechQuestion(courseId, savedAnswerSheet.question_num, function(result) {
			var listQuestion = result;
			//console.log("Finished executing");
			setQuizAndAnswerSheet(savedAnswerSheet, listQuestion, function(questions){
				//console.log("Finished combination of object");
				setAnswerToInt(questions, function(result) {
				   //console.log("finish Conversion");
					res.render('quiz', {question: result, courseId:courseId, key:key});
				});
			});
		});
	});
});

server.get('/logout',function(req,res){
	req.session.destroy(function(err) {
		if(err) {
			console.log(err);
		} else {
			sessionData = null;
			res.redirect('/');
		}
	});
});


server.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

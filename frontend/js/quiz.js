const user = JSON.parse(sessionStorage.getItem("user"));
if (!user) location.replace("./index.html");

const url = `https://quiz-backend-lokendra-debug.vercel.app`;

let params = new URLSearchParams(window.location.search);
let quizID = params.get("quiz");

let flag = true;
let userScore = 0;
let questionNo = 1;
let Quiz;
let multichoice = [];
let multiFlag = true;
let increamentSocre = false;

let quiztitle = document.getElementById("quiztitle");
let totalScore = document.getElementById("totalScore");
let quizdescription = document.getElementById("quizdescription");
let question = document.getElementById("question");
let options = document.querySelectorAll(".quizOptions > button");
let nextBtn = document.getElementById("nextBtn");

function getQuiz() {
  fetch(`${url}/getquiz/${quizID}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk || data.isOK) {
        Quiz = data.quiz;
        setData();
      } else {
        alert(data.msg);
        setTimeout(() => {
          location.replace("./dashboard.html");
        }, 1000);
      }
    })
    .catch((err) => {
      console.log(err);
      alert("something went wrong, please retry");
      setTimeout(() => {
        location.replace("./dashboard.html");
      }, 1000);
    });
}

function setData() {
  quiztitle.innerText = Quiz.title;
  quiztitle.style.color = "green";
  totalScore.innerText = `${userScore}/${Quiz.questions.length * 10}`;
  quizdescription.innerText = Quiz.description;
  question.innerText = `Q : ${questionNo} ->  ${
    Quiz.questions[questionNo - 1].title
  }`;

  let [a, b, c, d] = Quiz.questions[questionNo - 1].answerOptions;
  let [A, B, C, D] = options;
  A.innerText = "1. " + a;
  B.innerText = "2. " + b;
  C.innerText = "3. " + c;
  D.innerText = "4. " + d;
}

function setEvent() {
  for (let i of options) {
    i.addEventListener("click", (e) => {
      let id = e.target.id;
      let ans = Quiz.questions[questionNo - 1].correctOptions;
      if (ans.length == 1 && flag) {
        if (ans[0] == id) {
          userScore += 10;
          flag = false;
          totalScore.innerText = userScore + "/" + Quiz.questions.length * 10;
          document
            .getElementById(id)
            .setAttribute("style", "color: green;border: 1px solid green;");
        } else {
          flag = false;
          document.getElementById(id).setAttribute("style", "color: red;border: 1px solid red;");
          document.getElementById(ans[0]).setAttribute("style", "color: green;");

        }
      } else if (ans.length > 1 && flag) {
        let [a, b, c, d] = ans;

        if (a == id || b == id || c == id || d == id) {
          if (multichoice.length == ans.length - 1) {
            increamentSocre = true;
          } else if (!multichoice.includes(id)) {
            multiFlag = false;
            multichoice.push(id);
          }
          document
            .getElementById(id)
            .setAttribute(
              "style",
              "color: green;background-color: rgb(239, 248, 239);border: 1px solid green;"
            );
        } else {
          increamentSocre = false;
          flag = false;
          document.getElementById(id).setAttribute("style", "color: red;border: 1px solid red;");
          for(let i of ans){  
            document.getElementById(i).setAttribute("style", "color: green;");
          }

        }   
      }
    });
  }
  nextBtn.addEventListener("click", () => {
    if (flag && multiFlag) {
      alert("Please Select Atleast 1 option");
      return;
    }
    if (increamentSocre) {
      userScore += 10;
      totalScore.innerText = userScore + "/" + Quiz.questions.length * 10;
      increamentSocre = false;
    }

    flag = true;
    multichoice = [];
    for (let i of options) {
      i.setAttribute("style", "color: black;");
    }
    if (nextBtn.innerText == "NEXT") {
      if (questionNo == Quiz.questions.length - 1) {
        nextBtn.innerText = "Submit";
      }

      if (questionNo < Quiz.questions.length) {
        questionNo += 1;
      }
      setScore()
    } else {
      let x = Quiz.leaderboard.filter((el) => el.email == user.email);
      if (x.length == 0) {
        fetch(`${url}/setScore/${Quiz._id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: user.email, score: userScore }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.isOK || data.isOk) {
              alert("Quiz ended !");
              setTimeout(() => {
                location.replace("./dashboard.html");
              }, 1000);
            } else {
              alert("Something went wrong, Try again to submit!");
            }
          })
          .catch((err) => {
            console.log(err);
            alert("Something went wrong, Try again to submit!");
          });
      } else {
        alert("Quiz ended !");
        setTimeout(() => {
          location.replace("./dashboard.html");
        }, 1000);
      }
    }
  });
}

if (!quizID) {
  alert("something went wrong, please retry");
  location.replace("./dashboard.html");
} else {
  getQuiz();
  setEvent();
}


function setScore(){
  let x = Quiz.leaderboard.filter((el) => el.email == user.email);
  if (x.length == 0) {
    fetch(`${url}/setScore/${Quiz._id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: user.email, score: userScore }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.isOK || data.isOk) {
        setData();
      } else {
        alert("Something went wrong, try again!");
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Something went wrong, Try again!");
    });
  }
  else{
    setData()
  }
}



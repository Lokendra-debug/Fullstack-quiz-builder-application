const url = "https://quiz-backend-lokendra-debug.vercel.app";

const user = JSON.parse(sessionStorage.getItem("user"));
if (!user) location.replace("./index.html");
else getQuiz();
document.getElementById("username").innerText = user.email.split(".")[0];

let AddQuestionBtn = document.getElementById("AddQuestionBtn");
let QuizSubmitBtn = document.getElementById("submitQuizBtn");
QuizSubmitBtn.style.display = "none";

let heading = document.getElementById("heading")
let mainCont = document.querySelector("#mainCont");

let CreateQuizBtn = document.getElementById("createQuiz");
let createform = document.getElementById("popup");
let cancelCreateQuizBtn = document.getElementById("CancelCreate");
let form = document.querySelector("form");

let totalcount = document.getElementById("totalquestionCount");
let questioncount = document.getElementById("questioncount");
let QuestionTitle = document.getElementById("questiontitle");

// editing wala
let currentEditQuiz;
let editPopup = document.getElementById("editPopup");

let CorrectOpts = document.querySelectorAll('input[type="checkbox"]');
let opt1 = document.getElementById("ans1");
let opt2 = document.getElementById("ans2");
let opt3 = document.getElementById("ans3");
let opt4 = document.getElementById("ans4");

let quizDescription = document.getElementById("quizdescription");
let quizTitle = document.getElementById("quiztitle");

/// editing material
let currentQuestion = 0;
let editQuiztitle = document.querySelector("#editPopup #quiztitle");
let editQuizDesc = document.querySelector("#editPopup #quizdescription");
let editTotalQuestion = document.querySelector(
  "#editPopup #totalquestionCount"
);
let editCancelBtn = document.querySelector("#editPopup #CancelCreate");
let EditQuestionTitle = document.querySelector("#editPopup #questiontitle");
let editquestioncount = document.querySelector("#editPopup #questioncount");
let editoptions = document.querySelector("#editPopup ");
let editopt1 = document.querySelector("#editPopup #ans1");
let editopt2 = document.querySelector("#editPopup #ans2");
let editopt3 = document.querySelector("#editPopup #ans3");
let editopt4 = document.querySelector("#editPopup #ans4");
let editCorrectOptions = document.querySelectorAll(
  "#editPopup input[type='checkbox']"
);
let editnextBtn = document.getElementById("next");
let editpreviousBtn = document.getElementById("previous");
let editCorrectOptionsDiv = document.querySelector(".CorrectOptions");
let editform = document.querySelector("#editPopup form");
let editSaveBtn = document.getElementById("savebtn");

editSaveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let flag = true
  if(editQuiztitle.value == "" || !editQuiztitle.value || editQuizDesc.value == "" || !editQuizDesc.value){
    alert("Quiz Title and Description both  are reqiured !")
    flag = false;
    return
  }
  if (changeData() && flag) {
    fetch(`${url}/updateQuiz`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(currentEditQuiz),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isOk || data.isOK) {
          alert(data.msg);
          hideEdit();
        } else {
          console.log(data);
          alert(data.msg);
          return
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong!");
      });
  }
});

CreateQuizBtn.addEventListener("click", () => {
  let count = 0;
  totalcount.innerText = count;
  questioncount.innerText = count + 1;
  createform.style.display = "flex";
  let quizModel = {
    creator: user.email,
    title: "",
    description: "",
    questions: [],
    leaderboard: [],
  };

  let correctOptions = [];

  let temp = {
    title: "",
    answerOptions: [],
    correctOptions: [],
  };

  for (let o of CorrectOpts) {
    o.addEventListener("click", (e) => {
      let a = e.target.dataset.id;
      let x = correctOptions.includes(a);
      if (e.target.checked) {
        if (!x) correctOptions.push(a);
      } else {
        if (x) {
          correctOptions = correctOptions.filter((el) => el != a);
        }
      }
    });
  }

  AddQuestionBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let flag = true;

    let titlE = QuestionTitle.value;
    let optionss = [opt1.value, opt2.value, opt3.value, opt4.value];
    if(count >=10){
      alert('You can add only 10 question in a quiz!')
      return
    }
    if (titlE == "" || !titlE) {
      flag = false;
      alert("Please fill in the Question Title!");
      return;
    } else if (optionss.includes("") || optionss.includes(undefined || null)) {
      flag = false;
      alert("Please fill in all the options!");
      return;
    } else if (correctOptions.length < 1) {
      flag = false;
      alert("Please select atleast one correct option!");
      return;
    }

    if (flag) {
      temp.title = titlE;
      temp.answerOptions = optionss;
      temp.correctOptions = correctOptions;

      quizModel.questions.push(temp);

      count++;
      if (count >= 2) {
        QuizSubmitBtn.style.display = "block";
      }
      form.reset();
      totalcount.innerText = count;
      questioncount.innerText = count + 1;

      temp = {
        title: "",
        answerOptions: [],
        correctOptions: [],
      };

      correctOptions = [];
    }
  });

  QuizSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let flag = true;

    if (quizTitle.value == "") {
      flag = false;
      alert("please fill in the Quiz Title!");
    } else if (quizDescription.value == "") {
      flag = false;
      alert("please fill in the Quiz Description!");
    }

    if (flag) {
      quizModel.title = quizTitle.value;
      quizModel.description = quizDescription.value;

      addQuiz(quizModel);

      quizModel = {
        creator: user.email,
        title: "",
        description: "",
        questions: [],
        leaderboard: [],
      };
      createform.style.display = "none";
    }
  });
});

cancelCreateQuizBtn.addEventListener("click", () => {
  quizTitle.value = "";
  quizDescription.value = "";
  form.reset();
  createform.style.display = "none";
});

function addQuiz(quiz) {
  fetch(`${url}/createquiz`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(quiz),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk || isOK) {
        alert("Quiz Created Successfully");
        setTimeout(() => {
          getQuiz();
        }, 1000);
      } else {
        alert(data.msg);
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Something went wrong!");
    });
}

function getQuiz() {
  fetch(`${url}/getquiz`)
    .then((res) => res.json())
    .then((data) => {
      if (data.quizes.length == 0 && (data.isOk || data.isOK )) {
        mainCont.innerHTML = "";
        heading.innerHTML =
          "<h1 style='text-align:center; margin-top:60px'>There is no quiz availble..... <br> Refresh the page once.</h1>";
        } else if (data.isOK) {
          heading.innerHTML = ""
          mainCont.innerHTML = "";
          let html = `${data.quizes.map((el) => getQCard(el)).join("")}`;
          mainCont.innerHTML = html;
          setEvent();
        } else {
          alert(data.msg);
          mainCont.innerHTML = "";
          heading.innerHTML =
            "<h1 style='text-align:center; margin-top:60px'>There is no quiz availble.....<br> Refresh the page once.</h1>";
          }
        })
        .catch((err) => {
          alert("Unable to fetch Quizzes");
          mainCont.innerHTML = "";
          heading.innerHTML =
            "<h1 style='text-align:center; margin-top:60px'>There is no quiz availble.....<br> Refresh the page once.</h1>";
    });
}

function setEvent() {
  let btns = document.querySelectorAll(".btns");
  for (let btn of btns) {
    btn.addEventListener("click", (e) => {
      let id = e.target.dataset.id;

      if (btn.innerText == "EDIT") {
        editquiz(id);
      }
      if (btn.innerText == "DELETE") {
        del(id);
      }
      if (btn.innerText == "Take Quiz") {
        location.href = "./quiz.html?quiz=" + id;
      }
      if (btn.innerText == "Leaderboard") {
        location.href = "./leaderboard.html?quiz=" + id;
      }
    });
  }
}

function del(id) {
  fetch(`${url}/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.isOK || data.isOk) {
        alert(data.msg);
        getQuiz();
      } else {
        alert("something went wrong");
      }
    })
    .catch((err) => {
      console.log(err);
      alert("something went wrong");
    });
}

function getQCard(quiz) {
  let title = quiz.title.split(" ")[0];
  let x = (quiz.description.length <= 36)
  return `<div class ="qcard">
                    <h1>${title.toUpperCase()} QUIZ</h1>
                    <p class='nbold'>${quiz.description}  </p>
                    
                    <p class="bold">Created By : ${
                      user.email == quiz.creator ? "You" : quiz.creator
                    }</p>
                    <p class = "bold">Questions : ${quiz.questions.length}</p>
                    <div class="bothbtns">
                        <button class ='btns' data-id ="${quiz._id}" style='${x? "margin-top : 52px"  : "margin-top : 30px"} ;${
    user.email != quiz.creator ? "" : "background-color:#9a7b0b;"
  }'> ${user.email != quiz.creator ? "Take Quiz" : "EDIT"}</button>
                        <button class ='btns' data-id ="${quiz._id}"  style='${
    user.email != quiz.creator ? "" : "background-color:red;"
  }${x? "margin-top : 52px"  : "margin-top : 30px"};'>${user.email != quiz.creator ? "Leaderboard" : "DELETE"}</button>
                    </div>
                </div>
        `;
}

function logout() {
  sessionStorage.clear();
  location.replace("./index.html");
}

function editquiz(id) {
  fetch(`${url}/getquiz/${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk || data.isOK) {
        currentEditQuiz = data.quiz;
        setEditValue(0);
      } else {
        alert(data.msg);
      }
    })
    .catch((err) => {
      console.log(err);
      alert("Something went wrong!..");
    });
}

editnextBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentQuestion < currentEditQuiz.questions.length - 1) {
    let x = changeData();
    if (x) {
      currentQuestion += 1;
      setEditValue(currentQuestion);
    }
  }
});

editpreviousBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentQuestion > 0) {
    if (changeData()) {
      currentQuestion -= 1;
      setEditValue(currentQuestion);
    }
  }
});

editCancelBtn.addEventListener("click", () => {
  editform.reset();
  currentQuestion = 0;
  editPopup.style.display = "none";
});

function changeData() {
  currentEditQuiz.description = editQuizDesc.value;
  currentEditQuiz.title = editQuiztitle.value
  let temp = {
    title: "",
    answerOptions: [],
    correctOptions: [],
  };

  let correctOptions =
    currentEditQuiz.questions[currentQuestion].correctOptions;
  for (let o of editCorrectOptions) {
    let a = o.id;
    let x = correctOptions.includes(a) || correctOptions.includes(+a);
    if (o.checked) {
      if (!x) correctOptions.push(a);
    } else {
      if (x) {
        correctOptions = correctOptions.filter((el) => el != a || el != a);
      }
    }
  }

  let flag = true;

  let titlE = EditQuestionTitle.value;
  let optionss = [
    editopt1.value,
    editopt2.value,
    editopt3.value,
    editopt4.value,
  ];

  if (titlE == "" || !titlE) {
    flag = false;
    alert("Please fill in the Question Title!");
    return false;
  } else if (optionss.includes("") || optionss.includes(undefined || null)) {
    flag = false;
    alert("Please fill in all the options!");
    return false;
  } else if (editCorrectOptions.length < 1) {
    flag = false;
    alert("Please select atleast one correct option!");
    return false;
  }
  if (flag) {
    temp.title = titlE;
    temp.answerOptions = optionss;
    temp.correctOptions = correctOptions;

    currentEditQuiz.questions[currentQuestion] = temp;

    editform.reset();

    temp = {
      title: "",
      answerOptions: [],
      correctOptions: [],
    };
    correctOptions = [];
    // setEditValue()
    return true;
  }
}

function setEditValue(index) {
  if (index >= currentEditQuiz.questions.length) {
    return;
  }

  editPopup.style.display = "grid";
  editQuiztitle.value = currentEditQuiz.title;
  editQuizDesc.value = currentEditQuiz.description;
  editTotalQuestion.innerText = `${index + 1}/${
    currentEditQuiz.questions.length
  }`;

  EditQuestionTitle.value = currentEditQuiz.questions[index].title;

  editquestioncount.innerText = index + 1;

  let [a, b, c, d] = currentEditQuiz.questions[index].answerOptions;

  editopt1.value = a;
  editopt2.value = b;
  editopt3.value = c;
  editopt4.value = d;

  for (let i of editCorrectOptions) {
    let answers = currentEditQuiz.questions[index].correctOptions;
    if (answers.includes(i.id) || answers.includes(+i.id)) {
      i.checked = true;
    }
  }
}

function hideEdit() {
  editPopup.style.display = "none";
  currentQuestion = 0
  getQuiz();
}

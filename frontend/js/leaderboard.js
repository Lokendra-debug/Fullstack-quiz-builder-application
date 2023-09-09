let title = document.getElementById('title')
const user = JSON.parse(sessionStorage.getItem("user"));
if (!user) location.replace("./index.html");

let params = new URLSearchParams(window.location.search);
let quizID = params.get("quiz");

function getdata() {
  fetch("https://quiz-backend-lokendra-debug.vercel.app/getleaderboard/" + quizID)
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk || data.isOK) {
        title.innerText = data.title
        settable(data.leaderboard);
      } else {
        alert("something went wrong");
        location.replace("./dashboard.html");
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      alert("something went wrong");
      location.replace("./dashboard.html");
    });
}

function settable(data) {
  let body = document.querySelector("tbody");
  data = data.sort((a, b) => b.score - a.score);
  let html = `${data.map((el, i) => getcard(el, i)).join("")}`;
  body.innerHTML = html;
}

function getcard(el, i) {
  if (el.email == user.email) {
    document.querySelector("#rank").innerText = "Your Rank :- " + (i + 1);
  }

  return `
            <tr>
                <td>${i + 1}</td>
                <td>${el.email}</td>
                <td>${el.score}</td>
            </tr>
        `;
}

if (!quizID) {
  alert("something went wrong, please retry");
  location.replace("./dashboard.html");
} else {
  getdata();
}

document.getElementById('logo').addEventListener('click', ()=>{
    location.href = "./dashboard.html"
})
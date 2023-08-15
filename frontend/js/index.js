sessionStorage.clear();

let isregister = false;
let form = document.querySelector("form");
let rb = document.getElementById("rb");
let lb = document.getElementById("lb");
let h1 = document.querySelector("form h1");
let submitbtn = document.querySelector('input[type="submit"]');
let showpass = document.getElementById("hh");
let password = document.querySelector("#pass")
let email = document.querySelector("#email")

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (isregister) {
    fetch("https://quiz-server-27y4.onrender.com/user/register", {
      method: "POST",
      body: JSON.stringify({ email : email.value, password : password.value}),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isOk) {
          sessionStorage.setItem("user", JSON.stringify(data.user));
          alert(data.msg);
          location.href = "./dashboard.html";
        } else {
          alert(data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong!");
      });
  }
  else {
    fetch("https://quiz-server-27y4.onrender.com/user/login", {
      method: "POST",
      body: JSON.stringify({email : email.value, password : password.value}),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isOk) {
          sessionStorage.setItem("user", JSON.stringify(data.user));
          alert(data.msg);
          location.href = "./dashboard.html";
        } else {
          alert(data.msg);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("something went wrong!");
      });
  }
});



lb.addEventListener("click", (e) => {
  e.preventDefault();
  isregister = false;
  lb.setAttribute("style", "background-color: blue;color: white;");
  rb.setAttribute("style", "background-color: white;color: black;");
  h1.innerText = " - Wel-come Back -   ";
  submitbtn.value = "Login";
});

rb.addEventListener("click", (e) => {
  e.preventDefault();
  isregister = true;
  rb.setAttribute("style", "background-color: blue;color: white;");
  lb.setAttribute("style", "background-color: white;color: black;");
  h1.innerText = "Welcome To Quick Quiz";
  submitbtn.value = "Register";
});

showpass.addEventListener('click',(e)=>{
  if(e.target.checked){
    password.setAttribute("type", "text")
  }
  else password.setAttribute("type", "password")
})


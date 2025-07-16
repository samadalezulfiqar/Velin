// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDvEs6Ekhr6qeGrzVnhXNqxuZVFCdoszOI",
  authDomain: "velin-1f730.firebaseapp.com",
  projectId: "velin-1f730",
  storageBucket: "velin-1f730.appspot.com",
  messagingSenderId: "778561053449",
  appId: "1:778561053449:web:e4521c9b5e1f8dd79029d8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;

// ✅ Get all elements once
const authScreen = document.getElementById("authScreen");
const mainScreen = document.getElementById("mainScreen");
const chatArea = document.getElementById("chatArea");
const waveLabel = document.getElementById("waveLabel");
const themeToggle = document.getElementById("themeToggle");

// ✅ Theme Switch
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ✅ Sign In
function signIn() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {
      currentUser = userCred.user;
      showMainScreen();
    })
    .catch(err => alert(err.message));
}

// ✅ Sign Up
function signUp() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      currentUser = userCred.user;
      showMainScreen();
    })
    .catch(err => alert(err.message));
}

// ✅ Switch to Main UI
function showMainScreen() {
  authScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
}

// ✅ Join a Wave
function joinWave() {
  const waveName = document.getElementById("waveName").value.trim();
  if (!waveName) return;
  waveLabel.textContent = "Wave: " + waveName;
  loadWaveMessages(waveName);
}

// ✅ Load and Show Messages
function loadWaveMessages(waveName) {
  chatArea.innerHTML = "";
  const ref = db.ref("waves/" + waveName);
  ref.off(); // Remove old listeners

  ref.on("child_added", (snapshot) => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.className = "message";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = msg.avatar || "👤";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = msg.text;

    if (msg.uid === currentUser.uid) {
      bubble.classList.add("you");
    } else {
      bubble.classList.add("other");
    }

    div.appendChild(avatar);
    div.appendChild(bubble);
    chatArea.appendChild(div);
    chatArea.scrollTop = chatArea.scrollHeight;
  });
}

// ✅ Send a Message
function sendMessage() {
  const waveName = document.getElementById("waveName").value.trim();
  const text = document.getElementById("messageInput").value.trim();
  if (!waveName || !text) return;

  const ref = db.ref("waves/" + waveName);
  ref.push({
    uid: currentUser.uid,
    username: currentUser.email.split("@")[0],
    avatar: "👤",
    text: text,
    timestamp: Date.now()
  });

  document.getElementById("messageInput").value = "";
}

// ✅ Auto-login user
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    showMainScreen();
  } else {
    authScreen.classList.remove("hidden");
    mainScreen.classList.add("hidden");
  }
});
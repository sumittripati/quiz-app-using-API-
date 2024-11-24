// const quizData = [
//     {
//       question: "What is the capital of France?",
//       options: ["Berlin", "Madrid", "Paris", "Lisbon"],
//       correct: 2,
//     },
//     {
//       question: "Who is the founder of Microsoft?",
//       options: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates", "Elon Musk"],
//       correct: 2,
//     },
//     {
//       question: "What is 2 + 2?",
//       options: ["3", "4", "5", "6"],
//       correct: 1,
//     },
//     {
//       question: "Which language is used for web development?",
//       options: ["Python", "Java", "JavaScript", "C++"],
//       correct: 2,
//     },
//   ];
  
//   let currentQuestionIndex = 0;
//   let score = 0;
  
//   function loadQuestion() {
//     const questionData = quizData[currentQuestionIndex];
//     document.getElementById("question").textContent = questionData.question;
  
//     const options = document.querySelectorAll(".option");
//     options.forEach((option, index) => {
//       option.textContent = questionData.options[index];
//     });
//   }
  
//   function selectAnswer(selectedOption) {
//     const questionData = quizData[currentQuestionIndex];
//     if (selectedOption === questionData.correct) {
//       score++;
//     }
//     currentQuestionIndex++;
  
//     if (currentQuestionIndex < quizData.length) {
//       loadQuestion();
//     } else {
//       showResult();
//     }
//   }
  
//   function showResult() {
//     document.getElementById("quiz").classList.add("hidden");
//     document.getElementById("result").classList.remove("hidden");
//     document.getElementById("score").textContent = `${score}/${quizData.length}`;
//   }
  
//   function restartQuiz() {
//     currentQuestionIndex = 0;
//     score = 0;
//     document.getElementById("quiz").classList.remove("hidden");
//     document.getElementById("result").classList.add("hidden");
//     loadQuestion();
//   }
  
//   // Initialize the quiz
//   loadQuestion();
  





const API_URL = "https://opentdb.com/api.php?amount=5&category=18&type=multiple"; 

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestions() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    quizData = data.results.map((item) => {
      const allOptions = [...item.incorrect_answers, item.correct_answer];
      return {
        question: item.question,
        options: shuffleArray(allOptions),
        correct: allOptions.indexOf(item.correct_answer),
      };
    });
    loadQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
    document.getElementById("quiz").innerHTML = "<p>Failed to load questions. Please try again later.</p>";
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadQuestion() {
  if (quizData.length === 0) {
    document.getElementById("quiz").innerHTML = "<p>Loading questions...</p>";
    return;
  }

  const questionData = quizData[currentQuestionIndex];
  document.getElementById("question").innerHTML = decodeHTML(questionData.question);

  const options = document.querySelectorAll(".option");
  options.forEach((option, index) => {
    option.textContent = decodeHTML(questionData.options[index]);
    option.onclick = () => selectAnswer(index);
  });
}

function decodeHTML(html) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value;
}

function selectAnswer(selectedOption) {
  const questionData = quizData[currentQuestionIndex];
  if (selectedOption === questionData.correct) {
    score++;
  }
  currentQuestionIndex++;

  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("score").textContent = `${score}/${quizData.length}`;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("quiz").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  fetchQuestions();
}

// Fetch and initialize the quiz
fetchQuestions();

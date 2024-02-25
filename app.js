async function appApplicationName(containerId, quizDataUrl) {
    const response = await fetch(quizDataUrl);
    const { questions } = await response.json();

    const container = document.getElementById(containerId);
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = new Array(questions.length).fill(null);

    function answerClickHandler(event) {
        console.log("Clicked on answer");
        checkAnswer(event, event.currentTarget);
    }
    

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        const questionElement = document.createElement('div');
        const currentQuestionTracker = `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
        const answeredQuestionsCount = userAnswers.filter(answer => answer !== null).length;
        const answeredQuestionsTracker = `Отвечено на вопросов: ${answeredQuestionsCount} из ${questions.length}`;
    
        questionElement.innerHTML = `
            <div class="trackers">
                <div class="current-question-tracker">${currentQuestionTracker}</div>
                <div class="answered-questions-tracker">${answeredQuestionsTracker}</div>
            </div>
            <div class="question">${question.text}</div>
            <ul class="answers">${question.answers.map((answer, index) => {
                let className = '';
                if (userAnswers[currentQuestionIndex] !== null) {
                    if (index === question.correctAnswer) {
                        className = 'correct';
                    } else if (index === userAnswers[currentQuestionIndex]) {
                        className = 'incorrect';
                    }
                }
                return `<li class="${className}" data-index="${index}">${answer}</li>`;
            }).join('')}</ul>
        `;
    
    
        container.innerHTML = '';
        container.appendChild(questionElement);
    
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Предыдущий вопрос';
        prevButton.onclick = () => {
            currentQuestionIndex--;
            showQuestion();
        };
        container.appendChild(prevButton);
        updateButtonState(prevButton, currentQuestionIndex === 0);
    
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Следующий вопрос';
        nextButton.onclick = () => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            }
        };
        container.appendChild(nextButton);
        updateButtonState(nextButton, currentQuestionIndex >= questions.length - 1);
    
        const finishButton = document.createElement('button');
        finishButton.textContent = 'Завершить викторину';
        finishButton.onclick = showResults;
        container.appendChild(finishButton);
        updateFinishButtonState(finishButton);
    
        const answers = container.querySelectorAll('.answers li');
        answers.forEach(answer => {
            if (userAnswers[currentQuestionIndex] === null) {
                answer.addEventListener('click', answerClickHandler);
            }
        });
    }
    
    function updateFinishButtonState(button) {
        const allAnswered = userAnswers.every(answer => answer !== null);
        button.classList.toggle('is-highlighted', allAnswered);
    }
    
    
    
    function updateButtonState(button, isDisabled) {
        button.disabled = isDisabled;
        if (isDisabled) {
            button.classList.add('is-disabled');
        } else {
            button.classList.remove('is-disabled');
        }
    }
    
    

    function checkAnswer(event, answerElement) {
        const selectedAnswerIndex = parseInt(answerElement.getAttribute('data-index'));
        userAnswers[currentQuestionIndex] = selectedAnswerIndex;
    
        const question = questions[currentQuestionIndex];
        if (selectedAnswerIndex === question.correctAnswer) {
            answerElement.classList.add('correct');
            score++;
        } else {
            answerElement.classList.add('incorrect');
            const correctAnswerElement = container.querySelector(`li[data-index="${question.correctAnswer}"]`);
            if (correctAnswerElement) {
                correctAnswerElement.classList.add('correct');
            }
        }
    
        const answers = container.querySelectorAll('.answers li');
        answers.forEach(answer => answer.removeEventListener('click', answerClickHandler));
    
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === 'Завершить викторину') {
                updateFinishButtonState(button);
            }
        });
    }
    
    
    

    function showResults() {
        container.innerHTML = `<div class="results">Вы ответили правильно на ${score} из ${questions.length} вопросов.</div>`;
    }

    showQuestion();
}

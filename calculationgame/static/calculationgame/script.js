const correctSound = new Audio('audio/right.mp3');
const incorrectSound = new Audio('audio/wrong.mp3');

function App() {


    const [state, setState] = React.useState({
        num1: Math.ceil(Math.random() * 20),
        num2: Math.ceil(Math.random() * 10),
        response: "",
        score: 0,
        incorrect: false,
        operation: '+',
        timeLeft: 30,
    });


    // for change location
    const [locale, setLocale] = React.useState(localStorage.getItem('userLocale') || 'pt-BR');

    function handleLocaleChange(newLocale) {
        setLocale(newLocale);
        localStorage.setItem('userLocale', newLocale);
        window.location.reload();
    }

    const translations = {
        'en-US': {
            locationSelect: 'Location: ',
            enter: 'Enter',
            score: 'Score',
            win: 'You win!',
            lose: 'You lost',
            playAgain: 'Play again',
            initialMessage: 'Answer 10 questions to win',
            timeLeft: 'Time left',
            seconds: 'seconds',
        },
        'pt-BR': {
            locationSelect: 'Localização',
            enter: 'Enviar',
            score: 'Pontuação',
            win: 'Você ganhou!',
            lose: 'Você perdeu',
            playAgain: 'Jogar novamente',
            initialMessage: 'Responda 10 questões para vencer',
            timeLeft: 'Tempo restante',
            seconds: 'segundos',
        }
    };

    function t(key) {
        return translations[locale][key] || key;
    }


    const [showMessage, setShowMessage] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);


    React.useEffect(() => {
        const timer = setInterval(() => {
            setState(prevState => ({
                ...prevState,
                timeLeft: Math.max(prevState.timeLeft - 1, 0)
            }))
        }, 1000);

        return () => clearInterval(timer);
    }, [state.timeLeft]);

    React.useEffect(() => {
        // Generate a random operator each time num1 or num2 changes
        const operations = ['+', '-', '*', '/'];
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];

        let newNum1 = Math.ceil(Math.random() * 20);
        let newNum2 = Math.ceil(Math.random() * 10);

        // If division, make sure the result is an integer
        if (randomOperation === '/') {
            while (newNum1 % newNum2 !== 0) {
                newNum1 = Math.ceil(Math.random() * 20);
                newNum2 = Math.ceil(Math.random() * 10);
            }
        }

        setState((prevState) => ({ 
            ...prevState, 
            operation: randomOperation,
            num1: newNum1,
            num2: newNum2 
        }));
    }, [state.num1, state.num2]);

    function roundNumber(number, decimals = 9) {
        return Number(number.toFixed(decimals));
    }

    function parseUserInput(input, locale) {
        if (locale === 'pt-BR') {
            input = input.replace(',', '.');
        }
        return parseFloat(input);
    }

    function checkAnswer(event) {
        
        const answer = roundNumber(parseUserInput(state.response, locale));
        let correctAnswer;

        switch(state.operation) {
            case '+': correctAnswer = state.num1 + state.num2; break;
            case '-': correctAnswer = state.num1 - state.num2; break;
            case '*': correctAnswer = state.num1 * state.num2; break;
            case '/': correctAnswer = state.num1 / state.num2; break;         
        }

        correctAnswer = roundNumber(correctAnswer);

        if (Math.abs(correctAnswer - answer) < 1e-9) {

            // User got the question right
            correctSound.play();
            setState({
                ...state,
                num1: Math.ceil(Math.random() * 20),
                num2: Math.ceil(Math.random() * 10),
                score: state.score +1,
                response: "",
                incorrect: false,
                timeLeft: 30,
                
            });

            } else {
                // User got the question wrong
                incorrectSound.play();
                setState({
                    ...state,
                    score: state.score - 1,
                    response: "",
                    incorrect: true
                });
            }
        }


    function inputKeyPress(event) {
        if (event.key === "Enter") {
            checkAnswer();
        }
    }

    function updateResponse(event) {
        setState({
            ...state,
            response: event.target.value
        })
    }

    if (state.score === 10) {
        document.body.style.background = "radial-gradient(circle, green, white)";
        return (
            <div>
                <div id="winner">
                    {t('win')}
                </div>
                <button className={"play-again-button"} onClick={() => window.location.reload()}>{t('playAgain')}</button>
            </div>

        );
    }

    if (state.score <= -5 || state.timeLeft <= 0) {
        document.body.style.background = "radial-gradient(circle, red, white)";
        return (
            <div>
                <div id="loser">
                    {t('lose')}
                </div>
                <button className={"play-again-button"} onClick={() => window.location.reload()}>{t('playAgain')}</button>
            </div>
        )
    }


    return (
        <div>


            {showMessage && <div className="initial-message">{t('initialMessage')}</div>}

            <div className={state.incorrect ? "incorrect" : ""} id="problem">{state.num1} {state.operation} {state.num2}</div>

            <div className={"input-and-button"}>
                <input className={"input-style"} autoFocus={true} onKeyPress={inputKeyPress} onChange={updateResponse} value={state.response} />
                <button className={"enter-button"} onClick={checkAnswer}>{t('enter')}</button>
            </div>

            <div className={"score"}>{t('score')}: {state.score}</div>

            <div className={state.timeLeft <= 10 ? "countdown-style-red" : "countdown-style-green"} id={state.timeLeft === 10? "countdown-transform" : ""}>{t('timeLeft')}: {state.timeLeft} {t('seconds')}</div>

            <div className={state.timeLeft >= 5 ? "line-animation" : "line-animation-end"} 
            style={{ 
             marginLeft: `${(1 - state.timeLeft / 30) * 50}%`,
             marginRight: `${(1 - state.timeLeft / 30) * 50}%`
            }}
            >
            </div>

            {/* New dropdown for selecting locale */}
            <div className="select-location-div">
                <div className="select-location-title">{t('locationSelect')}</div>
                <select className="select-location-dropdown" onChange={(e) => handleLocaleChange(e.target.value)} value={locale}>
                    <option value="en-US">USA</option>
                    <option value="pt-BR">Brasil</option>
                </select> 
            </div>

        </div>
    );
}

ReactDOM.render(<App />, document.querySelector("#app"));

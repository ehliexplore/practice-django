function App() {

    const [state, setState] = React.useState({
        num1: 2,
        num2: 4,
        response: "",
        score: 0,
        incorrect: false,
        operation: '+',
        timeLeft: 30,
    });

    const [showMessage, setShowMessage] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowMessage(false);
        }, 3000);

        return () => clearTimeout(time);
    }, []);


    React.useEffect(() => {
        const timer = setInterval(() => {
            setState(prevState => ({
                ...prevState,
                timeLeft: Math.max(prevState.timeLeft - 1, 0)
            }))
        }, 1000);

        return () => clearInterval(timer);
    })

    React.useEffect(() => {
        // Generate a random operator each time num1 or num2 changes
        const operations = ['+', '-', '*', '/'];
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        setState((prevState) => ({ ...prevState, operation: randomOperation }));
    }, [state.num1, state.num2]);

    function roundNumber(number, decimals = 9) {
        return Number(number.toFixed(decimals));
    }

    function checkAnswer(event) {
        
        const answer = roundNumber(parseFloat(state.response));
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
        setState({
            ...state,
            num1: Math.ceil(Math.random() * 10),
            num2: Math.ceil(Math.random() * 10),
            score: state.score +1,
            response: "",
            incorrect: false,
            timeLeft: 30,
            
        });

           } else {
            // User got the question wrong
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
                    You win!
                </div>
                <button className={"play-again-button"} onClick={() => window.location.reload()}>Play again</button>
            </div>

        );
    }

    if (state.score <= -5 || state.timeLeft <= 0) {
        document.body.style.background = "radial-gradient(circle, red, white)";
        return (
            <div>
                <div id="loser">
                    Game Over
                </div>
                <button className={"play-again-button"} onClick={() => window.location.reload()}>Play again</button>
            </div>

        )
    }


    return (
        <div>
            {showMessage && <div className="initial-message">Answer 10 questions to win</div>}



            <div className={state.incorrect ? "incorrect" : ""} id="problem">{state.num1} {state.operation} {state.num2}</div>

            <div className={"input-and-button"}>
                <input className={"input-style"} autoFocus={true} onKeyPress={inputKeyPress} onChange={updateResponse} value={state.response} />
                <button className={"enter-button"} onClick={checkAnswer}>Enter</button>
            </div>

            <div className={"score"}>Score: {state.score}</div>

            <div className={state.timeLeft <= 10 ? "countdown-style-red" : "countdown-style-green"} id={state.timeLeft === 10? "countdown-transform" : ""}>Time left: {state.timeLeft} seconds</div>

            <div className={state.timeLeft >= 5 ? "line-animation" : "line-animation-end"} 
            style={{ 
             marginLeft: `${(1 - state.timeLeft / 30) * 50}%`,
             marginRight: `${(1 - state.timeLeft / 30) * 50}%`
            }}
            >
                </div>

        </div>
    );
}

ReactDOM.render(<App />, document.querySelector("#app"));

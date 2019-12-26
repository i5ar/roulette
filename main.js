import Checkbox from "./src/checkbox.mjs";
import Submit from "./src/submit.mjs";
import Text from "./src/text.mjs";


class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],

            // questions: [
            //     {
            //         difficulty: 2,  // 0-5
            //         title: {
            //             text: "Nella tricromia quale colore risulta essere composto dal rosso e dal verde?",
            //         },
            //         answers: [
            //             {
            //                 text: "giallo",
            //             },
            //             {
            //                 text: "blu",
            //             },
            //         ],
            //     },
            //     {
            //         difficulty: 1,
            //         title: {
            //             text: "Seleziona i quesiti veri."
            //         },
            //         answers: [
            //             {
            //                 text: "Il rosso è un colore primario della tricromia",
            //             },
            //             {
            //                 text: "Il blu è un colore primario della tricromia",
            //             },
            //         ],
            //     },
            //     {
            //         difficulty: 3,
            //         title: {
            //             text: "Esponi la differenza tra HTTP e HTTPS."
            //         },
            //         answers: [],
            //     },
            //     {
            //         difficulty: 1,
            //         title: {
            //             text: "Esponi la differenza tra head e body."
            //         },
            //         answers: [],
            //     },
            // ],
            currentQuestionIndex: 0,
            currentAnswers: [],
            questionsAnswered: [
                // {
                //     titleAnswered: {text: ""},
                //     answersAnswered: [{text: "", correct: ""}]
                // }
            ]
        };
        this.handleClickCallback = this.handleClickCallback.bind(this);
        this.handleChangeCallback = this.handleChangeCallback.bind(this);
    }

    componentDidMount() {
        window.addEventListener("blur", this.onBlur)

        fetch('questions.json').then(
            response => response.json().then(
                data => this.setState({
                    questions: data
                })
            ).catch(err => {
                console.log(err);
            })
        ).catch(err => {
            console.log(err);
        });
    }

    componentWilUnmount() {
        window.removeEventListener("blur", this.onBlur)
    }

    onBlur = () => {
        // https://stackoverflow.com/questions/24393785/prevent-user-from-going-to-other-tab-on-website
        alert("Each time you leave the page you skip to the next question.");
        this.setState(s => ({
            currentQuestionIndex: s.currentQuestionIndex + 1
        }))
    }

    handleClickCallback(evt) {
        console.log("Submitted");
        this.setState(prevState => ({
            questionsAnswered: [
                ...prevState.questionsAnswered,
                {
                    titleAnswered: prevState.questions[prevState.currentQuestionIndex].title.text,
                    answersAnswered: prevState.currentAnswers
                }
            ],
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            currentAnswers: []
        }))
    }

    handleChangeCallback(evt) {
        if (evt.target.type === "checkbox") {
            const answer = evt.target.value;
            const answerVal = evt.target.value;
            const answerChecked = evt.target.checked;
            this.setState(prevState => ({
                currentAnswers: answerChecked ? prevState.currentAnswers.concat(answerVal) : prevState.currentAnswers.filter(val => val !== answerVal)
            }));
        }
        if (evt.target.type === "text") {
            const answer = evt.target.value;
            this.setState(prevState => ({
                currentAnswers: [answer]
            }));
        }
    }

    render() {
        return this.state.currentQuestionIndex < this.state.questions.length ? e(
            "section",
            {},
            e(
                "h2",
                {},
                this.state.questions[this.state.currentQuestionIndex].title.text
            ),
            e(
                "form",
                {},
                this.state.questions[this.state.currentQuestionIndex].answers == "" ? e(
                    Text,
                    {
                        handleChangeCallback: this.handleChangeCallback,
                        currentAnswers: this.state.currentAnswers,
                    }
                ) : e(
                    Checkbox,
                    {
                        answers: this.state.questions[this.state.currentQuestionIndex].answers,
                        handleChangeCallback: this.handleChangeCallback,
                        currentAnswers: this.state.currentAnswers,
                    }
                ),
                e(
                    Submit,
                    {
                        handleClickCallback: this.handleClickCallback,
                    }
                ),
            ),
        ) : e("div", {}, "Hai finito!")
    }
}

ReactDOM.render(e(Root), document.querySelector("#root"));

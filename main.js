import Checkbox from "./src/checkbox.mjs";
import Submit from "./src/submit.mjs";
import Text from "./src/text.mjs";


class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [
                {
                    difficulty: 3,
                    title: {
                        text: "Esponi la differenza tra HTTP e HTTPS."
                    },
                    answers: [],
                },
                {
                    difficulty: 1,
                    title: {
                        text: "Esponi la differenza tra head e body."
                    },
                    answers: [],
                },
                {
                    difficulty: 2,  // 0-5
                    title: {
                        text: "Nella tricromia quale colore risulta essere composto dal rosso e dal verde?",
                    },
                    answers: [
                        {
                            text: "giallo",
                            correct: true,
                        },
                        {
                            text: "blu",
                            correct: false,
                        },
                    ],
                },
                {
                    difficulty: 1,
                    title: {
                        text: "Seleziona i quesiti veri."
                    },
                    answers: [
                        {
                            text: "Il rosso è un colore primario della tricromia",
                            correct: true,
                        },
                        {
                            text: "Il blu è un colore primario della tricromia",
                            correct: true,
                        },
                    ],
                },
     
            ],
            item: 0,
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
    componentDidMount() {}

    handleClickCallback(evt) {
        console.log("Submitted");
        this.setState(prevState => ({
            questionsAnswered: [
                ...prevState.questionsAnswered,
                {
                    titleAnswered: prevState.questions[prevState.item].title.text,
                    answersAnswered: prevState.currentAnswers
                }
            ],
            item: prevState.item + 1,
        }))
    }

    handleChangeCallback(evt) {
        if (evt.target.type === "checkbox") {
            console.log("checkboxed");

        }
        if (evt.target.type === "text") {
            const answer = evt.target.value;
            this.setState(prevState => ({
                currentAnswers: [answer]
            }));
        }
    }

    render() {
        // const element = () => {
        //     if (this.state.questions[this.state.item].answers == "") {
        //         return e(
        //             Textarea,
        //             {
        //                 item: this.state.item
        //             }
        //         );

        //     } else if (this.state.questions[this.state.item].answers != "") {
        //         return e(Checkbox,
        //             {
        //                 item: this.state.item,
        //                 answers: this.state.questions[this.state.item].answers,
        //                 handleChangeCallback: this.handleChangeCallback
        //             }
        //         );
        //     }
        // }

        return e(
            "section",
            {},
            e(
                "h2",
                {},
                this.state.questions[this.state.item].title.text
            ),
            e(
                "form",
                {},
                this.state.questions[this.state.item].answers == "" ? e(
                    Text,
                    {
                        item: this.state.item,
                        handleChangeCallback: this.handleChangeCallback,
                        currentAnswers: this.state.currentAnswers,
                    }
                ) : e(
                    Checkbox,
                    {
                        item: this.state.item,
                        answers: this.state.questions[this.state.item].answers,
                        handleChangeCallback: this.handleChangeCallback,
                    }
                ),

                // Submit
                e(
                    Submit,
                    {
                        handleClickCallback: this.handleClickCallback,
                    }
                ),
            ),
        );
    }
}

ReactDOM.render(e(Root), document.querySelector("#root"));

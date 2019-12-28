import Checkbox from "./src/checkbox.mjs";
import Submit from "./src/submit.mjs";
import Text from "./src/text.mjs";

import {shuffle, download} from "./src/common.mjs";


class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "",
            time: 0,
            isReady: false,
            isComplete: false,
            questions: [],
            currentQuestionIndex: 0,
            currentAnswers: [],
            scholar: {
                //     name: "",
                //     surname: "",
                //     grade: "",
            },
            questionsAnswered: [
                // {
                //     questionText: "",
                //     choiceSet: [{choiceText: ""}]
                // }
            ]
        };
        this.handleChangeCallback = this.handleChangeCallback.bind(this);
    }

    componentDidMount() {
        window.addEventListener("blur", this.onBlur)

        fetch('http://127.0.0.1:8000/graphql/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({query: `{
                quiz(id: 1) {
                    id
                    unit
                    questions {
                        time
                        level
                        questionText
                        choiceSet {
                            choiceText
                        }
                    }
                }
            }`})
        }).then(
            response => response.json().then(
                query => this.setState({
                    questions: shuffle(query.data.quiz.questions),
                    unit: query.data.quiz.unit
                })
            ).catch(err => {
                console.log(err);
            })
        ).catch(err => {
            console.log(err);
        });

        // fetch('data.json').then(
        //     response => response.json().then(
        //         query => this.setState({
        //             questions: shuffle(query.data.quiz.questions),
        //             unit: query.data.quiz.unit
        //         })
        //     ).catch(err => {
        //         console.log(err);
        //     })
        // ).catch(err => {
        //     console.log(err);
        // });

    }

    componentWilUnmount() {
        window.removeEventListener("blur", this.onBlur)
    }

    onBlur = () => {
        if (this.state.isReady && !this.state.isComplete) {
            // https://stackoverflow.com/questions/24393785/prevent-user-from-going-to-other-tab-on-website
            // alert("Ogni volta che lasci la pagina salti una domanda.");
            // this.setState(prevState => ({
            //     questionsAnswered: [
            //         ...prevState.questionsAnswered,
            //         {
            //             questionText: prevState.questions[prevState.currentQuestionIndex].questionText,
            //             choiceSet: prevState.currentAnswers
            //         }
            //     ],
            //     currentQuestionIndex: prevState.currentQuestionIndex + 1,
            //     currentAnswers: [],
            //     isComplete: prevState.currentQuestionIndex + 1 >= prevState.questions.length,
            //     time: prevState.questions[prevState.currentQuestionIndex + 1] ? prevState.questions[prevState.currentQuestionIndex + 1].time : 0
            // }))
        }
    }

    // countDown(count) {
    //     if (!this.state.isComplete) {
    //         const countdownNumberEl = document.getElementById('countdown-number');
    //         countdownNumberEl.textContent = parseInt(count, 10);
    //     }
    // }

    handleSubmit(evt) {
        evt.preventDefault();
        const name = evt.target.name;
        if (name === "question") {
            this.setState(
                prevState => ({
                    questionsAnswered: [
                        ...prevState.questionsAnswered,
                        {
                            questionText: prevState.questions[prevState.currentQuestionIndex].questionText,
                            choiceSet: prevState.currentAnswers.map(answer => ({choiceText: answer}))
                        }
                    ],
                    currentQuestionIndex: prevState.currentQuestionIndex + 1,
                    currentAnswers: [],
                    isComplete: prevState.currentQuestionIndex + 1 >= prevState.questions.length,
                    time: prevState.questions[prevState.currentQuestionIndex + 1] ? prevState.questions[prevState.currentQuestionIndex + 1].time : 0
                }),
                // () => this.countDown(this.state.time)
            );
        } else if (name === "scholar") {
            // NOTE: Hide scholar form and set time for the first question.
            this.setState(
                prevState => ({
                    isReady: !prevState.isReady,
                    time: prevState.questions[prevState.currentQuestionIndex + 1] ? prevState.questions[prevState.currentQuestionIndex + 1].time : 0,
                }), () => setInterval(() => this.setState(prevState => ({
                    time: prevState.time > 0 ? prevState.time - 1 : 0
                }),
                () => this.state.time <= 0 ?
                this.nextQuestion() :
                // this.countDown(this.state.time)
                console.log(this.state.time)
            ), 1000)
        );
        }
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

    nextQuestion() {
        if (!this.state.isComplete) {
            this.setState(
                prevState => ({
                    questionsAnswered: [
                        ...prevState.questionsAnswered,
                        {
                            questionText: prevState.questions[prevState.currentQuestionIndex].questionText,
                            choiceSet: prevState.currentAnswers.map(answer => ({choiceText: answer}))
                        }
                    ],
                    currentQuestionIndex: prevState.currentQuestionIndex + 1,
                    currentAnswers: [],
                    isComplete: prevState.currentQuestionIndex + 1 >= prevState.questions.length,
                    time: prevState.questions[prevState.currentQuestionIndex + 1] ? prevState.questions[prevState.currentQuestionIndex + 1].time : 0
                }),
                // () => this.countDown(this.state.time)
            );
        } else {
            console.log("hi");
            
        }
    }

    render() {
        const {
            isReady,
            scholar,
            questions,
            currentAnswers,
            currentQuestionIndex
        } = this.state;

        const width = 128;
        const strokeWidth = 32;
        const time = questions[currentQuestionIndex] ? questions[currentQuestionIndex].time : 0;

        const grades = ["2A", "2B", "4A", "4B", "5A", "5B"];

        return e(
            f,
            {},
            !isReady ? e(
                "form",
                {
                    name: "scholar",
                    onSubmit: (evt) => this.handleSubmit(evt)
                },
                e("fieldset", {},
                    e("legend", {}, "Studente"),
                    e("label", {}, "Nome"),
                    e(
                        "input",
                        {
                            type: "text",
                            onChange: evt => {
                                const value = evt.target.value;
                                this.setState(prevState => ({
                                    scholar: {
                                        ...prevState.scholar,
                                        name: value || null
                                    }
                                }))
                            },
                            value: scholar.name || "",
                            required: true
                        }
                    ),
                    e("label", {}, "Cognome"),
                    e(
                        "input",
                        {
                            type: "text",
                            onChange: evt => {
                                const value = evt.target.value;
                                this.setState(prevState => ({
                                    scholar: {
                                        ...prevState.scholar,
                                        surname: value || null
                                    }
                                }))
                            },
                            value: scholar.surname || "",
                            required: true
                        }
                    ),
                    e("label", {}, "Classe"),
                    e(
                        "select",
                        {
                            onChange: evt => {
                                const value = evt.target.value;
                                this.setState(prevState => ({
                                    scholar: {
                                        ...prevState.scholar,
                                        grade: value || null
                                    }
                                }))
                            },
                            value: scholar.grade || "",
                            required: true
                        },
                        e("option", {value: null}, ""),
                        grades.map(c => e("option", {
                            value: c
                        }, c))
                    ),
                    e(Submit)
                ),
            ) : currentQuestionIndex < questions.length ? e(
                "section",
                {},
                e(
                    "h2",
                    {},
                    questions[currentQuestionIndex].questionText + `
                    (PUNTI ${questions[currentQuestionIndex].level})`
                ),
                e(
                    "form",
                    {
                        name: "question",
                        onSubmit: (evt) => this.handleSubmit(evt)
                    },
                    questions[currentQuestionIndex].choiceSet.length === 0 ? e(
                        Text,
                        {
                            handleChangeCallback: this.handleChangeCallback,
                            currentAnswers,
                        }
                    ) : e(
                        Checkbox,
                        {
                            choiceSet: questions[currentQuestionIndex].choiceSet,
                            handleChangeCallback: this.handleChangeCallback,
                            currentAnswers,
                        }
                    ),
                    e(Submit)
                ),


                e(
                    "figure",
                    {
                        key: this.state.currentQuestionIndex
                    },
                    e("figcaption", {
                        style: {
                            color: "var(--base08)",
                            display: "inline-block",
                            lineHeight: "var(--width)"
                        },
                        id: "countdown-number"
                    }),
                    e(
                        "svg",
                        {},
                        e(
                            "circle",
                            {
                                style: {
                                    // fill: "none",
                                    // stroke: "var(--base08)",
                                    // strokeWidth: "var(--stroke-width)",
                                    animation: `countdown ${time}s linear infinite forwards`
                                },
                                r: width / 2 - strokeWidth,
                                cx: width / 2,
                                cy: width / 2,
                            }
                        ),


                    )
                )

            ) : e(
                "div",
                {},
                e("p", {}, "Hai finito!"),
                e("button", {
                    onClick: () => download(this.state)
                }, "Scarica")
            )
        )
    }
}

ReactDOM.render(e(Root), document.querySelector("#root"));

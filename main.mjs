import Checkbox from "./src/checkbox.mjs";
import Submit from "./src/submit.mjs";
import Text from "./src/text.mjs";

import {shuffle, download} from "./src/common.mjs";
import {retrieveQuizzes, retrieveQuiz, createBulk} from "./src/service.mjs";

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDebug: true,
            server: "http://127.0.0.1:8000/graphql/",
            unit: "",
            id: "",  // quiz id
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
                //     section: "",
            },
            quizzes: [],
            questionsAnswered: [
                // {
                //     questionText: "",
                //     choiceSet: [{choiceText: ""}]
                // }
            ]
        };
        this.interval;
        this.handleChangeCallback = this.handleChangeCallback.bind(this);
    }

    componentDidMount() {

        // Debug
        this.setState(prevState => ({
            scholar: prevState.isDebug ? {
                name: "Mario",
                surname: "Rossi",
                grade: "5",
                section: "B"
            } : {}
        }));

        window.addEventListener("blur", this.onBlur)
        retrieveQuizzes(this.state.server).then(
            response => response.json().then(
                query => this.setState({
                    quizzes: query.data.quizzes,
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

    countDown(count) {
        if (!this.state.isComplete) {
            const countdownNumberEl = document.getElementById('countdown-number');
            countdownNumberEl.textContent = parseInt(count, 10);
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const name = evt.target.name;
        if (name === "question") {
            this.nextQuestion();
        } else if (name === "scholar") {
            retrieveQuiz(this.state.server, this.state.id)
            .then(
                response => response.json().then(
                    query => this.setState(prevState => ({
                        questions: query.data.quiz.questions,
                        unit: query.data.quiz.unit,
                        id: query.data.quiz.id,
                        time: query.data.quiz.questions[prevState.currentQuestionIndex].time,
                        isReady: !prevState.isReady,
                    }), () => this.interval = setInterval(() => this.setState(
                            prevState => ({
                                time: prevState.time > 0 ? prevState.time - 1 : 0
                            }),
                            () => this.state.time <= 0 ?
                            this.nextQuestion() :
                            this.countDown(this.state.time)
                            // console.log(this.state.time)
                        ), 1000)
                    )
                ).catch(err => {
                    console.log(err);
                })
            )
            .catch(err => {
                console.log(err);
            });

            // fetch('data.json').then(
            //     response => response.json().then(
            //         query => this.setState({
            //             questions: query.data.quiz.questions,
            //             unit: query.data.quiz.unit
            //         })
            //     ).catch(err => {
            //         console.log(err);
            //     })
            // ).catch(err => {
            //     console.log(err);
            // });

        }
    }

    handleChangeCallback(evt) {
        if (evt.target.type === "checkbox") {
            const answerVal = evt.target.value;
            const answerChecked = evt.target.checked;
            this.setState(prevState => ({
                currentAnswers: answerChecked ? prevState.currentAnswers.concat(answerVal) : prevState.currentAnswers.filter(val => val !== answerVal)
            }));
        }
        if (evt.target.type === "text") {
            const answer = evt.target.value;
            this.setState({currentAnswers: [answer]});
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
                () => this.countDown(this.state.time)
            );
        } else {
            clearInterval(this.interval);
            // NOTE: Send data.
            const {scholar, questionsAnswered, id} = this.state;
            const data = encodeURIComponent(JSON.stringify(questionsAnswered));
            createBulk(this.state.server, id, scholar, data)
            .then(
                response => response.ok ? alert("Submitted!") : alert("Error!")
            ).catch(err => {
                console.log(err);
            });
        }
    }

    render() {
        const {
            isReady,
            scholar,
            quizzes,
            id,
            questions,
            currentAnswers,
            currentQuestionIndex
        } = this.state;

        const width = 128;
        const strokeWidth = 32;
        const time = questions[currentQuestionIndex] ? questions[currentQuestionIndex].time : 0;

        const grades = ["1", "2", "3", "4", "5"];
        const sections = ["A", "B"];

        return e(
            f,
            {},
            e("div", {},
                !isReady ? e("form",
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
                        e("label", {}, "Anno"),
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
                        e("label", {}, "Sezione"),
                        e(
                            "select",
                            {
                                onChange: evt => {
                                    const value = evt.target.value;
                                    this.setState(prevState => ({
                                        scholar: {
                                            ...prevState.scholar,
                                            section: value || null
                                        }
                                    }))
                                },
                                value: scholar.section || "",
                                required: true
                            },
                            e("option", {value: null}, ""),
                            sections.map(c => e("option", {
                                value: c
                            }, c))
                        ),
                        e("label", {}, "Unità"),
                        e(
                            "select",
                            {
                                onChange: evt => {
                                    const value = evt.target.value;
                                    this.setState({id: value || null})
                                },
                                value: id || null,
                                required: true
                            },
                            e("option", {value: null}, ""),
                            quizzes.map(c => e("option", {
                                value: c.id
                            }, c.unit))
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
        )
    }
}

ReactDOM.render(e(Root), document.querySelector("#root"));

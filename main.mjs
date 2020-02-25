import Checkbox from "./src/checkbox.mjs";
import Submit from "./src/submit.mjs";
import Text from "./src/text.mjs";

import {shuffle, send, download} from "./src/common.mjs";
import {retrieveQuizzes, retrieveQuiz} from "./src/service.mjs";

const backend = "http://127.0.0.1:8000";

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDebug: true,
            server: backend + "/graphql/",
            admin: backend + "/admin/",
            time: 0,
            isReady: false,
            isComplete: false,
            questions: [],
            currentQuestionIndex: 0,
            currentAnswers: [],
            header: {
                //     name: "",
                //     surname: "",
                //     grade: "",
                //     section: "",
                //     unitId: "",
                //     unitName: "",
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
            header: prevState.isDebug ? {
                name: "Mario",
                surname: "Rossi",
                grade: "5",
                section: "B",
                unitId: "",
                unitName: ""
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
        } else if (name === "header") {
            retrieveQuiz(this.state.server, this.state.header.unitId).then(
                response => response.json().then(
                    query => this.setState(prevState => ({
                        questions: query.data.quiz.questions,
                        time: query.data.quiz.questions[
                            prevState.currentQuestionIndex].time,
                        header: {
                            ...prevState.header,
                            unitId: query.data.quiz.id,
                            unitName: query.data.quiz.name,
                        },
                        isReady: !prevState.isReady,
                    }), () => this.interval = setInterval(() => this.setState(
                            prevState => ({
                                time: prevState.time > 0 ? prevState.time - 1 : 0
                            }), () => this.state.time <= 0 ?
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
            // NOTE: Send data.
            // send(this.state, this.interval);
        }
    }

    render() {
        const {
            isReady,
            header,
            quizzes,
            questions,
            currentAnswers,
            currentQuestionIndex
        } = this.state;

        const time = questions[currentQuestionIndex] ? questions[currentQuestionIndex].time : 0;

        const width = 128;
        const strokeWidth = 32;
        const PI = 3.1415;
        const r = width / 2 - strokeWidth;
        const d = r * 2;
        const strokeDasharray = PI * d;  // 113
        const strokeDashoffset = 201 - (201 / time * this.state.time);

        const grades = ["1", "2", "3", "4", "5"];
        const sections = ["A", "B"];

        return e(
            f,
            {},
            e("div", {},
                !isReady ? e("form",
                    {
                        name: "header",
                        onSubmit: (evt) => this.handleSubmit(evt)
                    },
                    e("fieldset", {},
                        e("legend", {}, "Intestazione"),
                        e("label", {}, "Nome"),
                        e(
                            "input",
                            {
                                type: "text",
                                onChange: evt => {
                                    const value = evt.target.value;
                                    this.setState(prevState => ({
                                        header: {
                                            ...prevState.header,
                                            name: value || null
                                        }
                                    }))
                                },
                                value: header.name || "",
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
                                        header: {
                                            ...prevState.header,
                                            surname: value || null
                                        }
                                    }))
                                },
                                value: header.surname || "",
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
                                        header: {
                                            ...prevState.header,
                                            grade: value || null
                                        }
                                    }))
                                },
                                value: header.grade || "",
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
                                        header: {
                                            ...prevState.header,
                                            section: value || null
                                        }
                                    }))
                                },
                                value: header.section || "",
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
                                    this.setState(prevState => ({
                                        header: {
                                            ...prevState.header,
                                            unitId: value || null,
                                            unitName: prevState.quizzes.find(
                                                quiz => quiz.id == value).name || null
                                        }
                                    }))
                                },
                                value: header.unitId || null,
                                required: true
                            },
                            e("option", {value: null}, ""),
                            quizzes.map(c => e("option", {
                                value: c.id
                            }, c.name))
                        ),
                        e(Submit)
                    ),
                    e("p", {}, e("a", {href: this.state.admin}, "Pannello Admin"))
                ) : currentQuestionIndex < questions.length ? e(
                    "section",
                    {},
                    e(
                        "h2",
                        {},
                        `${questions[currentQuestionIndex].questionText} (PUNTI ${questions[currentQuestionIndex].level}) [TEMPO ${questions[currentQuestionIndex].time}]`
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
                            key: this.state.currentQuestionIndex,
                            style: {
                                width: width,
                                height: width
                            }
                        },
                        e(
                            "figcaption",
                            {
                                style: {
                                    lineHeight: `${width}px`
                                },
                                id: "countdown-number",
                            }),
                        e(
                            "svg",
                            {
                                style: {
                                    width: width,
                                    height: width
                                }
                            },
                            e(
                                "circle",
                                {
                                    r: width / 2 - strokeWidth,
                                    cx: width / 2,
                                    cy: width / 2,
                                    style: {
                                        strokeDashoffset: strokeDashoffset,
                                        strokeWidth: strokeWidth,
                                        strokeDasharray: strokeDasharray
                                    },
                                }
                            )
                        )
                    )
                ) : e(
                    "div",
                    {
                        style: {
                            textAlign: "center"
                        }
                    },
                    e("p", {}, "Hai finito!"),
                    e("button", {
                        onClick: () => send(this.state, this.interval)
                    }, "Invia"),
                    e("button", {
                        onClick: () => download(this.state)
                    }, "Scarica"),
                    e("div", {
                        style: {
                            padding: 24
                        }
                    }, e("a", {
                        href: "/"
                    }, "Back home"))
                ),
            )
        )
    }
}

ReactDOM.render(e(Root), document.querySelector("#root"));

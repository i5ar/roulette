import Checkbox from "./src/checkbox.mjs";
import Submit from "./src/submit.mjs";
import Text from "./src/text.mjs";


class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            complete: false,
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
                //     title: "",
                //     answers: []
                // }
            ]
        };
        this.handleClickCallback = this.handleClickCallback.bind(this);
        this.handleChangeCallback = this.handleChangeCallback.bind(this);
    }

    componentDidMount() {
        window.addEventListener("blur", this.onBlur)

        fetch('data.json').then(
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



                // Countdown
                // if (this.state.ready) {
                //     const countdownNumberEl = document.getElementById('countdown-number');
                //     let countdown = time;
                //     countdownNumberEl.textContent = countdown;
                //     setInterval(() => {
                //         countdown = --countdown <= 0 ? time : countdown;
                //         countdownNumberEl.textContent = countdown;
                //     }, 1000);
                // }
    }

    componentWilUnmount() {
        window.removeEventListener("blur", this.onBlur)
    }

    onBlur = () => {
        if (this.state.ready && !this.state.complete) {
            // https://stackoverflow.com/questions/24393785/prevent-user-from-going-to-other-tab-on-website
            // alert("Ogni volta che lasci la pagina salti una domanda.");
            // this.setState(prevState => ({
            //     questionsAnswered: [
            //         ...prevState.questionsAnswered,
            //         {
            //             title: prevState.questions[prevState.currentQuestionIndex].title,
            //             answers: prevState.currentAnswers
            //         }
            //     ],
            //     currentQuestionIndex: prevState.currentQuestionIndex + 1,
            //     currentAnswers: [],
            //     complete: prevState.currentQuestionIndex + 1 >= prevState.questions.length
            // }))
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
        // NOTE: Hide scholar form.
        this.setState(prevState => ({
            ready: !prevState.ready
        }))
    }

    handleClickCallback(evt) {
        this.setState(prevState => ({
            questionsAnswered: [
                ...prevState.questionsAnswered,
                {
                    title: prevState.questions[prevState.currentQuestionIndex].title,
                    answers: prevState.currentAnswers
                }
            ],
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            currentAnswers: [],
            complete: prevState.currentQuestionIndex + 1 >= prevState.questions.length
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

    async downloadFile() {
        const {questionsAnswered} = this.state;
        const fileName = "file";
        const json = JSON.stringify(questionsAnswered);
        const blob = new Blob([json], {type: "application/json"});
        const href = await URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = fileName + ".json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    endRoulette() {
        // TODO: Send data.

        // NOTE: Download file.
        // this.downloadFile()

        return "Hai finito";
    }

    render() {
        const {
            ready,
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
            !ready ? e(
                "form",
                {
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
                                this.setState(s => ({
                                    scholar: {
                                        ...s.scholar,
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
                                this.setState(s => ({
                                    scholar: {
                                        ...s.scholar,
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
                                this.setState(s => ({
                                    scholar: {
                                        ...s.scholar,
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
                    e(
                        "input", {
                            type: "submit",
                            value: "Submit",
                        }
                    )
                ),
            ) : currentQuestionIndex < questions.length ? e(
                "section",
                {},
                e(
                    "h2",
                    {},
                    questions[currentQuestionIndex].title + `
                    (PUNTI ${questions[currentQuestionIndex].level})`
                ),
                e(
                    "form",
                    {},
                    questions[currentQuestionIndex].answers.length === 0 ? e(
                        Text,
                        {
                            handleChangeCallback: this.handleChangeCallback,
                            currentAnswers,
                        }
                    ) : e(
                        Checkbox,
                        {
                            answers: questions[currentQuestionIndex].answers,
                            handleChangeCallback: this.handleChangeCallback,
                            currentAnswers,
                        }
                    ),
                    e(
                        Submit,
                        {
                            handleClickCallback: this.handleClickCallback,
                        }
                    ),
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


            ) : e("div", {}, this.endRoulette()),
        )
    }
}

ReactDOM.render(e(Root), document.querySelector("#root"));

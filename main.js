import Checkbox from "./src/checkbox.mjs";
import Submit from "./src/submit.mjs";
import Text from "./src/text.mjs";


class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            currentQuestionIndex: 0,
            currentAnswers: [],
            credits: [
                // {
                //     name: "",
                //     surname: "",
                //     grade: "",
                // }
            ],
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
        // alert("Each time you leave the page you skip to the next question.");
        // this.setState(s => ({
        //     currentQuestionIndex: s.currentQuestionIndex + 1
        // }))
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

        if (this.state.questions.length) {
            // TODO: Send data.

            // NOTE: Download file.
            // this.downloadFile()

            return "Hai finito!";
        }
        return "Are you ready?";
    }

    render() {

        const grades = ["2A", "2B", "4A", "4B", "5A", "5B"];

        return e(
            f,
            {},
            e(
                "form",
                {},
                e("fieldset", {},
                    e("label", {}, "nome"),
                    e(
                        "input",
                        {
                            type: "text",
                            value: "",
                            onChange: ""
                        }
                    ),
                    e("label", {}, "cognome"),
                    e(
                        "input",
                        {
                            type: "text",
                            value: "",
                            onChange: ""
                        }
                    ),
                    e("label", {}, "classe"),
                    e(
                        "select",
                        {
                            style: {
                                clear: "both",
                                float: "left"
                            }
                        }, grades.map(c => e("option", {value: c}, c))
                    ),
                )
            ),

            this.state.currentQuestionIndex < this.state.questions.length ? e(
                "section",
                {},
                e(
                    "h2",
                    {},
                    this.state.questions[this.state.currentQuestionIndex].title + `
                    (PUNTI ${this.state.questions[this.state.currentQuestionIndex].difficulty})`
                ),
                e(
                    "form",
                    {},
                    this.state.questions[this.state.currentQuestionIndex].answers.length === 0 ? e(
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
            ) : e("div", {}, this.endRoulette())

        )

    }
}

ReactDOM.render(e(Root), document.querySelector("#root"));

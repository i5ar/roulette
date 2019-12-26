export default class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
        this.props.handleChangeCallback(evt);
    }

    render() {
        return this.props.answers.map((answer, i) => e(
                "label",
                {},
                e(
                    "input",
                    {
                        type: "checkbox",
                        value: answer,
                        checked: this.props.currentAnswers.includes(answer),
                        onChange: this.onChange
                    }
                ),
                answer,
            )
        )
    }
}

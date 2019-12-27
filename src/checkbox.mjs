export default class Checkbox extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
        this.props.handleChangeCallback(evt);
    }

    render() {
        return this.props.choiceSet.map((answer, i) => e(
                "label",
                {},
                e(
                    "input",
                    {
                        type: "checkbox",
                        value: answer.choiceText,
                        checked: this.props.currentAnswers.includes(answer.choiceText),
                        onChange: this.onChange
                    }
                ),
                answer.choiceText,
            )
        )
    }
}

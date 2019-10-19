export default class Text extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
        this.props.handleChangeCallback(evt);
    }

    render() {
        return e(
            "input",
            {
                type: "text",
                value: this.props.currentAnswers[0] || "",
                onChange: this.onChange
            }
        );
    }
}

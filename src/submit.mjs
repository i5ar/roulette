export default class Submit extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();
        this.props.handleClickCallback(evt);
    }

    render() {
        // const {} = this.state;

        return e(
            "input",
            {
                type: "submit",
                value: "Submit",
                onClick: this.handleClick,
            }
        );
    }
}

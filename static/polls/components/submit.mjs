export default class Submit extends React.Component {

    render() {
        // const {} = this.state;

        return e(
            "input",
            {
                type: "submit",
                value: "Submit",
            }
        );
    }
}

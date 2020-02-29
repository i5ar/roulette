export default class Radio extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // const {} = this.state;

        return e(
            f,
            {},
            e(
                "label",
                {},
                e(
                    "input",
                    {
                        type: "radio",
                        name: "radio1",
                        value: "radio1",
                        // checked: this.state.radio === "result.SITE_NAME",
                        // onChange: "this.onSiteChanged"
                    }
                ),
                "answer 1",
            ),
            e("label", {},
                e(
                    "input",
                    {
                        type: "radio",
                        name: "radio2",
                        value: "radio2",
                    }
                ),
                "answer 2",
            )
        )
    }
}



      
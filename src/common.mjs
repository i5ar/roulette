// Knuth Shuffle - Daplie Labs
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // NOTE: While there remain elements to shuffle.
    while (0 !== currentIndex) {

        // NOTE: Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // NOTE: Swap the remaining element with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

async function download(state) {
    const {questionsAnswered, scholar} = state;
    const fileName = "file";
    const json = JSON.stringify({scholar, questionsAnswered});
    const blob = new Blob([json], {type: "application/json"});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export {shuffle, download};

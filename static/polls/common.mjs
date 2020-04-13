import {createBulk} from "./service.mjs";

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

function send(server, state, interval) {
    // NOTE: Send data.
    clearInterval(interval);
    const {header, questionsAnswered} = state;
    const data = encodeURIComponent(JSON.stringify(questionsAnswered));
    createBulk(server, header, data).then(
        response => response.ok ? alert("Submitted!") : alert("Error!")
    ).catch(err => {
        console.log(err);
    });
}

async function download(state) {
    const {questionsAnswered, header} = state;
    const fileName = "file";
    const json = JSON.stringify({header, questionsAnswered});
    const blob = new Blob([json], {type: "application/json"});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export {shuffle, send, download};

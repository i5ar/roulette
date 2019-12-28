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

export {shuffle};

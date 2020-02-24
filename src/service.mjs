function retrieveQuizzes(server) {
    return fetch(server, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: `{
            quizzes {
                id
                unit
            }
        }`})
    })
}

function retrieveQuiz(server, id) {
    return fetch(server, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: `{
            quiz(id: ${id}) {
                id
                unit
                questions {
                    time
                    level
                    questionText
                    choiceSet {
                        choiceText
                    }
                }
            }
        }`})
    })
}

function createBulk(server, id, scholar, data) {
    const pubDate = new Date().toISOString();
    return fetch(server, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: `mutation {
            createBulk (
                name: "${scholar.name}",
                surname: "${scholar.surname}",
                grade: "${scholar.grade}",
                section: "${scholar.section}",
                data: "${data}",
                quiz: "${id}",
                pubDate: "${pubDate}"
            ) {
                id
                data
            }
        }`})
    })
}

export {retrieveQuizzes, retrieveQuiz, createBulk};

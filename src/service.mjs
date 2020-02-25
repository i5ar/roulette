function retrieveQuizzes(server) {
    return fetch(server, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: `{
            quizzes {
                id
                name
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
                name
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

function createBulk(server, scholar, data) {
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
                quiz: "${scholar.unitId}",
                pubDate: "${pubDate}"
            ) {
                id
                data
            }
        }`})
    })
}

export {retrieveQuizzes, retrieveQuiz, createBulk};

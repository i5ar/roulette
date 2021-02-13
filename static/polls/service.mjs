function retrieveUsers(server, isClient) {
    return isClient ? fetch("data/users.json", {
        headers: {
            'Content-Type': 'application/json',
        }
    }) : fetch(server, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: `{
            users {
                id
                username
                quizSet {
                    id
                }
            }
        }`})
    })
}

function retrieveQuizzes(server, isClient) {
    return isClient ? fetch("data/quizzes.json", {
        headers: {
            'Content-Type': 'application/json',
        }
    }) : fetch(server, {
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

function retrieveQuiz(server, id, isClient) {
    return isClient ? fetch("data/quiz.json", {
        headers: {
            'Content-Type': 'application/json',
        }
    }) : fetch(server, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: `{
            quiz(id: ${id}) {
                id
                name
                user {
                    id
                    username
                }
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

function createBulk(server, header, data) {
    const pubDate = new Date().toISOString();
    return fetch(server, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query: `mutation {
            createBulk (
                name: "${header.name}",
                surname: "${header.surname}",
                grade: "${header.grade}",
                section: "${header.section}",
                data: "${data}",
                quiz: "${header.unitId}",
                pubDate: "${pubDate}"
            ) {
                id
                data
            }
        }`})
    })
}

export {retrieveUsers, retrieveQuizzes, retrieveQuiz, createBulk};

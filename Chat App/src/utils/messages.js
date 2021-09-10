const generate = (text, username) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username

    }

}

const generateLoc = (text, username) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username

    }

}

module.exports = {generate, generateLoc}
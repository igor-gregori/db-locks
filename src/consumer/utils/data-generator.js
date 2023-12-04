const documents = ['08944250057', '66186651088', '85674932000', '34056717010', '31481674064']

const endpointInput = []

for (let i = 0; i <= 10; i++) {
    for (const document of documents) {
        endpointInput.push({
            doc: document,
            value: 1
        })
    }
}

console.log(JSON.stringify(endpointInput))

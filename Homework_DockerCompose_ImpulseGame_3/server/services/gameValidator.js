function gameResultValidation(data) {
    const validationScheme = createValidationScheme()

    if (Object.keys(data).length === 0) {
        validationScheme.errors.push('Объект формы пуст')
        validationScheme.isValid = false
        return validationScheme
    }

    if (!data.quantity_tasks) {
        validationScheme.errors.push('quantity_tasks должен быть больше 1')
        validationScheme.isValid = false
    }

    if (data.quantity_true_answers == null || data.quantity_true_answers == undefined) {
        validationScheme.errors.push('quantity_true_answers не должен быть пуст')
        validationScheme.isValid = false
    }

    if (data.quantity_true_answers < 0) {
        validationScheme.errors.push('quantity_true_answers должен быть > 0')
        validationScheme.isValid = false
    }

    return validationScheme
}

function gameEditValidation(data) {
    const validationScheme = createValidationScheme()

    if (Object.keys(data).length === 0) {
        validationScheme.errors.push('Объект формы пуст')
        validationScheme.isValid = false
        return validationScheme
    }

    if (!data.id_game_type) {
        validationScheme.errors.push('id_game_type не должен быть пустым')
        validationScheme.isValid = false
    }

    if (!data.description) {
        validationScheme.errors.push('description не должен быть пустым')
        validationScheme.isValid = false
    }

    return validationScheme
}

function createValidationScheme() {
    return {
        errors: [],
        isValid: true
    }
}

module.exports = {
    gameResultValidation,
    gameEditValidation
}
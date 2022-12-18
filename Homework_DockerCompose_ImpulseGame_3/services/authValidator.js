function loginValidation(data) {
    const validationScheme = createValidationScheme()

    if (Object.keys(data).length === 0) {
        validationScheme.errors.push('Объект формы пуст')
        validationScheme.isValid = false
        return validationScheme
    }

    if (!data.email) {
        validationScheme.errors.push('Email не должен быть пуст')
        validationScheme.isValid = false
    }

    if (!data.password) {
        validationScheme.errors.push('Пароль не должен быть пуст')
        validationScheme.isValid = false
    }

    return validationScheme
}

function registerValidation(data) {
    const validationScheme = createValidationScheme()

    if (Object.keys(data).length === 0) {
        validationScheme.errors.push('Объект формы пуст')
        validationScheme.isValid = false
        return validationScheme
    }

    if (!data.email) {
        validationScheme.errors.push('Email не должен быть пуст')
        validationScheme.isValid = false
    }

    if (!data.password) {
        validationScheme.errors.push('Пароль не должен быть пуст')
        validationScheme.isValid = false
    }

    if (!data.name) {
        validationScheme.errors.push('ФИО не должно быть пустым')
        validationScheme.isValid = false
    }

    const emailMatchResult = !!data.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    if (!emailMatchResult) {
        validationScheme.errors.push('Некорректный email')
        validationScheme.isValid = false
    }

    const passwordMatchResult = data.password.length < 6 || data.password.length > 25
    if (passwordMatchResult) {
        validationScheme.errors.push('Пароль должен содержать не менее 6 и не более 25 символов')
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
    loginValidation,
    registerValidation
}
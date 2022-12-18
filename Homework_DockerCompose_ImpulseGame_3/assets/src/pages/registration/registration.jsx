import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../../services/authService"

export const Registration = () => {
  const validationScheme = {
    email: useRef(),
    name: useRef(),
    password: useRef()
  }

  const navigate = useNavigate()

  const [validation, setIsValid] = useState({
    name: false,
    email: false,
    password: false
  })
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const validationResult = validation.email 
    && validation.name 
    && validation.password

  const changeInputHandler = (e) => {
    validate(e.target.name, e.target.value)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = (props, value) => {
    if (!value) {
      const input = validationScheme[props].current
      input.textContent = "Поле не должно быть пустым"
      setIsValid({...validation, [props]: false})
      return 
    }

    let isValid = true
    switch (props) {
      case "email": {
        const result = !!value.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
        if (!result) {
            validationScheme.email.current.textContent = "Некорректный email"
            isValid = false
        }
        break
      }
      case "password": {
        const result = value.length < 6 || value.length > 25
        if (result) {
            validationScheme.password.current.textContent = "Пароль должен содержать не менее 6 и не более 25 символов"
            isValid = false
        }
        break
      }
    }

    if (isValid) {
        validationScheme[props].current.textContent = ""
    }

    setIsValid({...validation, [props]: isValid})
  }

  const registerHandler = (e) => {
    e.preventDefault()
    register(form)
      .then( res => {
          alert('Register success')
          navigate('/login')
      })
      .catch( err => {
          alert(err.response.data.msg)
          setForm( { name: "", email: "", password: "", } )
          setIsValid ( { name: false, email: false, password: false } )
      })
  }

  return (
    <div className='container auth-container auth-container-background'>
      <form className='form' onSubmit={ e =>  registerHandler(e) }>
        <div className='input-group'>
          <label htmlFor='name' className='input-title'>
            ФИО
          </label>
          <input
            value={form.name}
            type='text'
            className='input-field'
            name='name'
            onBlur={(e) => validate(e.target.name, e.target.value)}
            onChange={(e) => changeInputHandler(e)}
          />
          <p className='validate-message' ref={validationScheme.name}></p>
        </div>
        <div className='input-group'>
          <label htmlFor='email' className='input-title'>
            Email
          </label>
          <input
            value={form.email}
            type='email'
            className='input-field'
            name='email'
            onBlur={(e) => validate(e.target.name, e.target.value)}
            onChange={(e) => changeInputHandler(e)}
          />
          <p className='validate-message' ref={validationScheme.email}></p>
        </div>
        <div className='input-group'>
          <label htmlFor='password' className='input-title'>
            Пароль
          </label>
          <input
            value={form.password}
            type='password'
            className='input-field'
            name='password'
            onBlur={(e) => validate(e.target.name, e.target.value)}
            onChange={(e) => changeInputHandler(e)}
          />
          <p className='validate-message' ref={validationScheme.password}></p>
        </div>
        <div className='input-group'>
          <button type="submit" className={ `btn ${!validationResult && 'disabled'}` }>Создать аккаунт</button>
        </div>
      </form>
    </div>
  )
}

import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"
import { login } from "../../services/authService"

export const Login = () => {
  const validationScheme = {
    email: useRef(),
    password: useRef(),
  }

  const authContext = useAuth()
  const navigate = useNavigate()

  const [validation, setIsValid] = useState({
    email: false,
    password: false,
  })

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const validationResult = validation.email && validation.password

  const changeInputHandler = (e) => {
    validate(e.target.name, e.target.value)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = (props, value) => {
    if (!value) {
      const input = validationScheme[props].current
      input.textContent = "Поле не должно быть пустым"
      setIsValid({ ...validation, [props]: false })
      return
    }

    let isValid = true
    if (isValid) {
      validationScheme[props].current.textContent = ""
    }

    setIsValid({ ...validation, [props]: isValid })
  }

  const loginHandler = (e) => {
    e.preventDefault()
    login(form)
      .then( res => {
          authContext.login(res.token)
          navigate('/')
      })
      .catch( err => {
          alert(err.response.data.msg)
          setForm( { email: "", password: "", } )
          setIsValid ( { email: false, password: false } )
      })
  }

  return (
    <div className='container auth-container auth-container-background'>
      <form className='form' onSubmit={ e =>  loginHandler(e) }>
        <div className='input-group'>
          <label htmlFor='email' className='input-title'>
            Email
          </label>
          <input
            type='email'
            className='input-field'
            name='email'
            onChange={(e) => changeInputHandler(e)}
            onBlur={(e) => validate(e.target.name, e.target.value)}
          />
          <p className='validate-message' ref={validationScheme.email}></p>
        </div>
        <div className='input-group'>
          <label htmlFor='password' className='input-title'>
            Пароль
          </label>
          <input
            type='password'
            className='input-field'
            name='password'
            onChange={(e) => changeInputHandler(e)}
            onBlur={(e) => validate(e.target.name, e.target.value)}
          />
          <p className='validate-message' ref={validationScheme.password}></p>
        </div>
        <div className='input-group'>
          <button className={ `btn ${!validationResult && 'disabled'}` }>Войти</button>
          <div className='login-create-account-group'>
            <span>Еще не зарегистрированы? </span>
            <a className='' href='/registration'>
              Создать аккаунт
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}

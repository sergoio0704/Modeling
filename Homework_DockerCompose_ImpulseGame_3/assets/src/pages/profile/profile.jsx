import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useAccount } from "../../context/accountContext"
import { useAuth } from "../../context/authContext"
import { useImg } from "../../hooks/img.hooks"
import { saveAccount } from "../../services/accountService"

export const Profile = () => {
  const {account} = useAccount()
  const {token} = useAuth()
  const { profileLogo } = useImg()
  const [profileForm, setProfileForm] = useState({
    name: account.name,
    avatar: account.avatar
  })

  const navigate = useNavigate()

  const inputFile = useRef()
  const avatarImg = useRef()
  const avatarURL = useRef()

  const editPhotoHandler = () => {
    inputFile.current.click()
  }

  const changeFormHandler = (key, value) => {
    setProfileForm({...profileForm, [key]: value})
  }

  const changePhotoHandler = (e) => {
    const reader = new FileReader()
    const file = e.target.files[0]
    if (!file)
        return
    reader.onload = (e) => {
        avatarImg.current.setAttribute('src', e.target.result)
        avatarURL.current = e.target.result
    }
    reader.readAsDataURL(file)
    changeFormHandler('avatar', file)
  }

  const saveFormHandler = (e) => {
    e.preventDefault()
    console.log(profileForm, token)
    saveAccount(profileForm, token)
      .then( res => alert('Изменения успешно сохранены'))
      .catch( err => alert('Произошла ошибка'))
  }

  return (
    <div className='profile'>
      {
        account.isAdmin &&  <div className="profile-admin-settings">
                              <button className="btn" onClick={e => navigate('/admin/game/edit')}>Редактировать игры</button>
                            </div>
      }
      <form className="profile-form"  onSubmit={e => saveFormHandler(e)}>
        <div className="profile-input-group profile-avatar" onClick={e => editPhotoHandler()}>
          <img src={account.avatar ? account.avatar : profileLogo} ref={avatarImg} alt={'avatar'}/>
          <input type={'file'}  ref={inputFile} name={'avatar'} onChange={e => changePhotoHandler(e)} hidden/>
        </div>
        <div className="profile-input-group">
            <label htmlFor="name" className="profile-input-title">ФИО</label>
            <input type="text" name="name" className="profile-input-value" onChange={e => changeFormHandler(e.target.name, e.target.value)} defaultValue={account.name}/>
        </div>
        <div className="profile-input-group">
            <label htmlFor="email" className="profile-input-title">Email</label>
            <input type="text" name="email" className="profile-input-value disabled" defaultValue={account.email}/>
        </div>
        <div className='profile-input-group'>
          <button type="submit" className={ `btn profile-save-btn` }>Сохранить</button>
        </div>
      </form>
    </div>
  )
}

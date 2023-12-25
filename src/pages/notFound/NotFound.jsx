import { Button } from 'antd'
import './NotFound.css'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

const NotFoundPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('translation')
  return (
    <div className="background">
      <div className="content">
        <h1 className="content-h1">Oops,</h1>
        <p className="content-p">{t('message.notfound_content')}</p>
        <Button
          type="primary"
          className="back-to-home-btn"
          onClick={() => navigate('/')}
        >
          {t('button_input.back_to_home')}
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage

import { Form, Input, Button, Typography, Select, Space } from 'antd'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import './Login.css'
import { useLogin } from '@hooks/useAuth'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const { Text, Title } = Typography

const Login = () => {
  const initialValues = {
    email: '',
    password: '',
    remember: true,
  }
  const { t, i18n } = useTranslation('translation')
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'eng'
  )

  const changeLanguage = value => {
    setSelectedLanguage(value)
    i18n.changeLanguage(value)
    // Save selected language to localStorage
    localStorage.setItem('selectedLanguage', value)
  }
  // Update language
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage)
  }, [selectedLanguage, i18n])

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validate.email_invalid'))
      .required(t('validate.email_validate')),
    password: Yup.string().required(t('validate.password')),
  })

  const { mutate: loginApi, isPending, isError, isSuccess } = useLogin()

  const onFinish = async values => {
    loginApi({ email: values.email, password: values.password })
  }

  return (
    <>
      <div className="language_container">
        <Space wrap>
          <Select
            value={selectedLanguage}
            style={{
              width: 120,
            }}
            onChange={changeLanguage}
            options={[
              {
                value: 'eng',
                label: t('English'),
              },
              {
                value: 'vi',
                label: t('Vietnamese'),
              },
            ]}
          />
        </Space>
      </div>
      <section className="section">
        <div className="container">
          <div className="header">
            <Title className="title">{t('title.sign_in')}</Title>
            <Text className="text">{t('sign_in_page.enter_sign_in')}</Text>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onFinish}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form onFinish={handleSubmit} layout="vertical">
                <div className="input_email">
                  <Form.Item
                    label={t('sign_in_page.email')}
                    validateStatus={
                      errors.email && touched.email ? 'error' : ''
                    }
                    help={errors.email && touched.email ? errors.email : ''}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder={t('sign_in_page.email')}
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </div>
                <div className="input_password">
                  <Form.Item
                    label={t('sign_in_page.password')}
                    validateStatus={
                      errors.password && touched.password ? 'error' : ''
                    }
                    help={
                      errors.password && touched.password ? errors.password : ''
                    }
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder={t('sign_in_page.password')}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </div>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                >
                  {t('button_input.login')}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
    </>
  )
}

export default Login

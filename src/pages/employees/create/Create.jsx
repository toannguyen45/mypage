import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Upload,
  message,
  Empty,
} from 'antd'
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { showToast } from '@components/toast/ToastCustom'
import Breadcrumb from '@components/admin/Breadcrumb/Breadcrumb'
import { useCreateEmployee } from '@hooks/useEmployee'
import { useGetManagers } from '@hooks/useManager'
import { useGetPositions } from '@hooks/usePosition'
import enUS from 'antd/locale/en_US'
import viVN from 'antd/locale/vi_VN'
import 'dayjs/locale/en-au'
import 'dayjs/locale/vi'
import './Create.css'

const CreateEmployee = () => {
  const { mutate: createEmployeeApi, isPending } = useCreateEmployee()
  const { data: positions, isLoading } = useGetPositions()
  const { data: managers } = useGetManagers()
  const { t } = useTranslation('translation')
  const [datePickerLocale, setDatePickerLocale] = useState(enUS)
  const [avatar, setAvatar] = useState(null)
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage')

    if (savedLanguage === 'eng') {
      setDatePickerLocale(enUS)
    } else if (savedLanguage === 'vi') {
      setDatePickerLocale(viVN)
    }

    forceUpdate()
  }, [forceUpdate])

  const navigate = useNavigate()

  const checkFile = file => {
    const isImage = file.type.startsWith('image/')

    if (!isImage) {
      message.error('You can only upload image files!')
    } else {
      setAvatar(file)
    }

    return false
  }

  if (isLoading) {
    return <Spin spinning={isLoading} fullscreen />
  }

  const breadcrumbItems = [
    {
      key: 'dashboard',
      title: t('breadcrumbs.dashboard'),
      route: '/admin/dashboard',
    },
    {
      key: 'employees',
      title: t('breadcrumbs.employees'),
      route: '/admin/employees',
    },
    {
      key: 'create',
      title: t('breadcrumbs.create'),
      route: `/admin/employees/create`,
    },
  ]

  const defaultPosition = positions ? positions[0].name : ''
  const initialValues = {
    name: '',
    email: '',
    code: '',
    phone: '',
    identity: '',
    dob: null,
    gender: 'male',
    status: 'active',
    is_manager: false,
    position: defaultPosition,
    manager: '',
    skills: [{ skill: '', experience: '' }],
    description: '',
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^([a-zA-Z]\s*)+$/, t('validate.name_validate'))
      .min(3, t('validate.name_validate_min'))
      .max(40, t('validate.name_validate_max'))
      .required(t('validate.name_require')),
    email: Yup.string()
      .email(t('validate.email_invalid'))
      .required(t('validate.email_validate')),
    code: Yup.string().required(t('validate.code_validate')),
    phone: Yup.string()
      .required(t('validate.phone_validate'))
      .matches(/^[0-9]+$/, t('validate.phone_matches'))
      .min(9, t('validate.phone_valid'))
      .max(10, t('validate.phone_valid')),
    identity: Yup.string()
      .required(t('validate.card_require'))
      .matches(/^\d{1,20}$/, t('validate.card_validate')),
    dob: Yup.date().required(t('validate.dob_validate')),
    gender: Yup.string(),
    status: Yup.string(),
    position: Yup.string(),
    is_manager: Yup.bool(),
    manager: Yup.string(),
    skills: Yup.array()
      .of(
        Yup.object().shape({
          skill: Yup.string()
            .required(t('validate.skill_require'))
            .matches(/^([a-zA-Z]\s*)+$/, t('validate.skill_validate')),
          experience: Yup.string()
            .required(t('validate.experience_require'))
            .matches(/^\d+(\.\d+)?$/, t('validate.experience_validate')),
        })
      )
      .required(t('validate.skills_require'))
      .min(1, t('validate.skills_validate')),
    description: Yup.string(),
  })

  const handleFormSubmit = async values => {
    const formattedValues = {
      ...values,
      dob: moment(values.dob.$d).format('YYYY-MM-DD'),
    }

    const formData = new FormData()
    Object.entries(formattedValues).forEach(([key, value]) => {
      if (key === 'skills') {
        value.forEach((skills, index) => {
          formData.append(`skills[${index}][name]`, skills.skill)
          formData.append(`skills[${index}][year]`, skills.experience)
        })
      } else {
        formData.append(key, value)
      }
    })
    formData.append('avatar', avatar)

    try {
      await createEmployeeApi(formData, {
        onSuccess: () => {
          showToast(t('message.create_employee_success'), 'success')
          navigate('/admin/employees')
        },
        onError: () => {
          showToast(t('message.create_employee_fail'), 'error')
        },
      })
    } catch (error) {}
  }

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          validateField,
        }) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
          >
            <Row
              gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}
              className="form-container"
            >
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('employee.name_employee')}
                  name="name"
                  required
                  validateStatus={errors.name && touched.name ? 'error' : ''}
                  help={errors.name && touched.name ? errors.name : ''}
                >
                  <Input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('employee.email_employee')}
                  name="email"
                  required
                  validateStatus={errors.email && touched.email ? 'error' : ''}
                  help={errors.email && touched.email ? errors.email : ''}
                >
                  <Input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('employee.code')}
                  name="code"
                  required
                  validateStatus={errors.code && touched.code ? 'error' : ''}
                  help={errors.code && touched.code ? errors.code : ''}
                >
                  <Input
                    name="code"
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>{' '}
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('employee.phone_number_employee')}
                  name="phone"
                  required
                  validateStatus={errors.phone && touched.phone ? 'error' : ''}
                  help={errors.phone && touched.phone ? errors.phone : ''}
                >
                  <Input
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('employee.identity')}
                  name="identity"
                  required
                  validateStatus={
                    errors.identity && touched.identity ? 'error' : ''
                  }
                  help={
                    errors.identity && touched.identity ? errors.identity : ''
                  }
                >
                  <Input
                    name="identity"
                    value={values.identity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('employee.date_of_birth_employee')}
                  name="dob"
                  required
                  validateStatus={errors.dob && touched.dob ? 'error' : ''}
                  help={errors.dob && touched.dob ? errors.dob : ''}
                >
                  <ConfigProvider locale={datePickerLocale}>
                    <DatePicker
                      placement="bottomRight"
                      name="dob"
                      className="dob"
                      disabledDate={current =>
                        (current && current > moment().endOf('day')) ||
                        (current &&
                          current > moment().subtract(18, 'years').endOf('day'))
                      }
                      onChange={value => setFieldValue('dob', value)}
                      onBlur={handleBlur}
                      value={values.dob}
                    />
                  </ConfigProvider>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
              <Col xs={24} md={12}>
                <Row gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('employee.gender_employee')}
                      name="gender"
                      validateStatus={
                        errors.gender && touched.gender ? 'error' : ''
                      }
                      help={errors.gender && touched.gender && errors.gender}
                    >
                      <Select
                        name="gender"
                        onChange={value => setFieldValue('gender', value)}
                        onBlur={handleBlur}
                        defaultValue={values.gender}
                      >
                        <Select.Option value="male">
                          {t('employee.male')}
                        </Select.Option>
                        <Select.Option value="female">
                          {t('employee.female')}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('employee.status_employee')}
                      name="status"
                      validateStatus={
                        errors.status && touched.status ? 'error' : ''
                      }
                      help={errors.status && touched.status && errors.status}
                    >
                      <Select
                        name="status"
                        onChange={value => setFieldValue('status', value)}
                        onBlur={handleBlur}
                        defaultValue={values.status}
                      >
                        <Select.Option value={'active'}>
                          {t('employee.active')}
                        </Select.Option>
                        <Select.Option value={'inactive'}>
                          {t('employee.inactive')}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={12}>
                <Row gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('employee.position_employee')}
                      name="position"
                      validateStatus={
                        errors.position && touched.position ? 'error' : ''
                      }
                      help={
                        errors.position && touched.position && errors.position
                      }
                    >
                      <Select
                        name="position"
                        onChange={value => setFieldValue('position', value)}
                        onBlur={handleBlur}
                        defaultValue={values.position}
                      >
                        {positions?.map(pos => (
                          <Select.Option key={pos.id} value={pos.name}>
                            {pos.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={t('employee.manager')}
                      name="manager"
                      validateStatus={
                        errors.manager && touched.manager ? 'error' : ''
                      }
                      help={errors.manager && touched.manager && errors.manager}
                    >
                      <Select
                        name="manager"
                        notFoundContent={
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={t('employee.no_data')}
                          />
                        }
                        onChange={value => setFieldValue('manager', value)}
                        onBlur={handleBlur}
                        defaultValue={values.manager}
                      >
                        {managers?.map(m => (
                          <Select.Option key={m.id} value={m.id}>
                            {m.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
              <Col xs={24} md={12}>
                <Form.Item label={t('employee.skill')} required>
                  <Form.List name="skills">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            style={{
                              display: 'flex',
                              marginBottom: 8,
                            }}
                            align="baseline"
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'skill']}
                              validateStatus={
                                errors?.skills?.[name]?.skill &&
                                touched?.skills?.[name]?.skill
                                  ? 'error'
                                  : ''
                              }
                              help={
                                errors?.skills?.[name]?.skill &&
                                touched?.skills?.[name]?.skill
                                  ? errors.skills[name].skill
                                  : ''
                              }
                            >
                              <Input
                                placeholder={t('employee.skill_placeholder')}
                                onChange={e => {
                                  setFieldValue(
                                    `skills[${name}].skill`,
                                    e.target.value
                                  )
                                  validateField(`skills[${name}].skill`)
                                }}
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'experience']}
                              validateStatus={
                                errors?.skills?.[name]?.experience &&
                                touched?.skills?.[name]?.experience
                                  ? 'error'
                                  : ''
                              }
                              help={
                                errors?.skills?.[name]?.experience &&
                                touched?.skills?.[name]?.experience
                                  ? errors.skills[name].experience
                                  : ''
                              }
                            >
                              <Input
                                placeholder={t(
                                  'employee.experience_placeholder'
                                )}
                                onChange={e => {
                                  setFieldValue(
                                    `skills[${name}].experience`,
                                    e.target.value
                                  )
                                  validateField(`skills[${name}].experience`)
                                }}
                              />
                            </Form.Item>
                            <MinusCircleOutlined
                              onClick={() => {
                                if (fields.length > 1) {
                                  const newSkills = values.skills.filter(
                                    (_, index) => index !== name
                                  )
                                  setFieldValue('skills', newSkills)
                                  remove(name, key)
                                }
                              }}
                              disabled={fields.length === 1}
                            />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            {t('employee.add_skill')}
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('employee.description_employee')}
                  name="description"
                  validateStatus={
                    errors.description && touched.description ? 'error' : ''
                  }
                  help={
                    errors.description &&
                    touched.description &&
                    errors.description
                  }
                >
                  <Input.TextArea
                    rows={4}
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label={t('employee.is_manager')} name="is_manager">
              <Checkbox
                name="is_manager"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.is_manager}
              ></Checkbox>
            </Form.Item>
            <Form.Item label={t('employee.avatar')}>
              <Upload
                name="avatar"
                listType="picture"
                accept="image/*"
                maxCount={1}
                beforeUpload={checkFile}
                onRemove={() => setAvatar(null)}
              >
                <Button icon={<UploadOutlined />}>
                  {t('employee.upload_avatar')}
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isPending}>
                {t('button_input.create')}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </>
  )
}

const useForceUpdate = () => {
  const [, setValue] = useState(0)
  return () => setValue(value => ++value)
}

export default CreateEmployee

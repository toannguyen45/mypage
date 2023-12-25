import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Badge,
  Empty,
} from 'antd'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { showToast } from '@components/toast/ToastCustom'
import Breadcrumb from '@components/admin/Breadcrumb/Breadcrumb'
import { useUpdateProject, useGetProjectById } from '@hooks/useProject'
import { useGetManagers } from '@hooks/useManager'
import { useGetEmployees } from '@hooks/useEmployee'
import { useGetTechnicals } from '@hooks/useTechnical'
import enUS from 'antd/locale/en_US'
import viVN from 'antd/locale/vi_VN'
import 'dayjs/locale/en-au'
import 'dayjs/locale/vi'
import './Edit.css'

const EditProject = () => {
  const { id } = useParams()
  const { mutate: updateProjectApi, isPending } = useUpdateProject()
  const { data: projectDetail, isLoading: loadingProject } =
    useGetProjectById(id)
  const { data: managers, isLoading: loadingManager } = useGetManagers()
  const { data: employees, isLoading: loadingEmployees } = useGetEmployees({
    pageSize: 10000,
  })
  const { data: technicalsDB, isLoading: loadingTechnicalsDB } =
    useGetTechnicals()
  const { t } = useTranslation('translation')
  const [endDate, setEndDate] = useState()
  const [teamMembers, setTeamMembers] = useState([])
  const [technicals, setTechnicals] = useState([])
  const [datePickerLocale, setDatePickerLocale] = useState(enUS)
  const navigate = useNavigate()

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

  useEffect(() => {
    if (!loadingProject) {
      const selectListTeamMembers =
        projectDetail.employees
          ?.filter(e =>
            e?.periods?.some(period => period.leaving_time === null)
          )
          .map(e => e) || []

      setTeamMembers(selectListTeamMembers)
      setTechnicals(projectDetail.technical)
    }
  }, [loadingManager, loadingEmployees, loadingTechnicalsDB, loadingProject])

  if (
    loadingManager ||
    loadingEmployees ||
    loadingTechnicalsDB ||
    loadingProject
  ) {
    return <Spin spinning={true} fullscreen />
  }

  const breadcrumbItems = [
    {
      key: 'dashboard',
      title: t('breadcrumbs.dashboard'),
      route: '/admin/dashboard',
    },
    {
      key: 'projects',
      title: t('breadcrumbs.projects'),
      route: '/admin/projects',
    },
    {
      key: 'edit',
      title: t('breadcrumbs.edit'),
      route: `/admin/projects/edit/${id}`,
    },
  ]

  // Initial Value for team member and technical
  const selectListTechnicals = []
  const selectListTeamMembers =
    projectDetail.employees
      ?.filter(e => e?.periods?.some(period => period.leaving_time === null))
      .map(e => e.id) || []
  selectListTechnicals.push(
    ...(projectDetail.technical?.filter(t => t?.id)?.map(t => t.id) || [])
  )
  const dateFormat = 'YYYY-MM-DD HH:mm:ss'

  const activeEmployees = employees?.data?.filter(
    employee => employee.status === 'active'
  )

  const initialValues = {
    name: projectDetail.name,
    manager: projectDetail.manager,
    employees: selectListTeamMembers,
    status: projectDetail.status,
    start_date: dayjs(projectDetail.start_date, dateFormat),
    end_date: dayjs(projectDetail.end_date, dateFormat),
    description: projectDetail.description,
    technical: selectListTechnicals,
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^([a-zA-Z0-9]\s*)+$/, t('project_validate.name_valid'))
      .max(128, t('project_validate.name_max'))
      .required(t('project_validate.name_require')),
    manager: Yup.string().required(t('project_validate.manager_require')),
    employees: Yup.array().min(1, t('project_validate.employees_require')),
    technical: Yup.array().min(1, t('project_validate.technical_require')),
    start_date: Yup.date().required(t('project_validate.start_day_require')),
    end_date: Yup.date()
      .required(t('project_validate.end_day_require'))
      .min(Yup.ref('start_date'), t('project_validate.end_day_min')),
    status: Yup.string(),
    description: Yup.string(),
  })

  const handleFormSubmit = async values => {
    const formattedValues = {
      ...values,
      employees: teamMembers.map(m => ({
        id: m.id,
      })),
      technical: technicals.map(t => ({
        id: t.id,
        name: t.name,
      })),
      start_date: moment(values.start_date.$d).format('YYYY-MM-DD HH:mm:ss'),
      end_date: moment(values.end_date.$d).format('YYYY-MM-DD HH:mm:ss'),
    }

    try {
      await updateProjectApi(
        { id: id, data: formattedValues },
        {
          onSuccess: () => {
            showToast(t('message.Update_project_success'), 'success')
            navigate('/admin/projects')
          },
          onError: () => {
            showToast(t('message.Update_project_fail'), 'error')
          },
        }
      )
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
                  label={t('project.name')}
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
                  label={t('project.manager')}
                  name="manager"
                  required
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

            <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('project.start_date')}
                  name="start_date"
                  required
                  validateStatus={
                    errors.start_date && touched.start_date ? 'error' : ''
                  }
                  help={
                    errors.start_date && touched.start_date
                      ? errors.start_date
                      : ''
                  }
                >
                  <ConfigProvider locale={datePickerLocale}>
                    <DatePicker
                      placement="bottomRight"
                      name="start_date"
                      className="datePicker"
                      onChange={value => {
                        setFieldValue('start_date', value)
                        if (values.end_date && values.end_date < value) {
                          setFieldValue('end_date', null)
                        } else if (values.end_date === null) {
                          setFieldValue('end_date', endDate)
                        }
                      }}
                      onBlur={handleBlur}
                      value={values.start_date}
                      disabledDate={current =>
                        current && current < moment().startOf('day')
                      }
                    />
                  </ConfigProvider>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('project.end_date')}
                  name="end_date"
                  required
                  validateStatus={
                    errors.end_date && touched.end_date ? 'error' : ''
                  }
                  help={
                    errors.end_date && touched.end_date ? errors.end_date : ''
                  }
                >
                  <ConfigProvider locale={datePickerLocale}>
                    <DatePicker
                      placement="bottomRight"
                      name="end_date"
                      className="datePicker"
                      onChange={value => {
                        setFieldValue('end_date', value)
                        setEndDate(value)
                      }}
                      onBlur={handleBlur}
                      value={values.end_date}
                      disabledDate={current =>
                        !values.start_date ||
                        (current && current < values.start_date)
                      }
                    />
                  </ConfigProvider>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('project.team_members')}
                  name="employees"
                  required
                  validateStatus={
                    errors.employees && touched.employees ? 'error' : ''
                  }
                  help={
                    errors.employees && touched.employees && errors.employees
                  }
                >
                  <Select
                    mode="multiple"
                    name="employees"
                    notFoundContent={
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t('employee.no_data')}
                      />
                    }
                    placeholder={t('project.team_members_placeholder')}
                    maxTagCount={3}
                    defaultValue={values.employees}
                    onBlur={handleBlur}
                    onChange={selectedValues => {
                      const selectedMembers = employees?.data.filter(employee =>
                        selectedValues.includes(employee.id)
                      )
                      setTeamMembers(selectedMembers)
                      setFieldValue('employees', selectedMembers)
                    }}
                  >
                    {activeEmployees?.map(e => (
                      <Select.Option key={e.id} value={e.id}>
                        {e.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('project.technicals')}
                  name="technical"
                  required
                  validateStatus={
                    errors.technical && touched.technical ? 'error' : ''
                  }
                  help={
                    errors.technical && touched.technical && errors.technical
                  }
                >
                  <Select
                    mode="multiple"
                    name="technical"
                    notFoundContent={
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={t('employee.no_data')}
                      />
                    }
                    placeholder={t('project.technical_placeholder')}
                    maxTagCount={3}
                    defaultValue={values.technical}
                    onBlur={handleBlur}
                    onChange={selectedValues => {
                      const selectedTechnicals = technicalsDB?.filter(t =>
                        selectedValues.includes(t.id)
                      )
                      setTechnicals(selectedTechnicals)
                      setFieldValue('technical', selectedTechnicals)
                    }}
                  >
                    {technicalsDB?.map(t => (
                      <Select.Option key={t.id} value={t.id}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('project.status')}
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
                    <Select.Option value={'Pending'}>
                      <Badge
                        status="warning"
                        text={t('project.pending_status')}
                      />
                    </Select.Option>
                    <Select.Option value={'In Progress'}>
                      <Badge
                        status="processing"
                        text={t('project.in_progress_status')}
                      />
                    </Select.Option>
                    <Select.Option value={'Cancelled'}>
                      <Badge
                        status="error"
                        text={t('project.cancelled_status')}
                      />
                    </Select.Option>
                    <Select.Option value={'Done'}>
                      <Badge status="success" text={t('project.done_status')} />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={t('project.description')}
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

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isPending}>
                {t('button_input.edit')}
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

export default EditProject

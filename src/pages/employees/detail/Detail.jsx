import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Flex,
  Row,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import Breadcrumb from '@components/admin/Breadcrumb/Breadcrumb'
import {
  useGetEmployeeById,
  useGetProjectsByEmployeeId,
} from '@hooks/useEmployee'
import ExportDocx from '@pages/CV/cv'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import './Detail.css'

const { TabPane } = Tabs

const EmployeeDetail = () => {
  const { id } = useParams()
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const { data: employee_details, isLoading, isError } = useGetEmployeeById(id)

  useEffect(() => {
    if (isError) {
      navigate('/404')
    }
  }, [isError, navigate])

  const { data: dataProject, isLoading: isLoadingProject } =
    useGetProjectsByEmployeeId(id, searchText)

  const { t } = useTranslation('translation')

  console.log(dataProject)
  const getStatusDotColor = () => {
    return employee_details.status === 'active' ? 'green' : 'red'
  }

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
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
      key: 'detail',
      title: t('breadcrumbs.employee_details'),
      route: `/admin/employees/detail/${id}`,
    },
  ]

  const displayValue = value => {
    return value !== null && value !== undefined ? value : ''
  }

  if (isLoading || !employee_details || isLoadingProject) {
    return <Spin spinning={true} fullscreen />
  }
  // Function to get colors
  const getTagColor = index => {
    const colors = [
      '#2a9d8f',
      '#7cb518',
      '#6A8EAE',
      '#944bbb',
      '#219ebc',
      '#e76f51',
      '#f47795',
      '#ff9100',
      '#d90429',
      '#ef7a85',
    ]
    return colors[index % colors.length]
  }

  const employeeDetailsDescriptions = [
    {
      key: 'gender',
      label: t('employee_details.gender'),
      children: capitalizeFirstLetter(
        displayValue(t(`employee_details.genders.${employee_details?.gender}`))
      ),
      labelStyle: { fontWeight: 'bold' },
    },
    {
      key: 'identity_code',
      label: t('employee_details.identity_code'),
      children: employee_details?.identity,
      labelStyle: { fontWeight: 'bold' },
    },
    {
      key: 'phone_number',
      label: t('employee_details.phone_number'),
      children: employee_details?.phone,
      labelStyle: { fontWeight: 'bold' },
    },
    {
      key: 'dob',
      label: t('employee_details.dob'),
      children: employee_details?.dob,
      labelStyle: { fontWeight: 'bold' },
    },
    {
      key: 'is_manager',
      label: t('employee_details.is_manager'),
      children: capitalizeFirstLetter(
        displayValue(
          t(`employee_details.is_managers.${employee_details?.is_manager}`)
        )
      ),
      labelStyle: { fontWeight: 'bold' },
    },
    {
      key: 'line_manager',
      label: t('employee_details.line_manager'),
      children: capitalizeFirstLetter(
        displayValue(employee_details?.manager?.name) ||
          t('employee_details.no_manager')
      ),
      labelStyle: { fontWeight: 'bold' },
      span: 2,
    },
    {
      key: 'skill',
      label: t('employee_details.skill'),
      labelStyle: { fontWeight: 'bold' },
      children: (
        <div>
          {employee_details.skills.map((skill, index) => (
            <Tag
              key={skill.name}
              color={getTagColor(index)}
              style={{ padding: '5px', marginBottom: '5px' }}
            >
              {capitalizeFirstLetter(skill.name)} - {skill.year}{' '}
              {t('employee_details.years')}
            </Tag>
          ))}
        </div>
      ),
      span: 3,
    },
    {
      key: 'description_employee',
      label: t('employee_details.description_employee'),
      children: capitalizeFirstLetter(
        displayValue(employee_details?.description) ||
          t('employee_details.no_description')
      ),
      span: 3,
      labelStyle: { fontWeight: 'bold' },
    },
  ]

  return (
    <div className="page-container">
      <Breadcrumb items={breadcrumbItems} />
      <ExportDocx />
      <Tabs
        defaultActiveKey="1"
        tabPosition="top"
        animated={true}
        style={{ height: '100%' }}
      >
        <TabPane tab={<span> {t('employee_details.profile')}</span>} key="1">
          {/* Content for Profile tab */}
          <Card style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
            <Row gutter={{ sm: 24, md: 24 }} className="info_employee">
              <Col sm={24} lg={12}>
                <Flex>
                  <Avatar
                    src={employee_details.avatar}
                    alt="Employee Avatar"
                    className="avt"
                    icon={<UserOutlined />}
                    size={95}
                  />
                  <div className="employee_title">
                    <p className="employee_name">{employee_details?.name}</p>
                    <p className="employee_position">
                      {employee_details?.position}
                    </p>
                    <div className="status-show">
                      <div
                        className="status-dot"
                        style={{ backgroundColor: getStatusDotColor() }}
                      ></div>
                      <p className="status-text">
                        {employee_details?.status === 'active'
                          ? t('employee_details.active')
                          : t('employee_details.inactive')}
                      </p>
                    </div>
                  </div>
                </Flex>
              </Col>
              <Col sm={24} lg={12} style={{ marginTop: '15px' }}>
                <Row style={{ marginBottom: '5px' }}>
                  <p className="employee_label">
                    {t('employee_details.employee_code')}
                    {' : '}
                  </p>
                  <p className="employee_info">{employee_details?.code}</p>
                </Row>

                <Row style={{ marginBottom: '5px' }}>
                  <p className="employee_label">Email :</p>
                  <p className="employee_info">
                    {capitalizeFirstLetter(
                      displayValue(employee_details?.email)
                    )}
                  </p>
                </Row>
              </Col>
            </Row>
          </Card>

          <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 24 }}>
            <Col md={24} lg={24}>
              <Card
                style={{
                  marginTop: 20,
                  width: '100%',
                  backgroundColor: ' rgb(245, 245, 245)',
                }}
              >
                <Row gutter={16} justify="center" align="middle" column={2}>
                  <Col span={23}>
                    <p className="title">
                      {t('employee_details.personal_info')}
                    </p>
                    <hr className="profile_line" />

                    <Col span={24}>
                      {/* <Descriptions
                        column={2}
                        bordered
                        className="custom-descriptions"
                      >
                        <Descriptions.Item
                          label={
                            <span style={{ fontWeight: 'bold' }}>
                              {t('employee_details.gender')}
                            </span>
                          }
                          className="custom-label"
                        >
                          {capitalizeFirstLetter(
                            displayValue(
                              t(
                                `employee_details.genders.${employee_details?.gender}`
                              )
                            )
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span style={{ fontWeight: 'bold' }}>
                              {t('employee_details.identity_code')}
                            </span>
                          }
                          className="custom-label"
                        >
                          {employee_details?.identity}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span style={{ fontWeight: 'bold' }}>
                              {t('employee_details.phone_number')}
                            </span>
                          }
                          className="custom-label"
                        >
                          {employee_details?.phone}
                        </Descriptions.Item>

                        <Descriptions.Item
                          label={
                            <span style={{ fontWeight: 'bold' }}>
                              {t('employee_details.dob')}
                            </span>
                          }
                          className="custom-label"
                        >
                          {employee_details?.dob}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span style={{ fontWeight: 'bold' }}>
                              {t('employee_details.is_manager')}
                            </span>
                          }
                          className="custom-label"
                        >
                          {capitalizeFirstLetter(
                            displayValue(
                              t(
                                `employee_details.is_managers.${employee_details?.is_manager}`
                              )
                            )
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <span style={{ fontWeight: 'bold' }}>
                              {t('employee_details.description_employee')}
                            </span>
                          }
                          span={2}
                          className="custom-label"
                        >
                          {capitalizeFirstLetter(
                            displayValue(employee_details?.description) ||
                              t('employee_details.no_description')
                          )}
                        </Descriptions.Item>

                        <Descriptions.Item
                          label={
                            <span style={{ fontWeight: 'bold' }}>
                              {t('employee_details.skill')}
                            </span>
                          }
                          span={2} // span to cover two columns
                          className="custom-label"
                        >
                          {employee_details.skills.map((skill, index) => (
                            <Tag
                              key={skill.name}
                              color={getTagColor(index)}
                              style={{ padding: '5px' }}
                            >
                              {capitalizeFirstLetter(skill.name)} - {skill.year}{' '}
                              {t('employee_details.years')}
                            </Tag>
                          ))}
                        </Descriptions.Item>
                      </Descriptions> */}
                      <Descriptions
                        layout="vertical"
                        bordered
                        items={employeeDetailsDescriptions}
                      />
                    </Col>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>
        {/* next page */}

        <TabPane tab={<span>{t('employee_details.project')}</span>} key="3">
          <Row gutter={[16, 16]}>
            {dataProject.length > 0 ? (
              dataProject.map(item => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <Card
                    actions={[
                      <Avatar.Group
                        maxCount={2}
                        key="avatar"
                        style={{ cursor: 'default' }}
                      >
                        {item.employees.map(employee => (
                          <Tooltip title={employee?.name} key={employee?.id}>
                            <Avatar
                              icon={<UserOutlined />}
                              src={employee?.avatar}
                            />
                          </Tooltip>
                        ))}
                      </Avatar.Group>,
                      <span key={'date'} className="pro_date">
                        <CalendarOutlined />
                        {moment(item.start_date).format('YYYY-MM-DD')}
                      </span>,
                    ]}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Space
                          size="large"
                          style={{
                            width: '100%',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography.Title
                            level={4}
                            className="pro_title"
                            style={{ margin: 0 }}
                          >
                            {item.name}
                          </Typography.Title>
                          <a
                            href={`/admin/projects/detail/${item.id}`}
                            className="pro_eye"
                          >
                            <EyeOutlined />
                          </a>
                        </Space>
                      </Col>

                      <Col>
                        {item.status === 'Pending' && (
                          <Tag color="#faad14">
                            {t('project.pending_status')}
                          </Tag>
                        )}
                        {item.status === 'In Progress' && (
                          <Tag color="#1677ff">
                            {t('project.in_progress_status')}
                          </Tag>
                        )}
                        {item.status === 'Cancelled' && (
                          <Tag color="#ff4d4f">
                            {t('project.cancelled_status')}
                          </Tag>
                        )}
                        {item.status === 'Done' && (
                          <Tag color="#52c41a">{t('project.done_status')}</Tag>
                        )}
                      </Col>
                      <Col span={24} className="card-responsive-role">
                        {item.currentEmployee.role.map((role, index) => (
                          <Tag
                            style={{ marginBottom: '5px' }}
                            key={index}
                            color={
                              role === 'Project Manager' ? 'green' : 'error'
                            }
                          >
                            {role}
                          </Tag>
                        ))}
                      </Col>
                      <Col
                        style={{ height: '70px' }}
                        span={24}
                        className="pro_description"
                      >
                        {item.description ? (
                          item.description
                        ) : (
                          <span>{t('employee_details.no_description')}</span>
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <div
                  style={{
                    textAlign: 'center',
                    color: 'gray',
                    marginTop: '10%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    width="84"
                    height="61"
                    viewBox="0 0 64 41"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      transform="translate(0 1)"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <ellipse
                        fill="#f5f5f5"
                        cx="32"
                        cy="33"
                        rx="32"
                        ry="7"
                      ></ellipse>
                      <g fillRule="nonzero" stroke="#d9d9d9">
                        <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                        <path
                          d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                          fill="#fafafa"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  {t('employee_details.no_projects')}
                </div>
              </Col>
            )}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default EmployeeDetail

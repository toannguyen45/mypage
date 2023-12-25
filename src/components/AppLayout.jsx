import {
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { showToast } from '@components/toast/ToastCustom'
import { logout } from '@redux/Slice/authSlice'
import { setSelectedKey } from '@redux/Slice/menuSlice'
import { Button, Layout, Menu, Select, Space, theme } from 'antd'
import { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logoImage from '../assets/img/GenTech-Logo.png'
import './AppLayout.css'
import Spinner from './admin/Spinner/Spinner'
import Modal from 'antd/lib/modal/Modal'

const { Header, Sider, Content } = Layout

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [isImageSmall, setIsImageSmall] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { t, i18n } = useTranslation('translation')
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'eng'
  )

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedKey = useSelector(state => state.menu)

  useEffect(() => {
    const storedSelectedKey = localStorage.getItem('selectedKey')
    if (storedSelectedKey) {
      dispatch(setSelectedKey(storedSelectedKey))
    }
  }, [dispatch])

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

  const handleImageSize = () => {
    setIsImageSmall(!isImageSmall)
  }
  const handleClick = () => {
    navigate('/admin/dashboard')
    dispatch(setSelectedKey('/admin/dashboard'))
  }
  const handleLogout = () => {
    setShowLogoutModal(true)
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Modal
        title={t('title.logout_Modal')}
        okText={t('message.yes')}
        cancelText={t('message.no')}
        visible={showLogoutModal}
        onOk={() => {
          dispatch(logout())
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          showToast(t('message.logout'), 'success')
          setShowLogoutModal(false)
        }}
        onCancel={() => {
          setShowLogoutModal(false)
        }}
      >
        <p>{t('message.logout_Modal_Message')}</p>
      </Modal>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <img
            src={logoImage}
            alt="Logo"
            style={{
              height: isImageSmall ? '20px' : '50px',
              cursor: 'pointer',
            }}
            onKeyDown={handleClick}
            onClick={handleClick}
          />
        </Header>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          onClick={item => {
            if (item.key === '/logout') {
              handleLogout()
            } else {
              localStorage.setItem('selectedKey', item.key)
              dispatch(setSelectedKey(item.key))
              navigate(item.key)
            }
          }}
          items={[
            {
              key: '/admin/dashboard',
              icon: <DashboardOutlined />,
              label: t('side_menu.dashboard_label'),
            },
            {
              key: '/admin/employees',
              icon: <UserOutlined />,
              label: t('side_menu.employee_management_label'),
            },
            {
              key: '/admin/projects',
              icon: <ProjectOutlined />,
              label: t('side_menu.project_management_label'),
            },
            {
              key: '/logout',
              icon: <LogoutOutlined />,
              label: t('side_menu.logout'),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              setCollapsed(!collapsed)
              handleImageSize()
            }}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space wrap>
            <Select
              value={selectedLanguage}
              style={{
                right: 15,
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
                  label: t('Tiếng Việt'),
                },
              ]}
            />
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: 'auto',
            maxHeight: '84vh',
          }}
        >
          <Suspense fallback={<Spinner />}>{children}</Suspense>
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout

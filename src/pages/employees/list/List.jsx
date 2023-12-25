/* eslint-disable no-undef */
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { CustomSearch, CustomTable } from '@components/custom/CustomTable'
import { showToast } from '@components/toast/ToastCustom'
import { useGetEmployees, useUpdateEmployee } from '@hooks/useEmployee'
import { Button, Empty, Tag } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import Breadcrumb from '../../../components/admin/Breadcrumb/Breadcrumb'
import DeleteEmployee from '../delete/delete'
import '../../../components/custom/CustomTable.css'

const EmployeeList = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('translation')

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
  ]

  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 })
  const [sort, setSort] = useState({ sortColumn: 'id', sortOrder: 'asc' })
  const [searchText, setSearchText] = useState('')

  const { data, isLoading } = useGetEmployees({
    ...pagination,
    ...sort,
    searchText,
  })

  const edit = id => {
    navigate('/admin/employees/edit/' + id)
  }

  const viewDetail = record => {
    navigate(`/admin/employees/detail/${record.id}`)
  }

  const deleteRecord = recordId => {}

  const { mutateAsync: updateApi } = useUpdateEmployee()

  const toggleStatus = async (id, status) => {
    try {
      updateApi(
        {
          id: id,
          data: { status: status === 'active' ? 'inactive' : 'active' },
        },
        {
          onSuccess: data => {
            const successMessage =
              data.status === 'active'
                ? t('message.activated_successfully')
                : t('message.deactivated_successfully')

            showToast(successMessage, 'success')
          },
          onError: error => {
            showToast(t('message.status_update_failed'), 'error')
          },
        }
      )
    } catch (error) {
      showToast(t('message.status_update_failed'), 'error')
    }
  }

  const handleChange = e => {
    const value = e.target.value
    setSearchText(value)
  }

  const locale = {
    emptyText: (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={t('employee.no_data')}
      />
    ),
  }

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      page: pagination.current,
      pageSize: pagination.pageSize,
    })
    if (sorter.order) {
      setSort({
        sortColumn: sorter.field,
        sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
      })
    }
  }

  const convertBooleanToString = isManager => {
    if (isManager === 'true' || isManager === true) {
      return {
        color: 'success',
        label: t('employee.managers.true'),
      }
    } else if (isManager === 'false' || isManager === false) {
      return {
        color: 'processing',
        label: t('employee.managers.false'),
      }
    } else {
      return {
        color: 'default',
        label: t('employee.managers.unknown'),
      }
    }
  }

  const columns = [
    {
      title: 'ID',
      align: 'center',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: t('table_header.name'),
      align: 'center',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: t('table_header.status'),
      align: 'center',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (_, record) => (
        <Button
          type={record.status === 'active' ? 'primary' : 'danger'}
          onClick={() => {
            toggleStatus(record.id, record.status)
          }}
          style={{
            backgroundColor: record.status === 'active' ? '#1890ff' : '#ff4d4f',
            borderColor: 'transparent',
            color: 'white',
          }}
        >
          {record.status === 'active'
            ? t('button_input.active')
            : t('button_input.inactive')}
        </Button>
      ),
    },
    {
      title: t('table_header.position'),
      align: 'center',
      dataIndex: 'position',
      key: 'position',
      sorter: true,
    },
    {
      title: t('table_header.is_manager'),
      align: 'center',
      dataIndex: 'is_manager',
      key: 'is_manager',
      sorter: true,
      render: isManager => {
        const tagConfig = convertBooleanToString(isManager)
        return (
          <Tag icon={tagConfig.icon} color={tagConfig.color}>
            {tagConfig.label}
          </Tag>
        )
      },
    },
    {
      title: t('table_header.action'),
      align: 'center',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            key={`view-${record.id}`}
            onClick={() => viewDetail(record)}
            style={{ marginRight: 8 }}
            icon={<EyeOutlined />}
          />
          <Button
            key={`edit-${record.id}`}
            onClick={() => edit(record.id)}
            style={{ marginRight: 8 }}
            icon={<EditOutlined />}
          />
          <DeleteEmployee
            employeeId={record.id}
            key={`delete-${record.id}`}
            onClick={() => deleteRecord(record.id)}
            style={{ marginRight: 8 }}
            icon={<DeleteOutlined />}
          />
        </>
      ),
    },
  ]

  return (
    <div className="employeeLayout">
      <Breadcrumb items={breadcrumbItems} />
      <br />
      <Button
        type="primary"
        onClick={() => navigate('/admin/employees/create')}
        style={{ marginBottom: 16, float: 'right' }}
      >
        {t('button_input.create')}
      </Button>
      <CustomSearch handleChange={handleChange} />
      <div
        style={{
          overflow: 'auto',
          width: '100%',
          whiteSpace: 'nowrap',
          backgroundColor: 'white',
        }}
      >
        <CustomTable
          columns={columns}
          data={data?.data}
          handleTableChange={handleTableChange}
          edit={edit}
          viewDetail={viewDetail}
          deleteRecord={deleteRecord}
          pagination={{
            total: data?.pagination.total,
            current: pagination.page,
            pageSize: pagination.pageSize,
          }}
          locale={locale}
          loading={isLoading}
        />
      </div>
    </div>
  )
}

export default EmployeeList

import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDeleteEmployee } from '@hooks/useEmployee'
import { showToast } from '@components/toast/ToastCustom'
import PropTypes from 'prop-types'

const DeleteEmployee = ({ employeeId }) => {
  const { mutate: deleteEmployeeApi } = useDeleteEmployee()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { t } = useTranslation('translation')

  const handleDelete = async () => {
    try {
      await deleteEmployeeApi(employeeId, {
        onSuccess: () => {
          showToast(t('message.Employee_deleted_successfully'), 'success')
          setIsModalVisible(false)
        },
        onError: () => {
          showToast(t('message.Employee_deleted_fail'), 'error')
          setIsModalVisible(false)
        },
      })
    } catch (error) {
      showToast(t('message.Employee_deleted_fail'), 'error')
      setIsModalVisible(false)
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button icon={<DeleteOutlined />} onClick={showModal}></Button>
      <Modal
        title={t('message.delete_confirm')}
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText={t('message.yes')}
        cancelText={t('message.no')}
      ></Modal>
    </>
  )
}

DeleteEmployee.propTypes = {
  employeeId: PropTypes.string.isRequired, // Adjust the type as needed
}

export default DeleteEmployee

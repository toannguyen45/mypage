import React, { useState } from 'react'
import { Button, Modal } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useDeleteProject } from '@hooks/useProject'
import { showToast } from '@components/toast/ToastCustom'
import PropTypes from 'prop-types'

const DeleteProject = ({ projectId }) => {
  const { mutate: deleteProjectApi } = useDeleteProject()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { t } = useTranslation('translation')

  const handleDelete = async () => {
    try {
      await deleteProjectApi(projectId, {
        onSuccess: () => {
          showToast(t('message.Project_deleted_successfully'), 'success')
          setIsModalVisible(false)
        },
        onError: () => {
          showToast(t('message.Project_deleted_fail'), 'error')
          setIsModalVisible(false)
        },
      })
    } catch (error) {
      showToast(t('message.Project_deleted_fail'), 'error')
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

DeleteProject.propTypes = {
  projectId: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default DeleteProject

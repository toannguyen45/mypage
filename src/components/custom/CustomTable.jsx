/* eslint-disable react/prop-types */
import { SearchOutlined } from '@ant-design/icons'
import { Input, Table } from 'antd'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const CustomTable = ({
  columns,
  data,
  handleTableChange,
  pagination,
  loading,
  locale,
}) => {
  const { t } = useTranslation('translation')
  return (
    <Table
      className="table-header-responsive"
      columns={columns}
      dataSource={data}
      bordered={false}
      onChange={handleTableChange}
      showSorterTooltip={false}
      pagination={{
        ...pagination,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} ${t('pagination.of')} ${total} ${t(
            'pagination.items'
          )}`,
        showSizeChanger: true,
      }}
      loading={loading}
      scroll={{ x: true, y: '47vh' }}
      locale={locale}
    />
  )
}

CustomTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  handleTableChange: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
}

const CustomSearch = ({ handleChange }) => {
  const { t } = useTranslation('translation')
  return (
    <Input
      placeholder={t('button_input.search')}
      onChange={handleChange}
      style={{ width: 200, marginBottom: 16 }}
      prefix={<SearchOutlined />}
    />
  )
}

CustomSearch.propTypes = {
  handleChange: PropTypes.func.isRequired,
}

export { CustomSearch, CustomTable }

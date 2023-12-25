import { Flex, Spin } from 'antd'

const Spinner = () => {
  return (
    <Flex gap="small" vertical>
      <Spin size="large" fullscreen={true}>
        <div className="content" />
      </Spin>
    </Flex>
  )
}

export default Spinner

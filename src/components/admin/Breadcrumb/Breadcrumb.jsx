import { Breadcrumb as BreadcrumbAntd } from 'antd'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setSelectedKey } from '@redux/Slice/menuSlice'

const { Item } = BreadcrumbAntd

const Breadcrumb = ({ items }) => {
  const dispatch = useDispatch()

  return (
    <BreadcrumbAntd style={{ paddingBottom: 10 }}>
      {items?.map(({ id, route, title }, index) => (
        <Item key={id}>
          {index === items.length - 1 ? (
            <span>{title}</span>
          ) : (
            <Link
              to={route ?? `/${id}`}
              onClick={() => {
                dispatch(setSelectedKey(route ?? `/${id}`))
              }}
            >
              {title}
            </Link>
          )}
        </Item>
      ))}
    </BreadcrumbAntd>
  )
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      route: PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ),
}

export default Breadcrumb

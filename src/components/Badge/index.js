import React from 'react'
import PropTypes from 'prop-types'
import classNames from '../../utilities/classNames'

export const propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  status: PropTypes.string,
  white: PropTypes.bool
}

const Badge = props => {
  const {
    children,
    className,
    size,
    status,
    white,
    ...rest
  } = props

  const componentClassName = classNames(
    'c-Badge',
    size && `is-${size}`,
    status && `is-${status}`,
    white && 'is-white',
    className
  )

  return (
    <div className={componentClassName} {...rest}>
      {children}
    </div>
  )
}

Badge.propTypes = propTypes

export default Badge

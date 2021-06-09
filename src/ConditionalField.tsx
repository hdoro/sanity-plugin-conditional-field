import React from 'react'
import {
  withDocument,
  withValuePath,
  FormBuilderInput,
} from 'part:@sanity/form-builder'

class ConditionalField extends React.PureComponent<any> {
  fieldRef: any = React.createRef()

  focus() {
    if (this.fieldRef?.current) {
      this.fieldRef.current.focus()
    }
  }

  getContext(level = 1) {
    // gets value path from withValuePath HOC, and applies path to document
    // we remove the last 𝑥 elements from the valuePath

    const valuePath = this.props.getValuePath()
    const removeItems = -Math.abs(level)
    return valuePath.length + removeItems <= 0
      ? this.props.document
      : valuePath.slice(0, removeItems).reduce((context, current) => {
          // basic string path
          if (typeof current === 'string') {
            return context[current] || {}
          }

          // object path with key used on arrays
          if (
            typeof current === 'object' &&
            Array.isArray(context) &&
            current._key
          ) {
            return (
              context.filter(
                item => item._key && item._key === current._key
              )[0] || {}
            )
          }
        }, this.props.document)
  }

  render() {
    const {
      document,
      type,
      value,
      level,
      focusPath,
      onFocus,
      onBlur,
      onChange,
      getValuePath,
      markers = [],
      presence = [],
      compareValue,
    } = this.props
    const shouldRenderField(document, this.getContext.bind(this))
    const renderField = shouldRenderField ? shouldRenderField(document) : true

    if (!renderField) {
      return <div style={{ marginBottom: '-32px' }} />
    }

    const { type: _unusedType, inputComponent, ...usableType } = type
    return (
      <FormBuilderInput
        level={level}
        type={usableType}
        value={value}
        onChange={(patchEvent: any) => onChange(patchEvent)}
        path={getValuePath()}
        focusPath={focusPath}
        onFocus={onFocus}
        onBlur={onBlur}
        ref={this.fieldRef}
        markers={markers}
        presence={presence}
        compareValue={compareValue}
      />
    )
  }
}

export default withValuePath(withDocument(ConditionalField))

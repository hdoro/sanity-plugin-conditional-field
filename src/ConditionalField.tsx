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
    const shouldRenderField = type?.options?.condition
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

import React from 'react'
import { SanityDocument } from '@sanity/client'
import {
  withDocument,
  withValuePath,
  FormBuilderInput,
} from 'part:@sanity/form-builder'
import { PatchEvent, unset } from 'part:@sanity/form-builder/patch-event'
import HiddenField from './HiddenField'
import getParents, { Parent } from './getParents'

type RenderInfo = {
  renderField: boolean
  clearOnHidden: boolean
}

type ConditionReturn = boolean | { hidden: boolean; clearOnHidden?: boolean }

export type HideFunction = (props: {
  document: SanityDocument
  parents: Parent[]
}) => ConditionReturn | Promise<ConditionReturn>

export type HideOption = boolean | HideFunction

const DEFAULT_STATE: RenderInfo = {
  renderField: true,
  clearOnHidden: false,
}

async function parseCondition({
  document,
  hide,
  parents,
}: {
  document: SanityDocument
  hide?: HideOption
  parents: Parent[]
}): Promise<RenderInfo> {
  if (typeof hide === 'boolean') {
    return {
      ...DEFAULT_STATE,
      renderField: !hide,
    }
  }

  if (!hide || typeof hide !== 'function') {
    return DEFAULT_STATE
  }

  try {
    const hideField = await Promise.resolve(hide({ document, parents }))

    if (typeof hideField === 'boolean') {
      return {
        renderField: !hideField,
        clearOnHidden: false,
      }
    }

    return {
      renderField: !(typeof hideField.hidden === 'boolean'
        ? hideField.hidden
        : // Don't hide by default
          false),
      clearOnHidden: hideField.clearOnHidden || false,
    }
  } catch (error) {
    console.info('conditional-field: error running your `hide` condition', {
      error,
    })

    return DEFAULT_STATE
  }
}

class ConditionalField extends React.PureComponent<any, RenderInfo> {
  fieldRef: any = React.createRef()

  constructor(props: any) {
    super(props)
    this.state = DEFAULT_STATE
  }

  focus() {
    if (this.fieldRef?.current) {
      this.fieldRef.current.focus()
    }
  }

  getContext = (level = 1) => {
    // gets value path from withValuePath HOC, and applies path to document
    // we remove the last 𝑥 elements from the valuePath

    const valuePath = this.props.getValuePath()
    const removeItems = -Math.abs(level)
    return valuePath.length + removeItems <= 0
      ? this.props.document
      : valuePath
          .slice(0, removeItems)
          .reduce(
            (
              context: Record<string, unknown>,
              current: string | Record<string, unknown>,
            ) => {
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
                    (item) => item._key && item._key === current._key,
                  )[0] || {}
                )
              }

              return context
            },
            this.props.document,
          )
  }

  updateRender = async () => {
    const newState = await parseCondition({
      document: this.props.document,
      hide: this.props.type?.options?.hide,
      parents: getParents({
        valuePath: this.props.getValuePath(),
        document: this.props.document,
      }),
    })

    this.setState(newState)
  }

  componentDidUpdate() {
    this.updateRender()
  }

  componentDidMount() {
    this.updateRender()
  }

  render() {
    const {
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

    const { renderField, clearOnHidden } = this.state

    if (!renderField) {
      if (clearOnHidden && value) {
        onChange(PatchEvent.from(unset()))
      }
      return <HiddenField />
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
        markers={markers.map((marker: any) => ({
          ...marker,
          // Pass the right path for validation markers
          path: getValuePath(),
        }))}
        presence={presence}
        compareValue={compareValue}
      />
    )
  }
}

export default withValuePath(withDocument(ConditionalField))

import { SanityDocument } from '@sanity/client'

interface Props {
  valuePath: ValuePath[]
  document: SanityDocument
}

export type Parent = Record<string, unknown> | any[]

type ValuePath = string | { _key: string }

function pathToParent({ valuePath, document }: Props): Parent | undefined {
  if (!valuePath) {
    return
  }

  return valuePath.reduce((parent: Parent, current) => {
    // basic string path
    if (Array.isArray(parent)) {
      if (typeof current !== 'object' || !current._key) {
        return parent
      }

      return (
        parent.filter((item) => item._key && item._key === current._key)[0] ||
        {}
      )
    }

    if (typeof current === 'string') {
      return parent[current] || {}
    }

    return parent
  }, document)
}

export default function getParents({ valuePath, document }: Props): Parent[] {
  return (
    valuePath
      .reduce((acc: Parent[], _curPath, index) => {
        return [
          ...acc,
          pathToParent({
            document,
            // Get the parent up to the current entry
            valuePath: valuePath.slice(0, index),
          }),
        ].filter(Boolean) as Parent[]
      }, [])
      // Finally, we want the closest parents to come first
      .reverse()
  )
}

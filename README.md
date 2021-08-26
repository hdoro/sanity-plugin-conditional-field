# sanity-plugin-conditional-field

<!-- Hide or show a Sanity.io field based on a custom condition set by you. -->

---

🚨 **Warning:** as of [2.17.0](https://github.com/sanity-io/sanity/releases/tag/v2.17.0), Sanity now has [native support to conditional fields](https://www.sanity.io/docs/conditional-fields). Use that instead of this package, which is now archived.

---

<!-- ## Installation

Start by enabling it in your studio:

```
sanity install conditional-field
// or:
yarn install conditional-field
```

## Usage

You can use the ConditionalField component as the `inputComponent` of whatever field you want to conditionally render:

```js
import ConditionalField from 'sanity-plugin-conditional-field'

export default {
  title: 'Article',
  name: 'article',
  type: 'document',
  fields: [
    {
      name: 'internal',
      title: 'Is this article internal?',
      type: 'boolean',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'externalUrl',
      type: 'url',
      inputComponent: ConditionalField,
      options: {
        // Simple conditional based on top-level document value
        hide: ({ document }) => document.internal, // hide if internal article
      },
    },
  ],
}
```

### Async conditions

```js
{
  name: 'content',
  title: 'Content',
  type: 'array',
  of: [
    {type: 'block'},
  ]
  inputComponent: ConditionalField,
  options: {
    // Asynchronous conditions
    hide: async ({ document }) => {
      if (document.internal) {
        return true
      }

      const isValidContent = await fetch(`/api/is-valid-content/${document.externalUrl}`)
      return isValidContent ?
    }
  }
}
```

### Nested conditions

Besides the current `document`, the `hide` function receives a `parents` array for accessing contextual data.

It's ordered from closest parents to furthest, meaning `parents[0]` will always be the object the field is in, and `parents[-1]` will always be the full document. If the field is at the top-level of the document, `parents[0] === document`.

Here's an example of it in practice - notice how the `link` object is nested under an array, which means `parents[1]` will return the array with all the links:

```js
{
  name: 'links',
  title: 'Links',
  type: 'array',
  of: [
    {
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        {
          name: 'external',
          title: "Links to external websites?",
          type: 'boolean',
        },
        {
          name: 'url',
          title: 'External URL',
          type: 'string',
          inputComponent: ConditionalField,
          options: {
            hide: ({ parents }) => {
              // Parents array exposes the closest parents in order
              // Hence, parents[0] is the current object's value
              return parents[0].external
            },
          },
        },
        {
          name: 'internalLink',
          type: 'reference',
          to: [{ type: "page" }],
          inputComponent: ConditionalField,
          options: {
            hide: ({ parents }) => !parents[0].external
          },
        },
        {
          name: 'flashyLooks',
          type: 'boolean',
          inputComponent: ConditionalField,
          options: {
            // Prevent editors from making the link flashy if this link is not in the first position in the array
            hide: ({ parents }) => ({
              hidden: parents[1]?.indexOf(parents[0]) > 0 || false,
              // Clear field's value if hidden - see below
              clearOnHidden: true
            })
          },
        },
      ],
    },
  ],
},
```

### Deleting values if field is hidden

The `hide` function can also return an object to determine whether or not existing values should be cleared when the field is hidden. By default, this plugin won't clear values.

```js
{
  name: 'externalUrl',
  type: 'url',
  inputComponent: ConditionalField,
  options: {
    hide: ({ document }) => {
      hidden: !!document.internal,
      // Clear field's value if hidden
      clearOnHidden: true
    },
  },
},
```

### Typescript definitions

If you use Typescript in your schemas, here's how you type your `hide` functions:

```ts
import { HideOption } from 'sanity-plugin-conditional-field'

const hideBoolean: HideOption = false
const hideFunction: HideOption = ({ document, parents }) => ({
  hidden: document._id.includes('drafts.') || parents.length > 2,
})
```

And here's the shape of the `hide` options:

```ts
type ConditionReturn = boolean | { hidden: boolean; clearOnHidden?: boolean }

export type HideFunction = (props: {
  document: SanityDocument
  parents: Parent[]
}) => ConditionReturn | Promise<ConditionReturn>

export type HideOption = boolean | HideFunction
```

## Shortcomings

🚨 **Big red alert**: this plugin simply _hides_ fields if conditions aren't met. It doesn't interfere with validation, meaning that if you set a conditioned field as required, editors won't be able to publish documents when it's hidden.

Besides this, the following is true:

- Async conditions aren't debounced, meaning they'll be fired _a lot_
- There's no way of using this field with custom inputs
 -->

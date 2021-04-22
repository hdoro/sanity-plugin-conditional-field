# sanity-plugin-conditional-field

Hide or show a Sanity.io field based on a custom condition set by you.

## Installation

Start by enabling it in your studio:

```
sanity install conditional-field
// or:
yarn install conditional-field
```

Then, you can use the ConditionalField component as the `inputComponent` of whatever field you want to conditionally render:

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
      validation: Rule => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'block'}
      ]
      inputComponent: ConditionalField,
      options: {
        condition: document => document.internal === true
      }
    },
    {
      name: 'externalUrl',
      title: 'URL to the content',
      type: 'url',
      inputComponent: ConditionalField,
      options: {
        condition: document => !document.internal
      }
    },
  ],
}
```


🚨 **Big red alert**: this plugin simply _hides_ fields if conditions aren't met. It doesn't interfere with validation, meaning that if you set a conditioned field as required, editors won't be able to publish documents when it's hidden.

Take a look at the roadmap below for an idea on the plugin's shortcomings.

## Roadmap

- [ ] Prevent the extra whitespace from hidden fields
- [ ] Find a way to facilitate validation
- [ ] Consider adding a `injectConditionals` helper to wrap the `fields` array & automatically use this inputComponent when options.condition is set
  - Example: `injectConditionals([ { name: "title", type: "string", options: { condition: () => true } }])`
- [ ] Async conditions
  - Would require some debouncing in the execution of the condition function, else it'll fire off too many requests
  - Maybe an array of dependencies similar to React.useEffect
- [ ] get merged into `@sanity/base`
  - That's right! The goal of this plugin is to become obsolete. It'd be much better if the official type included in Sanity had this behavior from the get-go. Better for users and the platform :)

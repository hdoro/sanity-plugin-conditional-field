import React from 'react'

const HiddenField = () => {
  const fldRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Fields are wrapped by 2 divs custom inputs can't control
    // Let's go to the parent div and hide it
    const root = fldRef?.current?.parentElement?.parentElement
    if (root?.classList.value.includes('Field_root')) {
      root.style.display = 'none'
    }

    // Before unmounting, let's reset root's style
    return () => {
      if (root?.style) {
        root.style.display = 'block'
      }
    }
  }, [fldRef])

  return <div aria-hidden ref={fldRef} />
}

export default HiddenField

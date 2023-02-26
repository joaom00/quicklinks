## Acknowledgements

- [uiwtf](https://uiw.tf/quick-links)

## Component

```jsx
import * as React from 'react'
import ReactDOM from 'react-dom'
import { Command, useCommandState } from 'cmdk'
import * as Popover from '@radix-ui/react-popover'

export const QuickLinksContent = Popover.Anchor
export const QuickLinksInput = Command.Input
export const QuickLinksList = Command.List

/* -------------------------------------------------------------------------------------------------
 * QuickLinks
 * -----------------------------------------------------------------------------------------------*/

type QuickLinksContentValue = {
  viewport: HTMLDivElement | null
  onViewportChange: (viewport: HTMLDivElement | null) => void
}

const QuickLinksContext = React.createContext<QuickLinksContentValue | undefined>(undefined)

const useQuickLinksContext = () => {
  const context = React.useContext(QuickLinksContext)
  if (!context) {
    throw new Error(`useQuickLinksContext must be used within a QuickLinksContextProvider`)
  }
  return context
}

interface QuickLinksProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const QuickLinks = ({ children, open, onOpenChange }: QuickLinksProps) => {
  const [viewport, setViewport] = React.useState<HTMLDivElement | null>(null)

  const contextValue = React.useMemo(
    () => ({
      viewport,
      onViewportChange: setViewport,
    }),
    [viewport],
  )

  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange}>
      <Popover.Root open={open}>
        <QuickLinksContext.Provider value={contextValue}>{children}</QuickLinksContext.Provider>
      </Popover.Root>
    </Command.Dialog>
  )
}

/* -------------------------------------------------------------------------------------------------
 * QuickLinksViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'QuickLinksViewport'

type QuickLinksViewportElement = React.ComponentRef<typeof Popover.Content>
type PopoverContentProps = React.ComponentPropsWithoutRef<typeof Popover.Content>
interface QuickLinksViewportProps extends PopoverContentProps {}

export const QuickLinksViewport = React.forwardRef<
  QuickLinksViewportElement,
  QuickLinksViewportProps
>(({ side = 'right', align = 'start', sideOffset = 6, ...props }, forwardedRef) => {
  const context = useQuickLinksContext()
  return (
    <Popover.Portal>
      <Popover.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        {...props}
        ref={(node) => {
          context.onViewportChange(node)
          return forwardedRef
        }}
      />
    </Popover.Portal>
  )
})
QuickLinksViewport.displayName = VIEWPORT_NAME

/* -------------------------------------------------------------------------------------------------
 * QuickLinksItem
 * -----------------------------------------------------------------------------------------------*/

type QuickLinksItemContextValue = {
  value?: string
  textContent: string | null
  onSelect?: (value: string) => void
  disabled?: boolean
  onTextContentChange: (value: string | null) => void
}
const QuickLinksItemContext = React.createContext<QuickLinksItemContextValue | undefined>(undefined)

const useQuickLinksItemContext = () => {
  const context = React.useContext(QuickLinksItemContext)
  if (!context) {
    throw new Error('useQuickLinksItemContext must be used within QuickLinksItemContextProvider')
  }
  return context
}

interface QuickLinksItemProps {
  children: React.ReactNode
  value?: string
  onSelect?: (value: string) => void
  disabled?: boolean
}

export const QuickLinksItem = ({ children, ...props }: QuickLinksItemProps) => {
  const [textContent, setTextContent] = React.useState<string | null>(null)

  const contextValue = React.useMemo(
    () => ({
      ...props,
      textContent,
      onTextContentChange: setTextContent,
    }),
    [props, textContent],
  )

  return (
    <QuickLinksItemContext.Provider value={contextValue}>{children}</QuickLinksItemContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * QuickLinksItemContent
 * -----------------------------------------------------------------------------------------------*/

const ITEM_CONTENT_NAME = 'QuickLinksItemContent'

type QuickLinksItemContentElement = React.ElementRef<'div'>
type CommandItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof Command.Item>,
  'value' | 'onSelect' | 'disabled'
>
interface QuickLinksItemContentProps extends CommandItemProps {}

export const QuickLinksItemContent = React.forwardRef<
  QuickLinksItemContentElement,
  QuickLinksItemContentProps
>((props, forwardedRef) => {
  const context = useQuickLinksItemContext()
  return (
    <Command.Item
      {...props}
      onSelect={context.onSelect}
      value={context.value}
      disabled={context.disabled}
      ref={(node) => {
        if (node) {
          context.onTextContentChange(node.textContent)
        }
        return forwardedRef
      }}
    />
  )
})
QuickLinksItemContent.displayName = ITEM_CONTENT_NAME

/* -------------------------------------------------------------------------------------------------
 * QuickLinksItemPreview
 * -----------------------------------------------------------------------------------------------*/

const ITEM_PREVIEW_NAME = 'QuickLinksItemPreview'

type QuickLinksPreviewElement = React.ElementRef<'div'>
type QuickLinksPreviewProps = React.ComponentPropsWithoutRef<'div'>

export const QuickLinksItemPreview = React.forwardRef<
  QuickLinksPreviewElement,
  QuickLinksPreviewProps
>((props, forwardedRef) => {
  const cmdkValue = useCommandState((state) => state.value)
  const context = useQuickLinksContext()
  const itemContext = useQuickLinksItemContext()
  const value = itemContext.value || itemContext.textContent?.toLowerCase()

  return context.viewport && value === cmdkValue
    ? ReactDOM.createPortal(<div {...props} ref={forwardedRef} />, context.viewport)
    : null
})
QuickLinksItemPreview.displayName = ITEM_PREVIEW_NAME
```

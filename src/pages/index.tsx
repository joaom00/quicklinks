import React from 'react'
import {
  QuickLinks,
  QuickLinksContent,
  QuickLinksInput,
  QuickLinksList,
  QuickLinksItem,
  QuickLinksItemContent,
  QuickLinksItemPreview,
  QuickLinksViewport,
} from '@/components/QuickLinks'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import styles from '@/styles/Home.module.css'
import { useCommandState } from 'cmdk'

export default function Home() {
  const [mounted, setMounted] = React.useState(false)
  const [wrapper, setWrapper] = React.useState<HTMLDivElement | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [mounted])

  return (
    <main className={styles.main}>
      <h1>QuickLinks</h1>
      <p>Just a component around the Cmdk and Radix Popover for you just copy</p>
      {mounted && (
        <QuickLinks open>
          <QuickLinksContent className="CommandDialog">
            <div className="CommandInput">
              <MagnifyingGlassIcon />
              <QuickLinksInput placeholder="Search links..." />
              <div aria-hidden>Search links...</div>
              <span className="divider" />
            </div>
            <QuickLinksList className="CommandList" ref={setWrapper}>
              <Highlight wrapper={wrapper} />
              <QuickLinksItem onSelect={() => window.open('https://cmdk.paco.me/', '_blank')}>
                <QuickLinksItemContent className="CommandItem">Cmdk</QuickLinksItemContent>
                <QuickLinksItemPreview className="Preview">
                  <img
                    src="https://cmdk.paco.me/og.png"
                    alt=""
                    style={{ borderRadius: 6, marginBottom: 8, width: '100%' }}
                  />
                  <p>Cmdk</p>
                  <p>Fast, composable, unstyled command menu for React</p>
                </QuickLinksItemPreview>
              </QuickLinksItem>
              <QuickLinksItem onSelect={() => window.open('https://paco.me/', '_blank')}>
                <QuickLinksItemContent className="CommandItem">Paco</QuickLinksItemContent>
                <QuickLinksItemPreview className="Preview">
                  <img
                    src="https://paco.me/twitter.png"
                    alt=""
                    style={{ borderRadius: 6, marginBottom: 8, width: '100%' }}
                  />
                  <p>Paco Coursey</p>
                  <p>
                    Crafting interfaces. Webmaster at Linear. Building polished software and web
                    experiences.
                  </p>
                </QuickLinksItemPreview>
              </QuickLinksItem>
              <QuickLinksItem onSelect={() => window.open('https://radix-ui.com/', '_blank')}>
                <QuickLinksItemContent className="CommandItem">Radix</QuickLinksItemContent>
                <QuickLinksItemPreview className="Preview">
                  <img
                    src="https://www.radix-ui.com/social/default.png"
                    alt=""
                    style={{ borderRadius: 6, marginBottom: 8, width: '100%' }}
                  />
                  <p>Radix UI</p>
                  <p>
                    An open-source React component library for building high-quality, accessible
                    design systems and web apps.
                  </p>
                </QuickLinksItemPreview>
              </QuickLinksItem>
              <QuickLinksItem onSelect={() => window.open('https://rauno.me/', '_blank')}>
                <QuickLinksItemContent className="CommandItem">Rauno</QuickLinksItemContent>
                <QuickLinksItemPreview
                  className="Preview"
                  style={{ display: 'flex', flexDirection: 'column', fontSize: 14 }}
                >
                  <img
                    src="https://rauno.me/og.png"
                    alt=""
                    style={{ borderRadius: 6, marginBottom: 8, width: '100%' }}
                  />
                  Rauno Freiberg
                </QuickLinksItemPreview>
              </QuickLinksItem>
            </QuickLinksList>
          </QuickLinksContent>
          <QuickLinksViewport />
        </QuickLinks>
      )}
    </main>
  )
}

type HighlightProps = {
  wrapper: HTMLDivElement | null
}
const Highlight = ({ wrapper }: HighlightProps) => {
  const value = useCommandState((state) => state.value)

  const [wrapperBoundingBox, setWrapperBoundingBox] = React.useState<DOMRect | null>(null)
  const [tabBoundingBox, setTabBoundingBox] = React.useState<DOMRect | null>(null)
  const [highlightedTab, setHighlightedTab] = React.useState(false)
  const [isHoveredFromNull, setIsHoveredFromNull] = React.useState(true)

  const highlightStyles: React.CSSProperties = {}

  if (tabBoundingBox && wrapperBoundingBox) {
    highlightStyles.transitionDuration = isHoveredFromNull ? '0ms' : '150ms'
    highlightStyles.opacity = value && highlightedTab ? 1 : 0
    highlightStyles.width = `${tabBoundingBox.width}px`
    highlightStyles.transform = `translateY(${tabBoundingBox.top - wrapperBoundingBox.top}px)`
  }

  React.useEffect(() => {
    if (value && wrapper) {
      const tabRect = wrapper.querySelector('[data-selected]')?.getBoundingClientRect() ?? null
      setTabBoundingBox(tabRect)
      setWrapperBoundingBox(wrapper.getBoundingClientRect())
      setIsHoveredFromNull(!highlightedTab)
      setHighlightedTab(true)
    }
  }, [value, wrapper, highlightedTab])

  return <div className="highlight" style={highlightStyles} />
}

import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react'
import LinkedText from './LinkedText'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { useState } from 'react'

export default function AssetCollapsible({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex flex-row items-center justify-center">
        {isOpen ? <RiArrowUpLine /> : <RiArrowDownLine />}
        <h3 className=" underline">Assets</h3>
      </CollapsibleTrigger>
      <CollapsibleContent className="whitespace-pre-line">
        <LinkedText text={text} />
      </CollapsibleContent>
    </Collapsible>
  )
}
